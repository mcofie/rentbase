
export async function sendSMS(phone: string, message: string) {
    const config = useRuntimeConfig()
    const clientId = config.hubtelClientId
    const clientSecret = config.hubtelClientSecret
    const from = config.hubtelSenderId || 'RentBase'

    // Clean phone number (remove +)
    const formattedPhone = phone.replace('+', '').trim()

    if (!clientId || !clientSecret) {
        console.log('[SMS Mock]', { to: formattedPhone, message })
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
                To: formattedPhone,
                Content: message.slice(0, 160),
                RegisteredDelivery: true
            })
        })
        const data = await res.json()

        if (data.Status !== 'Success' && data.Status !== '0') {
            console.error('Hubtel SMS Error Response:', data)
        }

        return data
    } catch (e) {
        console.error('Hubtel SMS Exception:', e)
        throw e
    }
}
