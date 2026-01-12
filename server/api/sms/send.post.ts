/**
 * Hubtel SMS API endpoint
 * POST /api/sms/send
 * 
 * SECURITY: This endpoint should only be called from server-side code
 * Rate limited to prevent abuse
 */

import { rateLimit, ipRateLimitKey } from '~/server/utils/rateLimit'
import { validatePhone, validateText } from '~/server/utils/validation'

export default defineEventHandler(async (event) => {
    // Rate limit: 10 SMS per IP per hour
    await rateLimit(event, {
        max: 10,
        windowMs: 60 * 60 * 1000, // 1 hour
        message: 'SMS limit reached. Please try again later.'
    })

    const body = await readBody(event)
    const config = useRuntimeConfig()

    const { to, message } = body

    // Validate phone number
    const phoneValidation = validatePhone(to)
    if (!phoneValidation.valid) {
        throw createError({
            statusCode: 400,
            message: phoneValidation.error || 'Invalid phone number'
        })
    }

    // Validate message
    const messageValidation = validateText(message, {
        required: true,
        minLength: 1,
        maxLength: 160
    })
    if (!messageValidation.valid) {
        throw createError({
            statusCode: 400,
            message: messageValidation.error || 'Invalid message'
        })
    }

    const validatedPhone = phoneValidation.value.replace('+', '')
    const validatedMessage = messageValidation.value

    // Hubtel credentials from environment
    const clientId = config.hubtelClientId
    const clientSecret = config.hubtelClientSecret
    const senderId = config.hubtelSenderId || 'RentBase'

    if (!clientId || !clientSecret) {
        console.warn('Hubtel credentials not configured, SMS will be logged only')
        console.log(`[SMS] To: ${validatedPhone}, Message: ${validatedMessage}`)
        return {
            success: true,
            messageId: `mock_${Date.now()}`,
            note: 'SMS logged (Hubtel not configured)'
        }
    }

    try {
        // Hubtel SendSMS API
        const auth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64')

        const response = await $fetch('https://smsc.hubtel.com/v1/messages/send', {
            method: 'POST',
            headers: {
                'Authorization': `Basic ${auth}`,
                'Content-Type': 'application/json'
            },
            body: {
                From: senderId,
                To: validatedPhone,
                Content: validatedMessage,
                RegisteredDelivery: true
            }
        })

        return {
            success: true,
            messageId: (response as any).MessageId,
            status: (response as any).Status
        }
    } catch (error: any) {
        console.error('Hubtel SMS error:', error)

        return {
            success: false,
            error: 'Failed to send SMS',
            fallback: true
        }
    }
})
