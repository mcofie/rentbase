/**
 * Admin Login - Send OTP
 * POST /api/admin/auth/send-otp
 */

import { defineEventHandler, readBody, createError } from 'h3'
import { findUserByPhone, createLoginOTP } from '~/server/utils/auth'
import { validatePhone } from '~/server/utils/validation'

export default defineEventHandler(async (event) => {
    const body = await readBody(event)
    const { phone } = body

    console.log('[Admin OTP] Request received for phone:', phone)

    if (!phone) {
        throw createError({
            statusCode: 400,
            message: 'Phone number is required'
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

    // Check if user exists (Admin or Approved Agent)
    const user = await findUserByPhone(normalizedPhone)
    console.log('[Auth OTP] User found:', user)

    if (!user) {
        console.log('[Auth OTP] User not found or not approved')
        throw createError({
            statusCode: 403,
            message: `Account not found or pending approval. Please register first.`
        })
    }

    // Create OTP using our standard utility
    const result = await createLoginOTP(normalizedPhone)
    console.log('[Auth OTP] OTP created:', result ? 'success' : 'failed')

    if (!result) {
        throw createError({
            statusCode: 500,
            message: 'Failed to generate OTP'
        })
    }

    console.log('[Admin OTP] Generated OTP:', result.otp)

    // Send OTP via SMS using Hubtel directly
    const config = useRuntimeConfig()
    const clientId = config.hubtelClientId
    const clientSecret = config.hubtelClientSecret
    const senderId = config.hubtelSenderId || 'RentBase'

    const smsMessage = `Your RentBase Admin login code is: ${result.otp}\n\nThis code expires in 5 minutes. Do not share it with anyone.`

    if (!clientId || !clientSecret) {
        // No Hubtel configured - log OTP for development
        console.log('[Admin OTP] ⚠️ Hubtel not configured. OTP for development:', result.otp)
        return {
            success: true,
            message: 'OTP generated (check server logs for code - Hubtel not configured)',
            expiresAt: result.expiresAt,
            // DEV ONLY - remove in production
            devOtp: process.env.NODE_ENV === 'development' ? result.otp : undefined
        }
    }

    try {
        const auth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64')
        const smsPhone = normalizedPhone.replace('+', '')

        console.log('[Admin OTP] Sending SMS to:', smsPhone)

        const response = await fetch('https://smsc.hubtel.com/v1/messages/send', {
            method: 'POST',
            headers: {
                'Authorization': `Basic ${auth}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                From: senderId,
                To: smsPhone,
                Content: smsMessage,
                RegisteredDelivery: true
            })
        })

        const data = await response.json()
        console.log('[Admin OTP] Hubtel response:', data)

        if (!response.ok) {
            throw new Error(data.Message || 'SMS sending failed')
        }

        return {
            success: true,
            message: 'OTP sent successfully',
            expiresAt: result.expiresAt
        }
    } catch (smsError: any) {
        console.error('[Admin OTP] Failed to send SMS:', smsError)

        // Still return success but log the OTP for dev
        console.log('[Admin OTP] ⚠️ SMS failed. OTP for development:', result.otp)

        return {
            success: true,
            message: 'OTP generated (SMS delivery may have failed)',
            expiresAt: result.expiresAt,
            devOtp: process.env.NODE_ENV === 'development' ? result.otp : undefined
        }
    }
})
