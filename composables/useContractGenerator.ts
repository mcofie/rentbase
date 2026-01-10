import type { Contract, ContractDetails, ContractFormState } from '~/types'

export function useContractGenerator() {
    const supabase = useSupabaseClient()
    const user = useSupabaseUser()
    const config = useRuntimeConfig()

    const loading = ref(false)
    const error = ref<string | null>(null)
    const currentContract = ref<Contract | null>(null)

    /**
     * Create a new contract draft
     * Can work with or without a logged-in user
     */
    async function createDraft(details: ContractDetails, email?: string): Promise<Contract | null> {
        loading.value = true
        error.value = null

        try {
            const insertData: any = {
                details,
                is_finalized: false,
            }

            // If user is logged in, associate with user
            if (user.value) {
                insertData.user_id = user.value.id
            }

            // Always store email if provided (for anonymous users)
            if (email) {
                insertData.customer_email = email
            }

            const { data, error: dbError } = await (supabase
                .from('contracts') as any)
                .insert(insertData)
                .select()
                .single()

            if (dbError) {
                error.value = dbError.message
                loading.value = false
                return null
            }

            currentContract.value = data
            loading.value = false
            return data
        } catch (err: any) {
            error.value = err.message || 'Failed to create contract'
            loading.value = false
            return null
        }
    }

    /**
     * Fetch a contract by ID
     */
    async function fetchContract(id: string): Promise<Contract | null> {
        loading.value = true
        error.value = null

        try {
            const { data, error: dbError } = await supabase
                .from('contracts')
                .select('*')
                .eq('id', id)
                .single()

            if (dbError) {
                error.value = dbError.message
                loading.value = false
                return null
            }

            currentContract.value = data
            loading.value = false
            return data
        } catch (err: any) {
            error.value = err.message || 'Failed to fetch contract'
            loading.value = false
            return null
        }
    }

    /**
     * Fetch all user contracts
     */
    async function fetchUserContracts(): Promise<Contract[]> {
        if (!user.value) return []

        loading.value = true
        error.value = null

        try {
            const { data, error: dbError } = await supabase
                .from('contracts')
                .select('*')
                .eq('user_id', user.value.id)
                .order('created_at', { ascending: false })

            if (dbError) {
                error.value = dbError.message
                loading.value = false
                return []
            }

            loading.value = false
            return data || []
        } catch (err: any) {
            error.value = err.message || 'Failed to fetch contracts'
            loading.value = false
            return []
        }
    }

    /**
     * Update contract details
     */
    async function updateContract(id: string, details: Partial<ContractDetails>): Promise<boolean> {
        if (!user.value) {
            error.value = 'You must be logged in to update a contract'
            return false
        }

        loading.value = true
        error.value = null

        try {
            // First get the current contract
            const { data: current } = await supabase
                .from('contracts')
                .select('details')
                .eq('id', id)
                .eq('user_id', user.value.id)
                .single()

            if (!current) {
                error.value = 'Contract not found'
                loading.value = false
                return false
            }

            // Merge the details
            const updatedDetails = { ...current.details, ...details }

            const { error: dbError } = await supabase
                .from('contracts')
                .update({ details: updatedDetails })
                .eq('id', id)
                .eq('user_id', user.value.id)

            if (dbError) {
                error.value = dbError.message
                loading.value = false
                return false
            }

            loading.value = false
            return true
        } catch (err: any) {
            error.value = err.message || 'Failed to update contract'
            loading.value = false
            return false
        }
    }

    /**
     * Finalize contract after payment
     */
    async function finalizeContract(id: string, paymentRef: string): Promise<boolean> {
        loading.value = true
        error.value = null

        try {
            const { error: dbError } = await supabase
                .from('contracts')
                .update({
                    is_finalized: true,
                    payment_ref: paymentRef,
                })
                .eq('id', id)

            if (dbError) {
                error.value = dbError.message
                loading.value = false
                return false
            }

            if (currentContract.value?.id === id) {
                currentContract.value.is_finalized = true
                currentContract.value.payment_ref = paymentRef
            }

            loading.value = false
            return true
        } catch (err: any) {
            error.value = err.message || 'Failed to finalize contract'
            loading.value = false
            return false
        }
    }

    /**
     * Generate preview URL for sharing
     */
    function getPreviewUrl(contractId: string): string {
        const baseUrl = config.public.appUrl || 'http://localhost:3000'
        return `${baseUrl}/contract/preview/${contractId}`
    }

    /**
     * Share contract via WhatsApp
     */
    function shareViaWhatsApp(contractId: string, landlordName: string): void {
        const url = getPreviewUrl(contractId)
        const message = encodeURIComponent(
            `Hello ${landlordName}, please review this tenancy agreement draft: ${url}`
        )
        window.open(`https://wa.me/?text=${message}`, '_blank')
    }

    return {
        loading,
        error,
        currentContract,
        createDraft,
        fetchContract,
        fetchUserContracts,
        updateContract,
        finalizeContract,
        getPreviewUrl,
        shareViaWhatsApp,
    }
}
