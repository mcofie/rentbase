/**
 * Admin Authentication Composable
 * Manages admin auth state on the client
 */

interface AdminUser {
    id: string
    phone: string
    name?: string
}

export function useAdminAuth() {
    const admin = useState<AdminUser | null>('adminUser', () => null)
    const loading = useState<boolean>('adminAuthLoading', () => true)
    const isAuthenticated = computed(() => !!admin.value)

    /**
     * Check current auth status
     */
    async function checkAuth() {
        loading.value = true
        try {
            const response = await $fetch('/api/admin/auth/me') as { admin: AdminUser }
            admin.value = response.admin
        } catch {
            admin.value = null
        } finally {
            loading.value = false
        }
    }

    /**
     * Send OTP to phone number
     */
    async function sendOTP(phone: string) {
        const response = await $fetch('/api/admin/auth/send-otp', {
            method: 'POST',
            body: { phone }
        })
        return response
    }

    /**
     * Verify OTP and login
     */
    async function verifyOTP(phone: string, otp: string) {
        const response = await $fetch('/api/admin/auth/verify-otp', {
            method: 'POST',
            body: { phone, otp }
        })

        // Refresh admin state after successful login
        await checkAuth()

        return response
    }

    /**
     * Logout
     */
    async function logout() {
        try {
            await $fetch('/api/admin/auth/logout', { method: 'POST' })
        } catch {
            // Ignore errors
        }
        admin.value = null
    }

    return {
        admin: readonly(admin),
        loading: readonly(loading),
        isAuthenticated,
        checkAuth,
        sendOTP,
        verifyOTP,
        logout
    }
}
