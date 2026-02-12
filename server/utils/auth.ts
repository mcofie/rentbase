import { createClient } from '@supabase/supabase-js'
import crypto from 'crypto'
import { useRuntimeConfig } from '#imports'
import { validatePhone } from '~/server/utils/validation'

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

export async function findUserByPhone(phone: string) {
    const supabase = getServiceClient()

    // Normalize phone using standardized utility
    const phoneValidation = validatePhone(phone)
    if (!phoneValidation.valid) return null
    const normalizedPhone = phoneValidation.value

    // 1. Check Profiles table (for existing agents/tenants)
    const { data: profile } = await supabase
        .from('profiles')
        .select('id, full_name, role')
        .eq('phone_number', normalizedPhone)
        .single()

    if (profile) {
        return { id: profile.id, name: profile.full_name, role: profile.role }
    }

    // 2. Check Approved Agent Claims (if profile doesn't exist yet)
    const { data: agent } = await supabase
        .from('agent_claims')
        .select('id, full_name, status')
        .eq('phone', normalizedPhone)
        .eq('status', 'approved')
        .single()

    if (agent) {
        return { id: agent.id, name: agent.full_name, role: 'agent' }
    }

    // 3. Check Admin
    const { data: admin } = await supabase
        .from('admin_users')
        .select('id, name')
        .eq('phone', normalizedPhone)
        .eq('is_active', true)
        .single()

    if (admin) {
        return { ...admin, role: 'admin' }
    }

    return null
}

export async function findUserById(id: string) {
    const supabase = getServiceClient()

    // 1. Check Profiles
    const { data: profile } = await supabase
        .from('profiles')
        .select('id, phone_number, full_name, role')
        .eq('id', id)
        .single()

    if (profile) {
        return { id: profile.id, phone: profile.phone_number, name: profile.full_name, role: profile.role }
    }

    // 2. Check Claims
    const { data: agent } = await supabase
        .from('agent_claims')
        .select('id, phone, full_name, status')
        .eq('id', id)
        .eq('status', 'approved')
        .single()

    if (agent) {
        return { id: agent.id, phone: agent.phone, name: agent.full_name, role: 'agent' }
    }

    // 3. Check Admin
    const { data: admin } = await supabase
        .from('admin_users')
        .select('id, phone, name')
        .eq('id', id)
        .eq('is_active', true)
        .single()

    if (admin) {
        return { ...admin, role: 'admin' }
    }

    return null
}

export async function createSession(userId: string, role: string) {
    const supabase = getServiceClient()
    const sessionToken = crypto.randomBytes(32).toString('hex')
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours

    // If it's an admin, use admin_sessions. Otherwise use user_sessions.
    const tableName = role === 'admin' ? 'admin_sessions' : 'user_sessions'
    const idColumn = role === 'admin' ? 'admin_id' : 'user_id'

    const insertData: any = {
        [idColumn]: userId,
        session_token: sessionToken,
        expires_at: expiresAt.toISOString()
    }

    if (tableName === 'user_sessions') {
        insertData.role = role
    }

    console.log(`[Auth] Creating session for ${userId} (${role}) in ${tableName}`)

    const { error } = await supabase
        .from(tableName)
        .insert(insertData)

    if (error) {
        console.error('[Auth] Session creation error:', JSON.stringify(error, null, 2))
        return null
    }

    return { sessionToken, expiresAt }
}

export async function createLoginOTP(phone: string) {
    const supabase = getServiceClient()
    const otp = Math.floor(100000 + Math.random() * 900000).toString()
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000) // 5 minutes

    // Store in admin_otps for now as it's a generic OTP table
    await supabase
        .from('admin_otps')
        .delete()
        .eq('phone', phone)

    const { error } = await supabase
        .from('admin_otps')
        .insert({
            phone,
            otp_code: otp,
            expires_at: expiresAt.toISOString(),
            is_used: false,
            attempts: 0
        })

    if (error) {
        console.error('OTP creation error:', error)
        return null
    }

    console.log(`[Auth] OTP created for ${phone}: ${otp}`)

    return { otp, expiresAt }
}

export async function verifyLoginOTP(phone: string, code: string) {
    const supabase = getServiceClient()

    console.log(`[Auth] Verifying OTP for ${phone}, code: ${code}`)

    const { data: record, error } = await supabase
        .from('admin_otps')
        .select('*')
        .eq('phone', phone)
        .eq('otp_code', code)
        .eq('is_used', false)
        .gt('expires_at', new Date().toISOString())
        .single()

    if (error || !record) {
        console.warn(`[Auth] OTP verification failed for ${phone}. Error:`, error?.message || 'No record found')
        return { success: false, error: 'Invalid or expired code' }
    }

    // Mark as used
    await supabase
        .from('admin_otps')
        .update({ is_used: true })
        .eq('id', record.id)

    return { success: true }
}
