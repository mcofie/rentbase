/**
 * Admin Login - Verify OTP
 * POST /api/admin/auth/verify-otp
 */

import { defineEventHandler, readBody, createError, setCookie } from 'h3'
import { verifyLoginOTP, findUserByPhone, createSession } from '~/server/utils/auth'
import { validatePhone } from '~/server/utils/validation'

const COOKIE_NAME = 'admin_session'
const COOKIE_MAX_AGE = 60 * 60 * 24 // 24 hours in seconds

export default defineEventHandler(async (event) => {
    try {
        const body = await readBody(event)
        const { phone, otp } = body

        console.log('[VerifyOTP] Request for phone:', phone, 'OTP:', otp)

        if (!phone || !otp) {
            throw createError({
                statusCode: 400,
                message: 'Phone number and OTP are required'
            })
        }

        // Normalize phone number using standardized utility
        const phoneValidation = validatePhone(phone)
        if (!phoneValidation.valid) {
            throw createError({
                statusCode: 400,
                message: phoneValidation.error || 'Invalid phone number format'
            })
        }
        const normalizedPhone = phoneValidation.value
        console.log('[VerifyOTP] Normalized phone:', normalizedPhone)

        // Validate and clean OTP
        const otpValidation = validateOtpCode(otp)
        if (!otpValidation.valid) {
            throw createError({
                statusCode: 400,
                message: otpValidation.error || 'Invalid code format'
            })
        }
        const validatedOtp = otpValidation.value
        console.log('[VerifyOTP] Validated OTP:', validatedOtp)

        // Verify OTP
        const verifyResult = await verifyLoginOTP(normalizedPhone, validatedOtp)
        console.log('[VerifyOTP] OTP Verification result:', verifyResult)

        if (!verifyResult.success) {
            throw createError({
                statusCode: 401,
                message: verifyResult.error || 'Invalid OTP'
            })
        }

        // Identify user and role
        const user = await findUserByPhone(normalizedPhone)
        console.log('[VerifyOTP] User found:', user)

        if (!user) {
            throw createError({
                statusCode: 404,
                message: 'User account no longer exists'
            })
        }

        // Create session
        console.log('[VerifyOTP] Attempting to create session for role:', user.role)
        const session = await createSession(user.id, user.role)
        console.log('[VerifyOTP] Session creation result:', session ? 'SUCCESS' : 'FAILED')

        if (!session) {
            throw createError({
                statusCode: 500,
                message: 'Failed to create session'
            })
        }

        // Set secure HTTP-only cookie with session token
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
    } catch (err: any) {
        console.error('[VerifyOTP] Global error:', err)
        throw err
    }
})
