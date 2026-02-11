/**
 * Get Current Admin Session
 * GET /api/admin/auth/me
 */

import { defineEventHandler, getCookie, createError } from 'h3'
import { serverSupabaseServiceRole } from '#supabase/server'
import { findUserById } from '~/server/utils/auth'

const COOKIE_NAME = 'admin_session'

export default defineEventHandler(async (event) => {
    const sessionToken = getCookie(event, COOKIE_NAME)

    // Generic session validation
    const client = await serverSupabaseServiceRole(event)

    // 1. Check Admin Sessions
    const { data: adminSession } = await (client as any)
        .schema('rentbase')
        .from('admin_sessions')
        .select('admin_id, expires_at')
        .eq('session_token', sessionToken)
        .gt('expires_at', new Date().toISOString())
        .single()

    if (adminSession) {
        const { data: admin } = await (client as any)
            .schema('rentbase')
            .from('admin_users')
            .select('id, phone, name')
            .eq('id', adminSession.admin_id)
            .single()

        if (admin) {
            return {
                authenticated: true,
                user: { id: admin.id, phone: admin.phone, name: admin.name, role: 'admin' }
            }
        }
    }

    // 2. Check User Sessions (Agents)
    const { data: userSession } = await (client as any)
        .schema('rentbase')
        .from('user_sessions')
        .select('user_id, role, expires_at')
        .eq('session_token', sessionToken)
        .gt('expires_at', new Date().toISOString())
        .single()

    if (userSession) {
        // Find in profiles or agent_claims by ID
        const user = await findUserById(userSession.user_id)

        return {
            authenticated: true,
            user: user || { id: userSession.user_id, role: userSession.role }
        }
    }

    throw createError({
        statusCode: 401,
        message: 'Invalid or expired session'
    })
})
