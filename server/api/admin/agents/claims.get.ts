import { serverSupabaseServiceRole } from '#supabase/server'

export default defineEventHandler(async (event) => {
    // Use service role for admin operations
    const client = await serverSupabaseServiceRole(event)

    // Get query params for filtering
    const query = getQuery(event)
    const status = query.status as string | undefined

    // Build query with explicit schema
    let dbQuery = (client as any)
        .schema('rentbase')
        .from('agent_claims')
        .select('*')
        .order('created_at', { ascending: false })

    // Filter by status if provided
    if (status && ['pending', 'approved', 'rejected'].includes(status)) {
        dbQuery = dbQuery.eq('status', status)
    }

    const { data, error } = await dbQuery

    if (error) {
        console.error('Error fetching claims:', JSON.stringify(error, null, 2))
        throw createError({
            statusCode: 500,
            statusMessage: 'Failed to fetch agent claims'
        })
    }

    return { claims: data || [] }
})
