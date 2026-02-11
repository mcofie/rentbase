import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig()
    const supabase = createClient(
        config.public.supabaseUrl,
        config.supabaseServiceRoleKey,
        { db: { schema: 'rentbase' } }
    )

    const { data: settings, error } = await supabase
        .from('system_settings')
        .select('*')

    if (error) {
        console.error('[AdminAPI] Fetch Settings Error:', error.message)
        // If table doesn't exist yet, return defaults to avoid breaking UI
        return {
            settings: [
                { key: 'price_contract', value: { amount: 40, currency: 'GHS' }, description: 'Price for generating a tenancy agreement' },
                { key: 'price_condition_report', value: { amount: 25, currency: 'GHS' }, description: 'Price for generating a condition report' }
            ]
        }
    }

    return { settings: settings || [] }
})
