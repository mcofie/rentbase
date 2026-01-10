/**
 * Hubtel SMS API endpoint
 * POST /api/sms/send
 */

export default defineEventHandler(async (event) => {
    const body = await readBody(event)
    const config = useRuntimeConfig()

    const { to, message } = body

    if (!to || !message) {
        throw createError({
            statusCode: 400,
            message: 'Missing required fields: to, message'
        })
    }

    // Hubtel credentials from environment
    const clientId = config.hubtelClientId
    const clientSecret = config.hubtelClientSecret
    const senderId = 'RentBase' // Your registered sender ID

    if (!clientId || !clientSecret) {
        console.warn('Hubtel credentials not configured, SMS will be logged only')
        console.log(`[SMS] To: ${to}, Message: ${message}`)
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
                To: to,
                Content: message.slice(0, 160), // SMS limit
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

        // Still return success for demo purposes, but log the error
        return {
            success: false,
            error: error.message || 'Failed to send SMS',
            fallback: true
        }
    }
})
