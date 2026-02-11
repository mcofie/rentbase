import { serverSupabaseServiceRole } from '#supabase/server'

export default defineEventHandler(async (event) => {
    const body = await readBody(event)
    const { profileId, role, isVerified } = body

    if (!profileId) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Profile ID is required'
        })
    }

    const client = await serverSupabaseServiceRole(event)

    const { data, error } = await (client as any)
        .schema('rentbase')
        .from('profiles')
        .update({
            role: role,
            is_verified: isVerified
        })
        .eq('id', profileId)
        .select()
        .single()

    if (error) {
        console.error('Error updating agent account:', JSON.stringify(error, null, 2))
        throw createError({
            statusCode: 500,
            statusMessage: 'Failed to update agent account'
        })
    }

    return { success: true, profile: data }
})
