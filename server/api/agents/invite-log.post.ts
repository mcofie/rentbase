/**
 * Log agent invitation for analytics
 * POST /api/agents/invite-log
 * 
 * Rate limited to prevent abuse
 */

import { serverSupabaseClient } from '#supabase/server'
import { rateLimit } from '~/server/utils/rateLimit'
import { validatePhone, validateText, sanitizeForDb } from '~/server/utils/validation'

export default defineEventHandler(async (event) => {
    // Rate limit: 10 invitations per IP per hour
    await rateLimit(event, {
        max: 10,
        windowMs: 60 * 60 * 1000, // 1 hour
        message: 'Too many invitation attempts. Please try again later.'
    })

    const body = await readBody(event)
    const { agent_phone, inviter_name, sent_at } = body

    // Validate phone number
    const phoneValidation = validatePhone(agent_phone)
    if (!phoneValidation.valid) {
        throw createError({
            statusCode: 400,
            message: phoneValidation.error || 'Invalid phone number'
        })
    }

    // Validate optional inviter name
    const nameValidation = validateText(inviter_name, { maxLength: 100 })

    const validatedData = sanitizeForDb({
        agent_phone: phoneValidation.value,
        inviter_name: nameValidation.value || null,
        sent_at: sent_at || new Date().toISOString(),
        status: 'sent'
    })

    try {
        const supabase = await serverSupabaseClient(event)

        const { error } = await (supabase
            .from('agent_invitations') as any)
            .insert(validatedData)

        if (error) {
            // Table might not exist yet, just log
            console.log('[Agent Invite]', validatedData)
            return { logged: false, note: 'Invitation logged to console' }
        }

        return { logged: true }
    } catch (error: any) {
        console.log('[Agent Invite]', validatedData)
        return { logged: false, note: 'Invitation logged to console' }
    }
})
