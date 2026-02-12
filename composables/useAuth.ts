import { formatPhoneE164, isValidGhanaPhone } from '~/utils/formatPhone'
import type { AuthFormState, Profile } from '~/types'

export function useAuth() {
    const supabase = useSupabaseClient()
    const user = useSupabaseUser()

    const state = useState<AuthFormState>('auth-form-state', () => ({
        phone: '',
        otp: '',
        step: 'phone',
        loading: false,
        error: null,
    }))

    const profile = ref<Profile | null>(null)

    /**
     * Send OTP to phone number
     */
    async function sendOTP(phone: string): Promise<boolean> {
        state.value.loading = true
        state.value.error = null

        try {
            // Call our custom Admin OTP endpoint instead of Supabase Auth
            const response = await $fetch('/api/admin/auth/send-otp', {
                method: 'POST',
                body: { phone }
            })

            if (!(response as any).success) {
                throw new Error((response as any).message || 'Failed to send OTP')
            }

            state.value.phone = phone
            state.value.step = 'otp'
            state.value.loading = false
            return true
        } catch (err: any) {
            console.error('[sendOTP] Error:', err)
            state.value.error = err.data?.message || err.message || 'Failed to send OTP'
            state.value.loading = false
            return false
        }
    }

    /**
     * Verify OTP code
     */
    async function verifyOTP(otp: string): Promise<boolean> {
        state.value.loading = true
        state.value.error = null

        try {
            // Call our custom Admin OTP verification endpoint
            const response = await $fetch('/api/admin/auth/verify-otp', {
                method: 'POST',
                body: {
                    phone: state.value.phone,
                    otp: otp
                }
            })

            if (!(response as any).success) {
                throw new Error((response as any).message || 'Verification failed')
            }

            // Fetch profile to update state
            await fetchProfile()

            state.value.loading = false
            return true
        } catch (err: any) {
            console.error('[verifyOTP] Error:', err)
            state.value.error = err.data?.message || err.message || 'Failed to verify OTP'
            state.value.loading = false
            return false
        }
    }

    /**
     * Resend OTP
     */
    async function resendOTP(): Promise<boolean> {
        return sendOTP(state.value.phone)
    }

    /**
     * Fetch user profile
     */
    async function fetchProfile(): Promise<Profile | null> {
        // 1. Try fetching from custom admin session first
        try {
            const adminSession = await $fetch('/api/admin/auth/me')
            if (adminSession && (adminSession as any).authenticated) {
                const userData = (adminSession as any).user
                profile.value = {
                    id: userData.id,
                    phone_number: userData.phone,
                    full_name: userData.name || userData.full_name,
                    role: userData.role,
                    is_verified: true,
                } as any
                return profile.value
            }
        } catch (e) {
            // Not logged in via admin session, continue to Supabase check
        }

        // 2. Fallback to Supabase Auth user
        if (!user.value || !user.value.id) {
            return null
        }

        const userId = user.value.id

        try {
            const { data, error } = await (supabase
                .from('profiles') as any)
                .select('*')
                .eq('id', userId)
                .single()

            if (error) {
                if (error.code !== 'PGRST116') {
                    console.error('Error fetching profile:', error)
                }
                return null
            }

            profile.value = data
            return data
        } catch (err) {
            console.error('Failed to fetch profile:', err)
            return null
        }
    }

    /**
     * Sign out
     */
    async function signOut(): Promise<void> {
        try {
            await $fetch('/api/admin/auth/logout', { method: 'POST' })
        } catch (e) {
            // Logout failed or already logged out
        }
        await supabase.auth.signOut()
        profile.value = null
        state.value.step = 'phone'
        state.value.phone = ''
        state.value.otp = ''
    }

    /**
     * Reset auth state
     */
    function resetState(): void {
        state.value.phone = ''
        state.value.otp = ''
        state.value.step = 'phone'
        state.value.loading = false
        state.value.error = null
    }

    // Initialize profile on mount
    onMounted(async () => {
        await fetchProfile()
    })

    // Watch for user changes
    watch(user, async (newUser) => {
        if (newUser?.id) {
            await fetchProfile()
        } else {
            profile.value = null
        }
    })

    return {
        state,
        user,
        profile,
        sendOTP,
        verifyOTP,
        resendOTP,
        fetchProfile,
        signOut,
        resetState,
    }
}
