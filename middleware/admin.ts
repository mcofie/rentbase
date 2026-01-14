/**
 * Admin Middleware
 * Validates admin session using custom OTP-based authentication
 */
export default defineNuxtRouteMiddleware(async (to, from) => {
    // Skip middleware on server-side for initial page load
    // The API will handle auth validation
    if (import.meta.server) {
        return
    }

    try {
        // Check if user has a valid admin session by calling the /api/admin/auth/me endpoint
        await $fetch('/api/admin/auth/me')
        // Session is valid, allow access
    } catch (error: any) {
        // No valid session, redirect to admin login
        return navigateTo('/admin/login')
    }
})
