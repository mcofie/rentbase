import { formatPhoneE164, isValidGhanaPhone } from '~/utils/formatPhone'
import type { AuthFormState, Profile } from '~/types'

export function useAuth() {
    const supabase = useSupabaseClient()
    const user = useSupabaseUser()

    const state = reactive<AuthFormState>({
        phone: '',
        otp: '',
        step: 'phone',
        loading: false,
        error: null,
    })

    const profile = ref<Profile | null>(null)

    /**
     * Send OTP to phone number
     */
    async function sendOTP(phone: string): Promise<boolean> {
        state.loading = true
        state.error = null

        if (!isValidGhanaPhone(phone)) {
            state.error = 'Please enter a valid Ghana phone number'
            state.loading = false
            return false
        }

        const formattedPhone = formatPhoneE164(phone)

        try {
            const { error } = await supabase.auth.signInWithOtp({
                phone: formattedPhone,
            })

            if (error) {
                state.error = error.message
                state.loading = false
                return false
            }

            state.phone = formattedPhone
            state.step = 'otp'
            state.loading = false
            return true
        } catch (err: any) {
            state.error = err.message || 'Failed to send OTP'
            state.loading = false
            return false
        }
    }

    /**
     * Verify OTP code
     */
    async function verifyOTP(otp: string): Promise<boolean> {
        state.loading = true
        state.error = null

        if (otp.length !== 6) {
            state.error = 'OTP must be 6 digits'
            state.loading = false
            return false
        }

        try {
            const { error } = await supabase.auth.verifyOtp({
                phone: state.phone,
                token: otp,
                type: 'sms',
            })

            if (error) {
                state.error = error.message
                state.loading = false
                return false
            }

            // Fetch or create profile
            await fetchProfile()

            state.loading = false
            return true
        } catch (err: any) {
            state.error = err.message || 'Failed to verify OTP'
            state.loading = false
            return false
        }
    }

    /**
     * Resend OTP
     */
    async function resendOTP(): Promise<boolean> {
        return sendOTP(state.phone)
    }

    /**
     * Fetch user profile
     */
    async function fetchProfile(): Promise<Profile | null> {
        if (!user.value) return null

        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user.value.id)
                .single()

            if (error) {
                console.error('Error fetching profile:', error)
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
        await supabase.auth.signOut()
        profile.value = null
        state.step = 'phone'
        state.phone = ''
        state.otp = ''
    }

    /**
     * Reset auth state
     */
    function resetState(): void {
        state.phone = ''
        state.otp = ''
        state.step = 'phone'
        state.loading = false
        state.error = null
    }

    // Initialize profile on mount
    onMounted(async () => {
        if (user.value) {
            await fetchProfile()
        }
    })

    // Watch for user changes
    watch(user, async (newUser) => {
        if (newUser) {
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
