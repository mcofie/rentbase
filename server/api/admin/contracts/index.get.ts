import { createSupabaseServer } from '~/server/utils/supabase'

export default defineEventHandler(async (event) => {
    const client = createSupabaseServer()

    try {
        const { data: contracts, error } = await client
            .from('contracts')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(100)

        if (error) throw error

        return contracts || []

    } catch (err: any) {
        throw createError({
            statusCode: 500,
            message: err.message || 'Failed to fetch contracts'
        })
    }
})
