
import { serverSupabaseServiceRole } from '#supabase/server'
import { sendDiscordNotification } from '~/server/utils/discord'

export default defineEventHandler(async (event) => {
    const body = await readBody(event)
    const { contractId } = body

    if (!contractId) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Contract ID is required'
        })
    }

    const client = await serverSupabaseServiceRole(event)

    // Fetch contract details
    const { data: contract, error } = await (client as any)
        .schema('rentbase')
        .from('contracts')
        .select('*')
        .eq('id', contractId)
        .single()

    if (error || !contract) {
        throw createError({
            statusCode: 404,
            statusMessage: 'Contract not found'
        })
    }

    const details = contract.details || {}

    // Send Discord Notification
    await sendDiscordNotification(
        `📝 **New Tenancy Agreement Drafted**\n` +
        `**ID:** ${contractId}\n` +
        `**Landlord:** ${details.landlord_name || 'N/A'}\n` +
        `**Tenant:** ${details.tenant_name || 'N/A'}\n` +
        `**Property:** ${details.property_address || 'N/A'}`,
        'info'
    )

    return { success: true }
})
