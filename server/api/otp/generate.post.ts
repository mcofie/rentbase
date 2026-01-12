import { serverSupabaseClient } from '#supabase/server'
// Simple in-memory or helper for sending SMS (Mock or Real)
// We already have useSMS composable on frontend, but backend needs direct Hubtel access or shared utility.
// For now, I'll inline the Hubtel fetch or reuse if available.
// NOTE: Ideally we should move SMS logic to a shared server util.

async function sendHubtelSMS(phone: string, message: string, config: any) {
    const clientId = config.hubtelClientId
    const clientSecret = config.hubtelClientSecret
    const from = config.hubtelSenderId || 'RentBase'

    const url = `https://smsc.hubtel.com/v1/messages/send?clientsecret=${clientSecret}&clientid=${clientId}&from=${from}&to=${phone}&content=${encodeURIComponent(message)}`

    try {
        const res = await fetch(url)
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

    if (!phone) {
        throw createError({ statusCode: 400, statusMessage: 'Phone number required' })
    }

    const client = await serverSupabaseClient(event)
    const config = useRuntimeConfig()

    // Generate 4-digit Code
    const code = Math.floor(1000 + Math.random() * 9000).toString()
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000) // 10 mins

    // Store in DB
    const { error } = await (client
        .from('verification_codes') as any)
        .insert({
            phone,
            code,
            expires_at: expiresAt.toISOString()
        })

    if (error) {
        console.error('OTP Save Error:', error)
        throw createError({ statusCode: 500, statusMessage: 'Failed to generate OTP' })
    }

    // Send SMS
    const message = `Your RentBase verification code is: ${code}. Valid for 10 minutes.`
    await sendHubtelSMS(phone, message, config)

    return { success: true }
})
