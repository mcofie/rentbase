/**
 * Send Contract Notifications API
 * POST /api/contracts/notify
 * 
 * Sends SMS to landlord & tenant with signing links
 * Sends email to tenant with signing link
 */

import { sendEmail, signingRequestEmail } from '~/server/utils/email'

interface NotifyRequest {
    contractId: string
    landlordName: string
    landlordPhone: string
    tenantName: string
    tenantPhone: string
    tenantEmail?: string
    propertyAddress: string
    // Full tokens for email (more trustworthy/professional)
    landlordSignToken: string
    tenantSignToken: string
    // Short codes for SMS (character-efficient)
    landlordShortCode?: string
    tenantShortCode?: string
}

// Format phone for Ghana (Hubtel requires 233XXXXXXXXX)
function formatPhoneForSMS(phone: string): string {
    let cleaned = phone.replace(/\D/g, '')
    if (cleaned.startsWith('0')) {
        cleaned = '233' + cleaned.slice(1)
    } else if (!cleaned.startsWith('233')) {
        cleaned = '233' + cleaned
    }
    return cleaned
}

export default defineEventHandler(async (event) => {
    const body = await readBody<NotifyRequest>(event)
    const config = useRuntimeConfig()

    const {
        contractId,
        landlordName,
        landlordPhone,
        tenantName,
        tenantPhone,
        tenantEmail,
        propertyAddress,
        landlordSignToken,
        tenantSignToken,
        landlordShortCode,
        tenantShortCode
    } = body

    // Validate required fields
    if (!contractId || !landlordPhone || !tenantPhone || !landlordSignToken || !tenantSignToken) {
        throw createError({
            statusCode: 400,
            message: 'Missing required fields'
        })
    }

    const appUrl = config.public.appUrl || 'https://rentbase.app'

    // Use short codes for SMS if available (saves ~30 characters!), else fallback to tokens
    const landlordSignUrl = `${appUrl}/s/${landlordShortCode || landlordSignToken}`
    const tenantSignUrl = `${appUrl}/s/${tenantShortCode || tenantSignToken}`

    const results = {
        landlordSMS: { success: false, error: '' },
        tenantSMS: { success: false, error: '' },
        tenantEmail: { success: false, error: '' }
    }

    // Hubtel credentials
    const clientId = config.hubtelClientId
    const clientSecret = config.hubtelClientSecret
    const senderId = config.hubtelSenderId || 'RentBase'

    // === SEND SMS TO LANDLORD ===
    const landlordMessage = `Hello ${landlordName},\n\n` +
        `Your tenancy agreement is ready for signing.\n` +
        `📍 ${propertyAddress}\n\n` +
        `Sign here: ${landlordSignUrl}\n\n` +
        `- RentBase`

    if (clientId && clientSecret) {
        try {
            const auth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64')

            await $fetch('https://smsc.hubtel.com/v1/messages/send', {
                method: 'POST',
                headers: {
                    'Authorization': `Basic ${auth}`,
                    'Content-Type': 'application/json'
                },
                body: {
                    From: senderId,
                    To: formatPhoneForSMS(landlordPhone),
                    Content: landlordMessage.slice(0, 160),
                    RegisteredDelivery: true
                }
            })
            results.landlordSMS = { success: true, error: '' }
        } catch (e: any) {
            console.error('[SMS] Landlord SMS failed:', e.message)
            results.landlordSMS = { success: false, error: e.message }
        }
    } else {
        console.log('[SMS] Landlord (mock):', landlordMessage)
        results.landlordSMS = { success: true, error: 'Hubtel not configured - logged only' }
    }

    // === SEND SMS TO TENANT ===
    const tenantMessage = `Hello ${tenantName},\n\n` +
        `Your tenancy agreement is ready for signing.\n` +
        `📍 ${propertyAddress}\n\n` +
        `Sign here: ${tenantSignUrl}\n\n` +
        `- RentBase`

    if (clientId && clientSecret) {
        try {
            const auth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64')

            await $fetch('https://smsc.hubtel.com/v1/messages/send', {
                method: 'POST',
                headers: {
                    'Authorization': `Basic ${auth}`,
                    'Content-Type': 'application/json'
                },
                body: {
                    From: senderId,
                    To: formatPhoneForSMS(tenantPhone),
                    Content: tenantMessage.slice(0, 160),
                    RegisteredDelivery: true
                }
            })
            results.tenantSMS = { success: true, error: '' }
        } catch (e: any) {
            console.error('[SMS] Tenant SMS failed:', e.message)
            results.tenantSMS = { success: false, error: e.message }
        }
    } else {
        console.log('[SMS] Tenant (mock):', tenantMessage)
        results.tenantSMS = { success: true, error: 'Hubtel not configured - logged only' }
    }

    // === SEND EMAIL TO TENANT ===
    if (tenantEmail) {
        const emailContent = signingRequestEmail(contractId, tenantName, 'tenant', tenantSignToken)
        emailContent.to = tenantEmail

        const emailResult = await sendEmail(emailContent)
        results.tenantEmail = {
            success: emailResult.success,
            error: emailResult.error || ''
        }
    } else {
        results.tenantEmail = { success: false, error: 'No tenant email provided' }
    }

    console.log('[Notifications] Contract notification results:', {
        contractId,
        landlordSMS: results.landlordSMS.success,
        tenantSMS: results.tenantSMS.success,
        tenantEmail: results.tenantEmail.success
    })

    return {
        success: true,
        results
    }
})
