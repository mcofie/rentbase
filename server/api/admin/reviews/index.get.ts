import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig()

    const supabase = createClient(
        config.public.supabaseUrl,
        config.supabaseServiceRoleKey,
        {
            db: { schema: 'rentbase' }
        }
    )

    const query = getQuery(event)
    const limit = parseInt(query.limit as string) || 20
    const offset = parseInt(query.offset as string) || 0

    const { data, count, error } = await supabase
        .from('reviews')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1)

    if (error) {
        console.error('[AdminAPI] Reviews Error:', error.message)
        throw createError({
            statusCode: 500,
            message: 'Database query failed'
        })
    }

    return {
        reviews: data || [],
        total: count || 0
    }
})
