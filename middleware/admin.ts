export default defineNuxtRouteMiddleware(async (to, from) => {
    const user = useSupabaseUser()
    const client = useSupabaseClient()

    // 1. Check if logged in
    if (!user.value) {
        return navigateTo('/auth/login')
    }

    // 2. Fetch profile to check role
    const { data: profile } = await client
        .from('profiles')
        .select('role')
        .eq('id', user.value.id)
        .single()

    // 3. Redirect if not admin
    if (!profile || profile.role !== 'admin') {
        return navigateTo('/')
    }
})
