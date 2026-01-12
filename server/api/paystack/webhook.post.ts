import { createClient } from '@supabase/supabase-js'
import crypto from 'crypto'

export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig()

    // CRITICAL: Get the RAW body for signature verification
    // JSON.stringify may produce different output than original
    const rawBody = await readRawBody(event)
    const signature = getHeader(event, 'x-paystack-signature')

    if (!signature) {
        console.error('Paystack webhook: Missing signature header')
        throw createError({
            statusCode: 400,
            message: 'Missing signature header',
        })
    }

    if (!rawBody) {
        console.error('Paystack webhook: Missing body')
        throw createError({
            statusCode: 400,
            message: 'Missing request body',
        })
    }

    // Verify the signature using raw body
    const hash = crypto
        .createHmac('sha512', config.paystackSecretKey)
        .update(rawBody)
        .digest('hex')

    if (hash !== signature) {
        console.error('Paystack webhook: Invalid signature')
        throw createError({
            statusCode: 401,
            message: 'Invalid signature',
        })
    }

    // Parse the body after signature verification
    let body: any
    try {
        body = JSON.parse(rawBody)
    } catch (e) {
        console.error('Paystack webhook: Invalid JSON body')
        throw createError({
            statusCode: 400,
            message: 'Invalid JSON body',
        })
    }

    // Process the webhook event
    const { event: eventType, data } = body

    // Create Supabase client with service role for admin operations
    const supabase = createClient(
        config.public.supabaseUrl,
        config.supabaseServiceRoleKey
    )

    if (eventType === 'charge.success') {
        const { reference, status, amount, metadata } = data

        console.log(`Paystack webhook: Processing successful charge ${reference}`)

        // Update transaction status
        const { error: transactionError } = await supabase
            .from('transactions')
            .update({
                status: 'success',
                updated_at: new Date().toISOString()
            })
            .eq('reference', reference)

        if (transactionError) {
            console.error('Failed to update transaction:', transactionError)
            // Don't throw - we still want to process the rest
        }

        // Update the related entity based on feature type
        if (metadata?.feature_type === 'contract' && metadata?.contract_id) {
            const { error: contractError } = await supabase
                .from('contracts')
                .update({
                    is_finalized: true,
                    payment_ref: reference,
                    updated_at: new Date().toISOString()
                })
                .eq('id', metadata.contract_id)

            if (contractError) {
                console.error('Failed to finalize contract:', contractError)
            } else {
                console.log(`Contract ${metadata.contract_id} finalized`)
            }
        } else if (metadata?.feature_type === 'deposit_report' && metadata?.report_id) {
            const { error: reportError } = await supabase
                .from('condition_reports')
                .update({
                    is_finalized: true,
                    payment_ref: reference,
                    updated_at: new Date().toISOString()
                })
                .eq('id', metadata.report_id)

            if (reportError) {
                console.error('Failed to finalize report:', reportError)
            } else {
                console.log(`Report ${metadata.report_id} finalized`)
            }
        }

        console.log(`Payment successful: ${reference}`)
    } else if (eventType === 'charge.failed') {
        const { reference } = data

        console.log(`Paystack webhook: Processing failed charge ${reference}`)

        // Update transaction status to failed
        const { error } = await supabase
            .from('transactions')
            .update({
                status: 'failed',
                updated_at: new Date().toISOString()
            })
            .eq('reference', reference)

        if (error) {
            console.error('Failed to update transaction status:', error)
        }

        console.log(`Payment failed: ${reference}`)
    }

    // Always return 200 to acknowledge receipt
    return { received: true }
})
