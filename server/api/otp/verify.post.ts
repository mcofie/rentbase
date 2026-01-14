import { serverSupabaseServiceRole } from '#supabase/server'
import { rateLimit, phoneRateLimitKey } from '~/server/utils/rateLimit'
import { validatePhone, validateOtpCode } from '~/server/utils/validation'

export default defineEventHandler(async (event) => {
    const body = await readBody(event)
    const { phone, code } = body

    // Validate inputs
    const phoneValidation = validatePhone(phone)
    if (!phoneValidation.valid) {
        throw createError({
            statusCode: 400,
            statusMessage: phoneValidation.error || 'Invalid phone number'
        })
    }

    const codeValidation = validateOtpCode(code)
    if (!codeValidation.valid) {
        throw createError({
            statusCode: 400,
            statusMessage: codeValidation.error || 'Invalid code'
        })
    }

    const validatedPhone = phoneValidation.value
    const validatedCode = codeValidation.value

    // Rate limit: 5 verification attempts per phone per 10 minutes
    await rateLimit(event, {
        max: 5,
        windowMs: 10 * 60 * 1000,
        keyGenerator: () => `verify:${phoneRateLimitKey(event, validatedPhone)}`,
        message: 'Too many verification attempts. Please wait and try again.'
    })

    const client = await serverSupabaseServiceRole(event)

    // Verify Code - check for exact match and not expired
    const { data, error } = await (client as any)
        .schema('rentbase')
        .from('verification_codes')
        .select('*')
        .eq('phone', validatedPhone)
        .eq('code', validatedCode)
        .gt('expires_at', new Date().toISOString())
        .order('created_at', { ascending: false })
        .limit(1)
        .single()

    if (error || !data) {
        console.error('OTP Verify Error:', error ? JSON.stringify(error, null, 2) : 'No matching code found')
        throw createError({
            statusCode: 400,
            statusMessage: 'Invalid or expired code'
        })
    }

    // CRITICAL: Delete code after successful verification to prevent replay attacks
    await (client as any)
        .schema('rentbase')
        .from('verification_codes')
        .delete()
        .eq('id', (data as any).id)

    // Also clean up any other codes for this phone
    await (client as any)
        .schema('rentbase')
        .from('verification_codes')
        .delete()
        .eq('phone', validatedPhone)

    return { success: true, verified: true }
})
