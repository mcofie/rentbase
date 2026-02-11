
/**
 * Admin Login - Email & Password
 * POST /api/admin/auth/login
 */

import { defineEventHandler, readBody, createError, setCookie } from 'h3'
import { verifyPassword } from '~/server/utils/adminAuth'

const COOKIE_NAME = 'admin_session'
const COOKIE_MAX_AGE = 60 * 60 * 24 // 24 hours in seconds

export default defineEventHandler(async (event) => {
    const body = await readBody(event)
    const { email, password } = body

    if (!email || !password) {
        throw createError({
            statusCode: 400,
            message: 'Email and password are required'
        })
    }

    // Verify Password
    const result = await verifyPassword(email, password)

    if (!result.success) {
        throw createError({
            statusCode: 401,
            message: result.error || 'Invalid credentials'
        })
    }

    // Set secure HTTP-only cookie with session token
    setCookie(event, COOKIE_NAME, result.sessionToken!, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: COOKIE_MAX_AGE,
        path: '/'
    })

    return {
        success: true,
        message: 'Login successful',
        expiresAt: result.expiresAt
    }
})
