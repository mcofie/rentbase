import { serverSupabaseServiceRole } from '#supabase/server'
import crypto from 'crypto'
import { rateLimit, phoneRateLimitKey } from '~/server/utils/rateLimit'
import { validatePhone } from '~/server/utils/validation'
import { sendSMS } from '~/server/utils/sms'

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

    // Use service role client to bypass RLS for anonymous users
    const client = await serverSupabaseServiceRole(event)

    // Generate cryptographically secure 4-digit code
    const code = crypto.randomInt(1000, 9999).toString()
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000) // 10 mins

    // Delete any existing codes for this phone (prevent accumulation)
    const { error: deleteError } = await (client as any)
        .schema('rentbase')
        .from('verification_codes')
        .delete()
        .eq('phone', validatedPhone)

    if (deleteError) {
        console.error('OTP Delete Error:', JSON.stringify(deleteError, null, 2))
    }

    // Store new code in DB
    const { error } = await (client as any)
        .schema('rentbase')
        .from('verification_codes')
        .insert({
            phone: validatedPhone,
            code,
            expires_at: expiresAt.toISOString()
        })

    if (error) {
        console.error('OTP Save Error:', JSON.stringify(error, null, 2))
        throw createError({ statusCode: 500, statusMessage: 'Failed to generate OTP: ' + error.message })
    }

    // Send SMS
    const message = `Your RentBase verification code is: ${code}. Valid for 10 minutes.`
    await sendSMS(validatedPhone, message)

    return { success: true }
})
