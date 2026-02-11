/**
 * Hubtel SMS API endpoint
 * POST /api/sms/send
 * 
 * SECURITY: This endpoint should only be called from server-side code
 * Rate limited to prevent abuse
 */

import { rateLimit, ipRateLimitKey } from '~/server/utils/rateLimit'
import { validatePhone, validateText } from '~/server/utils/validation'
import { sendSMS } from '~/server/utils/sms'

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

    try {
        const response = await sendSMS(validatedPhone, validatedMessage)

        return {
            success: true,
            messageId: response.MessageId || response.messageId || response.requestId,
            status: response.Status || response.status
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
