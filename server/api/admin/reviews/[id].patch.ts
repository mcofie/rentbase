/**
 * Update Review Status
 * PATCH /api/admin/reviews/[id]
 */
import { createSupabaseServer } from '~/server/utils/supabase'

export default defineEventHandler(async (event) => {
    const id = getRouterParam(event, 'id')
    const body = await readBody(event)
    const { status } = body

    if (!id) {
        throw createError({
            statusCode: 400,
            message: 'Review ID is required'
        })
    }

    if (!['approved', 'rejected', 'pending'].includes(status)) {
        throw createError({
            statusCode: 400,
            message: 'Invalid status'
        })
    }

    const client = createSupabaseServer()

    const { data, error } = await client
        .from('reviews')
        .update({ status })
        .eq('id', id)
        .select()
        .single()

    if (error) {
        console.error('[Admin Reviews] Update error:', error)
        throw createError({
            statusCode: 500,
            message: error.message
        })
    }

    return { success: true, review: data }
})
