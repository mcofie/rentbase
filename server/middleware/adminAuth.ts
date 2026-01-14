/**
 * Admin Authentication Middleware
 * Protects admin routes by checking for valid session
 */

import { defineEventHandler, getCookie, createError } from 'h3'
import { validateSession } from '~/server/utils/adminAuth'

const COOKIE_NAME = 'admin_session'

export default defineEventHandler(async (event) => {
    // Only apply to admin API routes (except auth routes)
    const path = event.path || ''

    if (!path.startsWith('/api/admin')) {
        return // Not an admin route
    }

    // Skip auth endpoints
    if (path.startsWith('/api/admin/auth')) {
        return
    }

    // Check for session cookie
    const sessionToken = getCookie(event, COOKIE_NAME)

    if (!sessionToken) {
        throw createError({
            statusCode: 401,
            message: 'Authentication required'
        })
    }

    // Validate session
    const session = await validateSession(sessionToken)

    if (!session.valid) {
        throw createError({
            statusCode: 401,
            message: 'Invalid or expired session'
        })
    }

    // Attach admin info to event context for use in handlers
    event.context.admin = {
        id: session.adminId,
        phone: session.phone,
        name: session.name
    }
})
