import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig()

    // Create service role client manually to ensure bypass of RLS
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

    console.log(`[AdminAPI] Fetching reports: limit=${limit}, offset=${offset}`)

    const { data, count, error } = await supabase
        .from('condition_reports')
        .select('*', { count: 'exact' })
        .order('report_date', { ascending: false })
        .range(offset, offset + limit - 1)

    if (error) {
        console.error('[AdminAPI] Error:', error.message)
        throw createError({
            statusCode: 500,
            message: 'Database query failed'
        })
    }

    console.log(`[AdminAPI] Success: Found ${data?.length} reports out of ${count}`)

    return {
        reports: data || [],
        total: count || 0
    }
})
