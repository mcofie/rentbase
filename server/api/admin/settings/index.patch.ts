import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
    const body = await readBody(event)
    const { settings } = body // Expected: Array of { key, value }

    if (!settings || !Array.isArray(settings)) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Invalid settings data'
        })
    }

    const config = useRuntimeConfig()
    const supabase = createClient(
        config.public.supabaseUrl,
        config.supabaseServiceRoleKey,
        { db: { schema: 'rentbase' } }
    )

    // Upsert each setting
    for (const item of settings) {
        const { error } = await supabase
            .from('system_settings')
            .upsert({
                key: item.key,
                value: item.value,
                updated_at: new Date().toISOString()
            }, { onConflict: 'key' })

        if (error) {
            console.error(`[AdminAPI] Update Setting Error (${item.key}):`, error.message)
            throw createError({
                statusCode: 500,
                statusMessage: `Failed to update ${item.key}`
            })
        }
    }

    return { success: true }
})
