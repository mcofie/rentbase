import { serverSupabaseClient } from '#supabase/server'
import { rateLimit } from '~/server/utils/rateLimit'
import { validatePhone, validateText, sanitizeForDb } from '~/server/utils/validation'

/**
 * Report an agent for misconduct
 * Rate limited: 3 reports per IP per day
 */
export default defineEventHandler(async (event) => {
    const body = await readBody(event)
    const { agent_phone, reason, details, reporter_phone } = body

    // Validate agent phone
    const agentPhoneValidation = validatePhone(agent_phone)
    if (!agentPhoneValidation.valid) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Invalid agent phone number'
        })
    }

    // Validate reason
    if (!reason || typeof reason !== 'string' || reason.length < 3) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Please select a reason for reporting'
        })
    }

    // Validate optional details
    const detailsValidation = validateText(details, { maxLength: 1000 })

    // Validate optional reporter phone
    let validatedReporterPhone = null
    if (reporter_phone) {
        const reporterPhoneValidation = validatePhone(reporter_phone)
        if (reporterPhoneValidation.valid) {
            validatedReporterPhone = reporterPhoneValidation.value
        }
    }

    // Rate limit: 3 reports per IP per day
    await rateLimit(event, {
        max: 3,
        windowMs: 24 * 60 * 60 * 1000, // 24 hours
        message: 'Too many reports submitted. Please try again later.'
    })

    const client = await serverSupabaseClient(event)

    // Get IP for audit trail
    const ip = getRequestHeader(event, 'x-forwarded-for') ||
        getRequestHeader(event, 'x-real-ip') ||
        event.node.req.socket?.remoteAddress ||
        null

    // Prepare report data
    const reportData = sanitizeForDb({
        agent_phone: agentPhoneValidation.value,
        reason: reason.trim(),
        details: detailsValidation.value || null,
        reporter_phone: validatedReporterPhone,
        ip_address: ip,
        status: 'pending'
    })

    // Insert report
    const { data, error } = await (client
        .from('agent_reports') as any)
        .insert(reportData)
        .select()
        .single()

    if (error) {
        console.error('Report submission error:', error)
        throw createError({
            statusCode: 500,
            statusMessage: 'Failed to submit report. Please try again.'
        })
    }

    return {
        success: true,
        message: 'Report submitted. Our team will review it within 48 hours.',
        reportId: data?.id
    }
})
