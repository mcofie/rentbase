import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
    const body = await readBody(event)
    const { agent_phone, rating, comment, reviewer_phone, reviewer_id } = body

    if (!agent_phone || !rating) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Missing required fields'
        })
    }

    // Basic Self-Review Check
    if (reviewer_phone && agent_phone === reviewer_phone) {
        throw createError({
            statusCode: 400,
            statusMessage: 'You cannot review yourself'
        })
    }

    const client = await serverSupabaseClient(event)

    // Get IP for spam prevention (simplified)
    const ip = getRequestHeader(event, 'x-forwarded-for') || event.node.req.socket.remoteAddress

    // TODO: Rate limiting check could go here (e.g. check last review from this IP for this agent)

    const { error } = await client
        .schema("rentbase")
        .from('reviews')
        .insert({
            agent_phone,
            reviewer_id: reviewer_id || null, // Optional for anonymous
            reviewer_phone: reviewer_phone || null,
            rating,
            comment,
            ip_address: ip,
            session_id: null // Can be added later if we use session tracking
        } as any)

    if (error) {
        console.error('Review submission error:', error)
        throw createError({
            statusCode: 500,
            statusMessage: error.message
        })
    }

    return { success: true }
})
