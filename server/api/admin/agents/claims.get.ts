import { serverSupabaseServiceRole } from '#supabase/server'

export default defineEventHandler(async (event) => {
    const client = await serverSupabaseServiceRole(event)

    // 1. Fetch claims
    const { data: claims, error: claimsError } = await (client as any)
        .schema('rentbase')
        .from('agent_claims')
        .select('*')
        .order('created_at', { ascending: false })

    if (claimsError) {
        throw createError({
            statusCode: 500,
            statusMessage: 'Failed to fetch agent claims'
        })
    }

    // 2. Fetch profiles that match the phone numbers in claims
    if (claims && claims.length > 0) {
        const phones = claims.map((c: any) => c.phone)
        const { data: profiles, error: profilesError } = await (client as any)
            .schema('rentbase')
            .from('profiles')
            .select('id, phone_number, role, is_verified')
            .in('phone_number', phones)

        if (!profilesError && profiles) {
            // Merge profiles into claims
            const claimsWithProfiles = claims.map((claim: any) => {
                const profile = profiles.find((p: any) => p.phone_number === claim.phone)
                return {
                    ...claim,
                    profile: profile || null
                }
            })
            return { claims: claimsWithProfiles }
        }
    }

    return { claims: claims || [] }
})
