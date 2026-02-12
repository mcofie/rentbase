/**
 * Admin OTP Authentication Utility
 * Custom implementation not using Supabase Auth SDK
 */

import { createClient } from '@supabase/supabase-js'
import crypto from 'crypto'
import { useRuntimeConfig } from '#imports'

// Use service role key for admin operations
function getServiceClient() {
    const config = useRuntimeConfig()
    return createClient(
        config.public.supabaseUrl as string,
        config.supabaseServiceRoleKey as string,
        {
            auth: { persistSession: false },
            db: { schema: 'rentbase' }
        }
    )
}

/**
 * Generate a 6-digit OTP code
 */
export function generateOTPCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString()
}

/**
 * Generate a secure session token
 */
export function generateSessionToken(): string {
    return crypto.randomBytes(32).toString('hex')
}

/**
 * Check if a phone number is a registered admin
 */
export async function isAdminPhone(phone: string): Promise<boolean> {
    const result = await isAdminPhoneWithDebug(phone)
    return result.isAdmin
}

/**
 * Check if a phone is admin with debug info
 */
export async function isAdminPhoneWithDebug(phone: string): Promise<{
    isAdmin: boolean
    debug: { allPhones: string[]; error: string | null }
}> {
    const supabase = getServiceClient()

    console.log('[isAdminPhone] Checking phone:', phone)

    // First, let's see all admin users for debugging
    const { data: allAdmins, error: listError } = await (supabase as any)
        .schema('rentbase')
        .from('admin_users')
        .select('id, phone, is_active')

    console.log('[isAdminPhone] All admins in DB:', allAdmins)

    const allPhones = (allAdmins || []).map((a: any) => a.phone)

    if (listError) {
        console.error('[isAdminPhone] Error listing admins:', listError)
        return {
            isAdmin: false,
            debug: { allPhones: [], error: listError.message }
        }
    }

    const { data, error } = await (supabase as any)
        .schema('rentbase')
        .from('admin_users')
        .select('id, is_active')
        .eq('phone', phone)
        .single()

    console.log('[isAdminPhone] Query result:', { data, error: error?.message })

    return {
        isAdmin: !error && data?.is_active === true,
        debug: { allPhones, error: error?.message || null }
    }
}

/**
 * Create and store a new OTP for the given phone
 */
export async function createOTP(phone: string): Promise<{ otp: string; expiresAt: Date } | null> {
    const supabase = getServiceClient()

    // First check if this is an admin phone
    const isAdmin = await isAdminPhone(phone)
    if (!isAdmin) {
        return null
    }

    // Invalidate any existing OTPs for this phone
    await (supabase as any)
        .schema('rentbase')
        .from('admin_otps')
        .delete()
        .eq('phone', phone)

    // Generate new OTP
    const otp = generateOTPCode()
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000) // 5 minutes expiry

    const { error } = await (supabase as any)
        .schema('rentbase')
        .from('admin_otps')
        .insert({
            phone,
            otp_code: otp,
            expires_at: expiresAt.toISOString(),
            is_used: false,
            attempts: 0
        })

    if (error) {
        console.error('Failed to create OTP:', error)
        return null
    }

    return { otp, expiresAt }
}

/**
 * Verify an OTP code
 */
export async function verifyOTP(phone: string, code: string): Promise<{
    success: boolean
    error?: string
    sessionToken?: string
    expiresAt?: Date
}> {
    const supabase = getServiceClient()

    // Get the OTP record
    const { data: otpRecord, error: fetchError } = await (supabase as any)
        .schema('rentbase')
        .from('admin_otps')
        .select('*')
        .eq('phone', phone)
        .eq('is_used', false)
        .order('created_at', { ascending: false })
        .limit(1)
        .single()

    if (fetchError || !otpRecord) {
        return { success: false, error: 'No valid OTP found. Please request a new code.' }
    }

    // Check if expired
    if (new Date(otpRecord.expires_at) < new Date()) {
        await (supabase as any).schema('rentbase').from('admin_otps').delete().eq('id', otpRecord.id)
        return { success: false, error: 'OTP has expired. Please request a new code.' }
    }

    // Check attempts (max 3)
    if (otpRecord.attempts >= 3) {
        await (supabase as any).schema('rentbase').from('admin_otps').delete().eq('id', otpRecord.id)
        return { success: false, error: 'Too many attempts. Please request a new code.' }
    }

    // Verify code
    if (otpRecord.otp_code !== code) {
        // Increment attempts
        await (supabase as any)
            .schema('rentbase')
            .from('admin_otps')
            .update({ attempts: otpRecord.attempts + 1 })
            .eq('id', otpRecord.id)

        return { success: false, error: 'Invalid OTP code. Please try again.' }
    }

    // Mark OTP as used
    await (supabase as any)
        .schema('rentbase')
        .from('admin_otps')
        .update({ is_used: true })
        .eq('id', otpRecord.id)

    // Get admin user
    const { data: adminUser } = await (supabase as any)
        .schema('rentbase')
        .from('admin_users')
        .select('id')
        .eq('phone', phone)
        .single()

    if (!adminUser) {
        return { success: false, error: 'Admin user not found.' }
    }

    // Create session
    const sessionToken = generateSessionToken()
    const sessionExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours

    const { error: sessionError } = await (supabase as any)
        .schema('rentbase')
        .from('admin_sessions')
        .insert({
            admin_id: adminUser.id,
            session_token: sessionToken,
            expires_at: sessionExpiresAt.toISOString()
        })

    if (sessionError) {
        console.error('Failed to create session:', sessionError)
        return { success: false, error: 'Failed to create session.' }
    }

    // Update last login
    await (supabase as any)
        .schema('rentbase')
        .from('admin_users')
        .update({ last_login_at: new Date().toISOString() })
        .eq('id', adminUser.id)

    return {
        success: true,
        sessionToken,
        expiresAt: sessionExpiresAt
    }
}

/**
 * Validate a session token
 */
export async function validateSession(token: string): Promise<{
    valid: boolean
    adminId?: string
    phone?: string
    email?: string
    name?: string
}> {
    const supabase = getServiceClient()

    // 1. Get the session
    const { data: session, error: sessionError } = await (supabase as any)
        .schema('rentbase')
        .from('admin_sessions')
        .select('admin_id, expires_at')
        .eq('session_token', token)
        .single()

    if (sessionError || !session) {
        console.error('[validateSession] Session token not found:', { error: sessionError?.message, token: token.substring(0, 8) + '...' })
        return { valid: false }
    }

    // 2. Check expiry
    if (new Date(session.expires_at) < new Date()) {
        console.warn('[validateSession] Session expired:', { expires_at: session.expires_at, now: new Date().toISOString() })
        // Clean up expired session
        await (supabase as any).schema('rentbase').from('admin_sessions').delete().eq('session_token', token)
        return { valid: false }
    }

    // 3. Get the user
    const { data: adminUser, error: userError } = await (supabase as any)
        .schema('rentbase')
        .from('admin_users')
        .select('id, phone, email, name')
        .eq('id', session.admin_id)
        .single()

    if (userError || !adminUser) {
        console.error('[validateSession] Admin user not found for session:', { error: userError?.message, adminId: session.admin_id })
        return { valid: false }
    }

    return {
        valid: true,
        adminId: adminUser.id,
        phone: adminUser.phone,
        email: adminUser.email,
        name: adminUser.name
    }
}

/**
 * Invalidate a session (logout)
 */
export async function invalidateSession(token: string): Promise<boolean> {
    const supabase = getServiceClient()

    const { error } = await (supabase as any)
        .schema('rentbase')
        .from('admin_sessions')
        .delete()
        .eq('session_token', token)

    return !error
}

/**
 * Verify admin password and create session
 */
export async function verifyPassword(email: string, password: string): Promise<{
    success: boolean
    error?: string
    sessionToken?: string
    expiresAt?: Date
}> {
    const supabase = getServiceClient()

    console.log(`[verifyPassword] Attempting login for: ${email} (len: ${password?.length})`)

    // 1. Fetch admin user by email
    const { data: adminUser, error: fetchError } = await (supabase as any)
        .schema('rentbase')
        .from('admin_users')
        .select('*')
        .eq('email', email.toLowerCase().trim())
        .eq('is_active', true)
        .single()

    if (fetchError || !adminUser) {
        if (fetchError) console.error('[verifyPassword] DB Error:', fetchError)
        else console.warn(`[verifyPassword] Admin user not found or inactive for: ${email}`)
        return { success: false, error: 'Invalid credentials' }
    }

    // 3. Verify password hash
    const [salt, storedHash] = (adminUser.password_hash || '').split(':')

    if (!salt || !storedHash) {
        console.error('[verifyPassword] No salt or hash found in stored password_hash')
        return { success: false, error: 'Password not set for this account' }
    }

    // Trim password to handle accidental whitespace from inputs
    const trimmedPassword = password.trim()
    const hash = crypto.pbkdf2Sync(trimmedPassword, salt, 1000, 64, 'sha512').toString('hex')

    console.log(`[verifyPassword] Verification for ${email}:`)
    console.log(` - Stored Hash starts with: ${storedHash.substring(0, 8)}...`)
    console.log(` - Gen. Hash starts with:   ${hash.substring(0, 8)}...`)
    console.log(` - Match: ${hash === storedHash}`)

    if (hash !== storedHash) {
        console.error(`[verifyPassword] Hash mismatch for user: ${email}`)
        return { success: false, error: 'Invalid password' }
    }

    // 4. Create session
    const sessionToken = generateSessionToken()
    const sessionExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours

    const { error: sessionError } = await (supabase as any)
        .schema('rentbase')
        .from('admin_sessions')
        .insert({
            admin_id: adminUser.id,
            session_token: sessionToken,
            expires_at: sessionExpiresAt.toISOString()
        })

    if (sessionError) {
        console.error('Failed to create session:', sessionError)
        return { success: false, error: 'Failed to create session' }
    }

    // Update last login
    await (supabase as any)
        .schema('rentbase')
        .from('admin_users')
        .update({ last_login_at: new Date().toISOString() })
        .eq('id', adminUser.id)

    return {
        success: true,
        sessionToken,
        expiresAt: sessionExpiresAt
    }
}

/**
 * Helper to hash a password
 */
export function hashPassword(password: string): string {
    const salt = crypto.randomBytes(16).toString('hex')
    const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex')
    return `${salt}:${hash}`
}
