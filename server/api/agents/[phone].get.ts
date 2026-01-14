import { serverSupabaseServiceRole } from '#supabase/server'
import { formatPhoneE164 } from '~/utils/formatPhone'

export default defineEventHandler(async (event) => {
    const phone = getRouterParam(event, 'phone')

    if (!phone) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Phone number is required'
        })
    }

    // Format phone to E164 (decode first to handle %2B correctly)
    const e164 = formatPhoneE164(decodeURIComponent(phone))

    const client = await serverSupabaseServiceRole(event)

    // Fetch both profile and approved claim in parallel
    const [profileResult, claimResult] = await Promise.all([
        (client as any)
            .schema('rentbase')
            .from('profiles')
            .select('*')
            .eq('phone_number', e164)
            .eq('role', 'agent')
            .single(),
        (client as any)
            .schema('rentbase')
            .from('agent_claims')
            .select('*')
            .eq('phone', e164)
            .eq('status', 'approved')
            .single()
    ])

    // Determine agent status
    let isVerified = false
    let agentData = null

    if (profileResult.data) {
        isVerified = true
        agentData = {
            phone_number: profileResult.data.phone_number,
            full_name: profileResult.data.full_name || null,
            agency_name: profileResult.data.agency_name || null,
            location: profileResult.data.location || null,
            is_verified: profileResult.data.is_verified,
            role: profileResult.data.role
        }
    } else if (claimResult.data) {
        // Agent has an approved claim
        isVerified = true
        agentData = {
            phone_number: claimResult.data.phone,
            full_name: claimResult.data.full_name,
            agency_name: claimResult.data.agency_name,
            location: claimResult.data.location,
            is_verified: true,
            role: 'agent'
        }
    }

    return {
        isVerified,
        agent: agentData
    }
})
