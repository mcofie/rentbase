import { serverSupabaseClient } from '#supabase/server'
import crypto from 'crypto'
import { rateLimit, phoneRateLimitKey } from '~/server/utils/rateLimit'
import { validatePhone } from '~/server/utils/validation'

/**
 * Send Hubtel SMS (server-side utility)
 */
async function sendHubtelSMS(phone: string, message: string, config: any) {
    const clientId = config.hubtelClientId
    const clientSecret = config.hubtelClientSecret
    const from = config.hubtelSenderId || 'RentBase'

    if (!clientId || !clientSecret) {
        console.log('[SMS Mock]', { to: phone, message })
        return { success: true, mock: true }
    }

    const auth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64')

    try {
        const res = await fetch('https://smsc.hubtel.com/v1/messages/send', {
            method: 'POST',
            headers: {
                'Authorization': `Basic ${auth}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                From: from,
                To: phone,
                Content: message.slice(0, 160),
                RegisteredDelivery: true
            })
        })
        const data = await res.json()
        return data
    } catch (e) {
        console.error('Hubtel SMS Error:', e)
        throw e
    }
}

export default defineEventHandler(async (event) => {
    const body = await readBody(event)
    const { phone } = body

    // Validate phone number
    const phoneValidation = validatePhone(phone)
    if (!phoneValidation.valid) {
        throw createError({
            statusCode: 400,
            statusMessage: phoneValidation.error || 'Invalid phone number'
        })
    }

    const validatedPhone = phoneValidation.value

    // Rate limit: 3 OTP requests per phone per 10 minutes
    await rateLimit(event, {
        max: 3,
        windowMs: 10 * 60 * 1000, // 10 minutes
        keyGenerator: () => phoneRateLimitKey(event, validatedPhone),
        message: 'Too many OTP requests. Please wait 10 minutes.'
    })

    const client = await serverSupabaseClient(event)
    const config = useRuntimeConfig()

    // Generate cryptographically secure 4-digit code
    const code = crypto.randomInt(1000, 9999).toString()
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000) // 10 mins

    // Delete any existing codes for this phone (prevent accumulation)
    await (client.from('verification_codes') as any)
        .delete()
        .eq('phone', validatedPhone)

    // Store new code in DB
    const { error } = await (client.from('verification_codes') as any)
        .insert({
            phone: validatedPhone,
            code,
            expires_at: expiresAt.toISOString()
        })

    if (error) {
        console.error('OTP Save Error:', error)
        throw createError({ statusCode: 500, statusMessage: 'Failed to generate OTP' })
    }

    // Send SMS
    const message = `Your RentBase verification code is: ${code}. Valid for 10 minutes.`
    await sendHubtelSMS(validatedPhone.replace('+', ''), message, config)

    return { success: true }
})
