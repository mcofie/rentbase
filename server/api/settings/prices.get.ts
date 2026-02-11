import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig()
    const supabase = createClient(
        config.public.supabaseUrl,
        config.public.supabaseAnonKey, // Use anon key for public
        { db: { schema: 'rentbase' } }
    )

    // Fetch only the specific price keys
    const { data: settings, error } = await supabase
        .from('system_settings')
        .select('key, value')
        .in('key', ['price_contract', 'price_condition_report'])

    // Default prices if anything fails
    const prices = {
        price_contract: 40,
        price_condition_report: 25
    }

    if (!error && settings) {
        settings.forEach(s => {
            if (s.key === 'price_contract') prices.price_contract = s.value.amount
            if (s.key === 'price_condition_report') prices.price_condition_report = s.value.amount
        })
    }

    return prices
})
