/**
 * Hubtel SMS Integration for RentBase
 * Sends SMS notifications for contracts and reports
 */

interface SMSResponse {
    success: boolean
    messageId?: string
    error?: string
}

export function useSMS() {
    const config = useRuntimeConfig()
    const sending = ref(false)
    const error = ref<string | null>(null)

    /**
     * Send SMS via Hubtel API (server-side)
     */
    async function sendSMS(
        phoneNumber: string,
        message: string
    ): Promise<SMSResponse> {
        sending.value = true
        error.value = null

        try {
            // Format phone number for Ghana
            const formattedPhone = formatPhoneForSMS(phoneNumber)

            const response = await $fetch('/api/sms/send', {
                method: 'POST',
                body: {
                    to: formattedPhone,
                    message
                }
            })

            return response as SMSResponse
        } catch (e: any) {
            error.value = e.message || 'Failed to send SMS'
            return { success: false, error: error.value || undefined }
        } finally {
            sending.value = false
        }
    }

    /**
     * Send contract signing link via SMS
     */
    async function sendContractSigningLink(
        phoneNumber: string,
        partyName: string,
        partyType: 'landlord' | 'tenant',
        propertyAddress: string,
        signingLink: string
    ): Promise<SMSResponse> {
        const message = `Hello ${partyName},\n\n` +
            `You have a tenancy agreement to sign for:\n` +
            `📍 ${propertyAddress}\n\n` +
            `Sign here: ${signingLink}\n\n` +
            `- RentBase`

        return sendSMS(phoneNumber, message)
    }

    /**
     * Send condition report link via SMS
     */
    async function sendReportLink(
        phoneNumber: string,
        recipientName: string,
        reportId: string,
        propertyAddress: string
    ): Promise<SMSResponse> {
        const baseUrl = config.public.appUrl || 'http://localhost:3000'
        const link = `${baseUrl}/retrieve`

        const message = `Hello ${recipientName},\n\n` +
            `Your Deposit Shield report is ready!\n` +
            `📍 ${propertyAddress}\n` +
            `🔑 ID: ${reportId.slice(0, 8)}...\n\n` +
            `Retrieve: ${link}\n\n` +
            `- RentBase`

        return sendSMS(phoneNumber, message)
    }

    /**
     * Send contract finalized notification
     */
    async function sendContractFinalizedSMS(
        phoneNumber: string,
        partyName: string,
        propertyAddress: string,
        viewLink: string
    ): Promise<SMSResponse> {
        const message = `Hello ${partyName},\n\n` +
            `Your tenancy agreement for ${propertyAddress} has been finalized!\n\n` +
            `View & Download: ${viewLink}\n\n` +
            `- RentBase`

        return sendSMS(phoneNumber, message)
    }

    /**
     * Format phone number for Hubtel
     */
    function formatPhoneForSMS(phone: string): string {
        // Remove all non-digits
        let cleaned = phone.replace(/\D/g, '')

        // Handle Ghana numbers
        if (cleaned.startsWith('0')) {
            cleaned = '233' + cleaned.slice(1)
        } else if (!cleaned.startsWith('233')) {
            cleaned = '233' + cleaned
        }

        return cleaned
    }

    return {
        sending,
        error,
        sendSMS,
        sendContractSigningLink,
        sendReportLink,
        sendContractFinalizedSMS,
    }
}
