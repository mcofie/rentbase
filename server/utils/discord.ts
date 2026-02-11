
export const sendDiscordNotification = async (message: string, type: 'info' | 'success' | 'warning' | 'error' = 'info') => {
    const config = useRuntimeConfig()
    const webhookUrl = config.discordWebhookUrl

    if (!webhookUrl) {
        console.warn('[Discord] Webhook URL not configured. Skipping notification.')
        return
    }

    const typeColors = {
        info: 3447003,    // Blue
        success: 3066993, // Green
        warning: 15105570, // Orange
        error: 15158332    // Red
    }

    const embed = {
        description: message,
        color: typeColors[type],
        timestamp: new Date().toISOString(),
        footer: {
            text: 'RentBase System'
        }
    }

    try {
        await $fetch(webhookUrl, {
            method: 'POST',
            body: {
                embeds: [embed]
            }
        })
        console.log('[Discord] Notification sent successfully')
    } catch (error: any) {
        console.error('[Discord] Failed to send notification:', error?.message || error)
    }
}
