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
    const limit = parseInt(query.limit as string) || 10
    const offset = parseInt(query.offset as string) || 0

    console.log(`[AdminAPI] Fetching contracts: limit=${limit}, offset=${offset}`)

    const { data, count, error } = await supabase
        .from('contracts')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1)

    if (error) {
        console.error('[AdminAPI] Contracts Error:', error.message)
        throw createError({
            statusCode: 500,
            message: 'Database query failed'
        })
    }

    console.log(`[AdminAPI] Success: Found ${data?.length} contracts out of ${count}`)

    return {
        contracts: data || [],
        total: count || 0
    }
})
