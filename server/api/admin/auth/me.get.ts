/**
 * Get Current Admin Session
 * GET /api/admin/auth/me
 */

import { defineEventHandler, getCookie, createError } from 'h3'
import { validateSession } from '~/server/utils/adminAuth'

const COOKIE_NAME = 'admin_session'

export default defineEventHandler(async (event) => {
    const sessionToken = getCookie(event, COOKIE_NAME)

    if (!sessionToken) {
        throw createError({
            statusCode: 401,
            message: 'Not authenticated'
        })
    }

    const session = await validateSession(sessionToken)

    if (!session.valid) {
        throw createError({
            statusCode: 401,
            message: 'Invalid or expired session'
        })
    }

    return {
        authenticated: true,
        admin: {
            id: session.adminId,
            phone: session.phone,
            name: session.name
        }
    }
})
