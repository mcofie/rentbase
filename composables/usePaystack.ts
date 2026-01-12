import { PRICING, type FeatureType, type PaystackResponse } from '~/types'

declare global {
    interface Window {
        PaystackPop: {
            setup: (config: any) => { openIframe: () => void }
        }
    }
}

export function usePaystack() {
    const config = useRuntimeConfig()
    const supabase = useSupabaseClient()
    const user = useSupabaseUser()

    const loading = ref(false)
    const error = ref<string | null>(null)

    // Check configuration on init
    if (config.public.paystackPublicKey.includes('placeholder')) {
        console.warn('Paystack Public Key is not configured (placeholder detected).')
    }

    /**
     * Generate a unique payment reference
     */
    function generateReference(featureType: FeatureType): string {
        const prefix = featureType === 'contract' ? 'RB_CTR' : 'RB_DEP'
        const timestamp = Date.now()
        const random = Math.random().toString(36).substring(2, 8)
        return `${prefix}_${timestamp}_${random}`
    }

    /**
     * Create a pending transaction in the database
     */
    async function createTransaction(
        reference: string,
        amount: number,
        featureType: FeatureType
    ): Promise<boolean> {
        // Allow anonymous payments -> user_id can be null or user.value.id
        try {
            const { error: dbError } = await (supabase
                .from('transactions') as any)
                .insert({
                    user_id: user.value?.id || null,
                    reference,
                    amount,
                    status: 'pending',
                    feature_type: featureType,
                })

            if (dbError) {
                console.error('Transaction creation error:', dbError)
                error.value = dbError.message
                return false
            }

            return true
        } catch (err: any) {
            error.value = err.message || 'Failed to create transaction'
            return false
        }
    }

    /**
     * Update transaction status
     */
    async function updateTransactionStatus(
        reference: string,
        status: 'success' | 'failed'
    ): Promise<boolean> {
        try {
            const { error: dbError } = await (supabase
                .from('transactions') as any)
                .update({ status })
                .eq('reference', reference)

            if (dbError) {
                console.error('Failed to update transaction:', dbError)
                return false
            }

            return true
        } catch (err) {
            console.error('Failed to update transaction:', err)
            return false
        }
    }

    /**
     * Initialize Paystack payment
     */
    async function pay(options: {
        email: string
        featureType: FeatureType
        onSuccess: (reference: string) => void
        onClose?: () => void
        metadata?: Record<string, any>
    }): Promise<void> {
        loading.value = true
        error.value = null

        // Determine amount based on feature type
        const pricing = options.featureType === 'contract'
            ? PRICING.CONTRACT
            : PRICING.DEPOSIT_REPORT

        const reference = generateReference(options.featureType)

        // Create pending transaction in database
        const transactionCreated = await createTransaction(
            reference,
            pricing.amount,
            options.featureType
        )

        if (!transactionCreated) {
            loading.value = false
            return
        }

        // Check if PaystackPop is available
        if (typeof window === 'undefined' || !window.PaystackPop) {
            error.value = 'Payment system is not available. Please refresh the page.'
            loading.value = false
            return
        }

        // Debugging Key
        const publicKey = config.public.paystackPublicKey
        console.log('Initializing Paystack with key:', publicKey?.substring(0, 10) + '...')

        if (!publicKey || publicKey.includes('placeholder')) {
            const msg = 'Invalid Paystack Key. Please RESTART your development server (npm run dev) to load the new .env file.'
            error.value = msg
            alert(msg) // Force user attention
            loading.value = false
            return
        }

        try {
            const handler = window.PaystackPop.setup({
                key: publicKey,
                email: options.email,
                amount: pricing.pesewas, // Amount in pesewas
                currency: 'GHS',
                ref: reference,
                metadata: {
                    feature_type: options.featureType,
                    ...options.metadata,
                },
                callback: function (response: PaystackResponse) {
                    // Update transaction status
                    updateTransactionStatus(reference, 'success').then(() => {
                        loading.value = false
                        options.onSuccess(response.reference)
                    })
                },
                onClose: function () {
                    // Update transaction status to failed if closed without payment
                    updateTransactionStatus(reference, 'failed').then(() => {
                        loading.value = false
                        if (options.onClose) options.onClose()
                    })
                },
            })

            handler.openIframe()
        } catch (err: any) {
            error.value = err.message || 'Failed to initialize payment'
            await updateTransactionStatus(reference, 'failed')
            loading.value = false
        }
    }

    /**
     * Pay for contract generation
     */
    async function payForContract(
        email: string,
        contractId: string,
        onSuccess: (reference: string) => void,
        onClose?: () => void
    ): Promise<void> {
        return pay({
            email,
            featureType: 'contract',
            metadata: { contract_id: contractId },
            onSuccess,
            onClose,
        })
    }

    /**
     * Pay for deposit report
     */
    async function payForDepositReport(
        email: string,
        reportId: string,
        onSuccess: (reference: string) => void,
        onClose?: () => void
    ): Promise<void> {
        return pay({
            email,
            featureType: 'deposit_report',
            metadata: { report_id: reportId },
            onSuccess,
            onClose,
        })
    }

    return {
        loading,
        error,
        pay,
        payForContract,
        payForDepositReport,
        PRICING,
    }
}
