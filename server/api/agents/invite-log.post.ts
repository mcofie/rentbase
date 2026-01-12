/**
 * Log agent invitation for analytics
 * POST /api/agents/invite-log
 */

import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
    const body = await readBody(event)
    const { agent_phone, inviter_name, sent_at } = body

    if (!agent_phone) {
        throw createError({
            statusCode: 400,
            message: 'Missing agent_phone'
        })
    }

    try {
        const supabase = await serverSupabaseClient(event)

        // Log to a simple table (we'll create this in the schema)
        // For now, just log to console if table doesn't exist
        const { error } = await (supabase
            .from('agent_invitations') as any)
            .insert({
                agent_phone,
                inviter_name: inviter_name || null,
                sent_at: sent_at || new Date().toISOString(),
                status: 'sent'
            })

        if (error) {
            // Table might not exist yet, just log
            console.log('[Agent Invite]', { agent_phone, inviter_name, sent_at })
            return { logged: false, note: 'Invitation logged to console' }
        }

        return { logged: true }
    } catch (error: any) {
        console.log('[Agent Invite]', { agent_phone, inviter_name, sent_at })
        return { logged: false, note: 'Invitation logged to console' }
    }
})
