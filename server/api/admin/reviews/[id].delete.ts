/**
 * Delete Review
 * DELETE /api/admin/reviews/[id]
 */
import { createSupabaseServer } from '~/server/utils/supabase'

export default defineEventHandler(async (event) => {
    const id = getRouterParam(event, 'id')

    if (!id) {
        throw createError({
            statusCode: 400,
            message: 'Review ID is required'
        })
    }

    const client = createSupabaseServer()

    const { error } = await client
        .from('reviews')
        .delete()
        .eq('id', id)

    if (error) {
        console.error('[Admin Reviews] Delete error:', error)
        throw createError({
            statusCode: 500,
            message: error.message
        })
    }

    return { success: true }
})
