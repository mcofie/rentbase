/**
 * Admin Logout
 * POST /api/admin/auth/logout
 */

import { defineEventHandler, getCookie, deleteCookie } from 'h3'
import { invalidateSession } from '~/server/utils/adminAuth'

const COOKIE_NAME = 'admin_session'

export default defineEventHandler(async (event) => {
    const sessionToken = getCookie(event, COOKIE_NAME)

    if (sessionToken) {
        // Invalidate session in database
        await invalidateSession(sessionToken)

        // Delete the cookie
        deleteCookie(event, COOKIE_NAME, {
            path: '/'
        })
    }

    return {
        success: true,
        message: 'Logged out successfully'
    }
})
