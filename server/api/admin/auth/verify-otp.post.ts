/**
 * Admin Login - Verify OTP
 * POST /api/admin/auth/verify-otp
 */

import { defineEventHandler, readBody, createError, setCookie } from 'h3'
import { verifyLoginOTP, findUserByPhone, createSession } from '~/server/utils/auth'

const COOKIE_NAME = 'admin_session'
const COOKIE_MAX_AGE = 60 * 60 * 24 // 24 hours in seconds

export default defineEventHandler(async (event) => {
    const body = await readBody(event)
    const { phone, otp } = body

    if (!phone || !otp) {
        throw createError({
            statusCode: 400,
            message: 'Phone number and OTP are required'
        })
    }

    // Normalize phone number
    let normalizedPhone = phone.replace(/\s/g, '')
    if (!normalizedPhone.startsWith('+')) {
        normalizedPhone = `+233${normalizedPhone.replace(/^0/, '')}`
    }

    // Verify OTP
    const verifyResult = await verifyLoginOTP(normalizedPhone, otp)

    if (!verifyResult.success) {
        throw createError({
            statusCode: 401,
            message: verifyResult.error || 'Invalid OTP'
        })
    }

    // Identify user and role
    const user = await findUserByPhone(normalizedPhone)
    if (!user) {
        throw createError({
            statusCode: 404,
            message: 'User account no longer exists'
        })
    }

    // Create session
    const session = await createSession(user.id, user.role)
    if (!session) {
        throw createError({
            statusCode: 500,
            message: 'Failed to create session'
        })
    }

    // Set secure HTTP-only cookie with session token
    // We use the same cookie name for both roles to simplify things
    setCookie(event, COOKIE_NAME, session.sessionToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: COOKIE_MAX_AGE,
        path: '/'
    })

    return {
        success: true,
        message: 'Login successful',
        role: user.role,
        expiresAt: session.expiresAt
    }
})
