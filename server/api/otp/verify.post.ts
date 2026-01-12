import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
    const body = await readBody(event)
    const { phone, code } = body

    if (!phone || !code) {
        throw createError({ statusCode: 400, statusMessage: 'Phone and Code required' })
    }

    const client = await serverSupabaseClient(event)

    // Verify Code
    // Check for exact match and not expired
    const { data, error } = await client
        .from('verification_codes')
        .select('*')
        .eq('phone', phone)
        .eq('code', code)
        .gt('expires_at', new Date().toISOString())
        .order('created_at', { ascending: false })
        .limit(1)
        .single()

    if (error || !data) {
        throw createError({ statusCode: 400, statusMessage: 'Invalid or expired code' })
    }

    // Optional: Delete code after use to prevent replay?
    // await client.from('verification_codes').delete().eq('id', data.id)

    return { success: true, verified: true }
})
