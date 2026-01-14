import { serverSupabaseServiceRole } from '#supabase/server'
import { validatePhone } from '~/server/utils/validation'

export default defineEventHandler(async (event) => {
    const body = await readBody(event)
    const { phone, fullName, agencyName, location, otpVerified } = body

    // Ensure OTP was verified before submitting claim
    if (!otpVerified) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Phone verification required before submitting claim'
        })
    }

    // Validate phone number
    const phoneValidation = validatePhone(phone)
    if (!phoneValidation.valid) {
        throw createError({
            statusCode: 400,
            statusMessage: phoneValidation.error || 'Invalid phone number'
        })
    }

    const validatedPhone = phoneValidation.value

    // Validate required fields
    if (!fullName || fullName.trim().length < 2) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Full name is required (minimum 2 characters)'
        })
    }

    if (!location) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Location is required'
        })
    }

    // Use service role client for database operations
    const client = await serverSupabaseServiceRole(event)

    // Check if phone already has a pending or approved claim
    const { data: existingClaim } = await (client as any)
        .schema('rentbase')
        .from('agent_claims')
        .select('id, status')
        .eq('phone', validatedPhone)
        .single()

    if (existingClaim) {
        if (existingClaim.status === 'pending') {
            throw createError({
                statusCode: 400,
                statusMessage: 'A claim for this phone number is already pending review'
            })
        }
        if (existingClaim.status === 'approved') {
            throw createError({
                statusCode: 400,
                statusMessage: 'This phone number has already been verified as an agent'
            })
        }
        // If rejected, allow re-submission by updating the existing record
        const { error: updateError } = await (client as any)
            .schema('rentbase')
            .from('agent_claims')
            .update({
                full_name: fullName.trim(),
                agency_name: agencyName?.trim() || null,
                location: location,
                status: 'pending',
                admin_notes: null,
                reviewed_by: null,
                reviewed_at: null
            })
            .eq('id', existingClaim.id)

        if (updateError) {
            console.error('Error updating claim:', JSON.stringify(updateError, null, 2))
            throw createError({
                statusCode: 500,
                statusMessage: 'Failed to resubmit claim'
            })
        }

        return { success: true, message: 'Claim resubmitted for review' }
    }

    // Check if phone is already registered as an agent
    const { data: existingProfile } = await (client as any)
        .schema('rentbase')
        .from('profiles')
        .select('id, role')
        .eq('phone_number', validatedPhone)
        .single()

    if (existingProfile?.role === 'agent') {
        throw createError({
            statusCode: 400,
            statusMessage: 'This phone number is already registered as an agent'
        })
    }

    // Create new claim
    const { error: insertError } = await (client as any)
        .schema('rentbase')
        .from('agent_claims')
        .insert({
            phone: validatedPhone,
            full_name: fullName.trim(),
            agency_name: agencyName?.trim() || null,
            location: location
        })

    if (insertError) {
        console.error('Error creating claim:', JSON.stringify(insertError, null, 2))
        throw createError({
            statusCode: 500,
            statusMessage: 'Failed to submit claim: ' + insertError.message
        })
    }

    return {
        success: true,
        message: 'Your application has been submitted for review. We will notify you once approved.'
    }
})
