import { serverSupabaseServiceRole } from '#supabase/server'

export default defineEventHandler(async (event) => {
    const id = getRouterParam(event, 'id')
    const body = await readBody(event)
    const { status, adminNotes } = body

    if (!id) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Claim ID is required'
        })
    }

    if (!status || !['approved', 'rejected'].includes(status)) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Valid status (approved or rejected) is required'
        })
    }

    const client = await serverSupabaseServiceRole(event)

    // Fetch the claim first
    const { data: claim, error: fetchError } = await (client as any)
        .schema('rentbase')
        .from('agent_claims')
        .select('*')
        .eq('id', id)
        .single()

    if (fetchError || !claim) {
        throw createError({
            statusCode: 404,
            statusMessage: 'Claim not found'
        })
    }

    // Update the claim status
    const { error: updateError } = await (client as any)
        .schema('rentbase')
        .from('agent_claims')
        .update({
            status,
            admin_notes: adminNotes || null,
            reviewed_at: new Date().toISOString()
        })
        .eq('id', id)

    if (updateError) {
        console.error('Error updating claim:', JSON.stringify(updateError, null, 2))
        throw createError({
            statusCode: 500,
            statusMessage: 'Failed to update claim'
        })
    }

    // If approved, create or update the agent profile
    if (status === 'approved') {
        // Check if profile already exists
        const { data: existingProfile } = await (client as any)
            .schema('rentbase')
            .from('profiles')
            .select('id')
            .eq('phone_number', claim.phone)
            .single()

        if (existingProfile) {
            // Update existing profile to agent role
            const { error: profileUpdateError } = await (client as any)
                .schema('rentbase')
                .from('profiles')
                .update({
                    role: 'agent',
                    is_verified: true
                })
                .eq('id', existingProfile.id)

            if (profileUpdateError) {
                console.error('Error updating profile:', JSON.stringify(profileUpdateError, null, 2))
            }
        }

        // TODO: Send SMS notification to agent about approval
        console.log(`Agent claim approved for ${claim.phone} - ${claim.full_name}`)
    }

    return {
        success: true,
        message: `Claim ${status} successfully`,
        claim: {
            ...claim,
            status,
            admin_notes: adminNotes
        }
    }
})
