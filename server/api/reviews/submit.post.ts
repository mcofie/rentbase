import { serverSupabaseClient } from '#supabase/server'
import { rateLimit, phoneRateLimitKey } from '~/server/utils/rateLimit'
import { validatePhone, validateRating, validateText, sanitizeForDb } from '~/server/utils/validation'
import { performSpamCheck } from '~/server/utils/captcha'

export default defineEventHandler(async (event) => {
    const body = await readBody(event)
    const config = useRuntimeConfig()

    const {
        agent_phone,
        rating,
        comment,
        reviewer_phone,
        reviewer_id,
        // Anti-spam fields
        _hp, // Honeypot field (should be empty)
        _ts, // Form load timestamp
        _captcha // Turnstile token
    } = body

    // Get client IP for spam checks
    const clientIp = getRequestHeader(event, 'x-forwarded-for') ||
        getRequestHeader(event, 'x-real-ip') ||
        event.node.req.socket?.remoteAddress ||
        undefined

    // Perform spam/bot detection checks
    const spamCheck = await performSpamCheck({
        honeypotValue: _hp,
        formLoadTime: _ts ? parseInt(_ts) : undefined,
        turnstileToken: _captcha,
        turnstileSecret: config.turnstileSecretKey,
        clientIp,
        minSubmitTime: 3000 // Minimum 3 seconds to fill form
    })

    if (spamCheck.isSpam) {
        console.log(`[Review Spam] Blocked submission: ${spamCheck.reason}`)
        throw createError({
            statusCode: 400,
            statusMessage: spamCheck.reason || 'Spam detected'
        })
    }

    // Validate required fields
    const agentPhoneValidation = validatePhone(agent_phone)
    if (!agentPhoneValidation.valid) {
        throw createError({
            statusCode: 400,
            statusMessage: agentPhoneValidation.error || 'Invalid agent phone number'
        })
    }

    const ratingValidation = validateRating(rating)
    if (!ratingValidation.valid) {
        throw createError({
            statusCode: 400,
            statusMessage: ratingValidation.error || 'Invalid rating'
        })
    }

    // Validate optional fields
    let validatedReviewerPhone: string | null = null
    if (reviewer_phone) {
        const reviewerPhoneValidation = validatePhone(reviewer_phone)
        if (!reviewerPhoneValidation.valid) {
            throw createError({
                statusCode: 400,
                statusMessage: 'Invalid reviewer phone number'
            })
        }
        validatedReviewerPhone = reviewerPhoneValidation.value
    }

    const commentValidation = validateText(comment, { maxLength: 2000 })
    const validatedComment = commentValidation.value

    const validatedAgentPhone = agentPhoneValidation.value
    const validatedRating = ratingValidation.value

    // Self-Review Check
    if (validatedReviewerPhone && validatedAgentPhone === validatedReviewerPhone) {
        throw createError({
            statusCode: 400,
            statusMessage: 'You cannot review yourself'
        })
    }

    // Rate limit: 3 reviews per IP per hour, 1 review per agent per IP per day
    await rateLimit(event, {
        max: 3,
        windowMs: 60 * 60 * 1000, // 1 hour
        message: 'Too many reviews submitted. Please try again later.'
    })

    // Additional rate limit: 1 review per agent per IP per day
    await rateLimit(event, {
        max: 1,
        windowMs: 24 * 60 * 60 * 1000, // 24 hours
        keyGenerator: () => phoneRateLimitKey(event, validatedAgentPhone),
        message: 'You have already reviewed this agent recently.'
    })

    const client = await serverSupabaseClient(event)

    // Get IP for audit trail
    const ip = getRequestHeader(event, 'x-forwarded-for') ||
        getRequestHeader(event, 'x-real-ip') ||
        event.node.req.socket?.remoteAddress ||
        null

    // Prepare sanitized data for insertion
    const reviewData = sanitizeForDb({
        agent_phone: validatedAgentPhone,
        reviewer_id: reviewer_id || null,
        reviewer_phone: validatedReviewerPhone,
        rating: validatedRating,
        comment: validatedComment || null,
        ip_address: ip,
        session_id: null
    })

    const { error } = await (client
        .from('reviews') as any)
        .insert(reviewData)

    if (error) {
        console.error('Review submission error:', error)
        throw createError({
            statusCode: 500,
            statusMessage: 'Failed to submit review. Please try again.'
        })
    }

    return { success: true }
})
