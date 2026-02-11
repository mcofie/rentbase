
import { serverSupabaseServiceRole } from '#supabase/server'
import { sendDiscordNotification } from '~/server/utils/discord'

export default defineEventHandler(async (event) => {
    const body = await readBody(event)
    const { reportId } = body

    if (!reportId) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Report ID is required'
        })
    }

    const client = await serverSupabaseServiceRole(event)

    // Fetch report details
    const { data: report, error } = await (client as any)
        .schema('rentbase')
        .from('condition_reports')
        .select('*')
        .eq('id', reportId)
        .single()

    if (error || !report) {
        throw createError({
            statusCode: 404,
            statusMessage: 'Report not found'
        })
    }

    // Send Discord Notification
    await sendDiscordNotification(
        `🛡️ **New Condition Report Drafted**\n` +
        `**ID:** ${report.short_code || reportId}\n` +
        `**Location:** ${report.property_address || 'N/A'}\n` +
        `**Type:** ${report.report_type || 'N/A'}`,
        'info'
    )

    return { success: true }
})
