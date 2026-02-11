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
    const search = (query.search as string || '').toLowerCase()

    // Build query
    let dbQuery = supabase
        .from('transactions')
        .select(`
            *,
            profile:profiles(phone_number)
        `, { count: 'exact' })

    if (search) {
        dbQuery = dbQuery.or(`reference.ilike.%${search}%,feature_type.ilike.%${search}%,status.ilike.%${search}%`)
    }

    const { data: transactions, count, error } = await dbQuery
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1)

    if (error) {
        console.error('[AdminAPI] Payments Error:', error.message)
        throw createError({
            statusCode: 500,
            message: 'Database query failed'
        })
    }

    // Now, for each transaction, let's try to find if there's a linked contract or report to get the customer email
    // This is because some users pay before sign up
    const references = transactions?.map(t => t.reference) || []

    if (references.length > 0) {
        const [contractsRes, reportsRes] = await Promise.all([
            supabase.from('contracts').select('payment_ref, customer_email').in('payment_ref', references),
            supabase.from('condition_reports').select('payment_ref, customer_email').in('payment_ref', references)
        ])

        const contracts = contractsRes.data || []
        const reports = reportsRes.data || []

        // Merge info
        const payments = transactions.map(t => {
            const contract = contracts.find(c => c.payment_ref === t.reference)
            const report = reports.find(r => r.payment_ref === t.reference)
            return {
                ...t,
                customer_email: contract?.customer_email || report?.customer_email || null
            }
        })

        return {
            payments,
            total: count || 0
        }
    }

    return {
        payments: transactions || [],
        total: count || 0
    }
})
