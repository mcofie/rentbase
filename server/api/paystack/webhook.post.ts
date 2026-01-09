import { createClient } from '@supabase/supabase-js'
import crypto from 'crypto'

export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig()

    // Get the raw body for signature verification
    const body = await readBody(event)
    const signature = getHeader(event, 'x-paystack-signature')

    if (!signature) {
        throw createError({
            statusCode: 400,
            message: 'Missing signature header',
        })
    }

    // Verify the signature
    const hash = crypto
        .createHmac('sha512', config.paystackSecretKey)
        .update(JSON.stringify(body))
        .digest('hex')

    if (hash !== signature) {
        throw createError({
            statusCode: 401,
            message: 'Invalid signature',
        })
    }

    // Process the webhook event
    const { event: eventType, data } = body

    if (eventType === 'charge.success') {
        const { reference, status, amount, metadata } = data

        // Create Supabase client with service role
        const supabase = createClient(
            config.public.supabaseUrl,
            config.supabaseServiceRoleKey
        )

        // Update transaction status
        const { error: transactionError } = await supabase
            .from('transactions')
            .update({ status: 'success' })
            .eq('reference', reference)

        if (transactionError) {
            console.error('Failed to update transaction:', transactionError)
        }

        // Update the related entity based on feature type
        if (metadata?.feature_type === 'contract' && metadata?.contract_id) {
            const { error: contractError } = await supabase
                .from('contracts')
                .update({
                    is_finalized: true,
                    payment_ref: reference,
                })
                .eq('id', metadata.contract_id)

            if (contractError) {
                console.error('Failed to finalize contract:', contractError)
            }
        } else if (metadata?.feature_type === 'deposit_report' && metadata?.report_id) {
            const { error: reportError } = await supabase
                .from('condition_reports')
                .update({
                    is_finalized: true,
                    payment_ref: reference,
                })
                .eq('id', metadata.report_id)

            if (reportError) {
                console.error('Failed to finalize report:', reportError)
            }
        }

        console.log(`Payment successful: ${reference}`)
    } else if (eventType === 'charge.failed') {
        const { reference } = data

        const supabase = createClient(
            config.public.supabaseUrl,
            config.supabaseServiceRoleKey
        )

        // Update transaction status to failed
        await supabase
            .from('transactions')
            .update({ status: 'failed' })
            .eq('reference', reference)

        console.log(`Payment failed: ${reference}`)
    }

    return { received: true }
})
