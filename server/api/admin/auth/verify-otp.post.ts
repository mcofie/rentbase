/**
 * Admin Login - Verify OTP
 * POST /api/admin/auth/verify-otp
 */

import { defineEventHandler, readBody, createError, setCookie } from 'h3'
import { verifyOTP } from '~/server/utils/adminAuth'

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
    const result = await verifyOTP(normalizedPhone, otp)

    if (!result.success) {
        throw createError({
            statusCode: 401,
            message: result.error || 'Invalid OTP'
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
