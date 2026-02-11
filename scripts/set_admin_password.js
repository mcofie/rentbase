
import { createClient } from '@supabase/supabase-js'
import crypto from 'crypto'
import dotenv from 'dotenv'

dotenv.config()

const supabaseUrl = process.env.NUXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing Supabase credentials in .env')
    process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    db: { schema: 'rentbase' }
})

function hashPassword(password) {
    const salt = crypto.randomBytes(16).toString('hex')
    const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex')
    return `${salt}:${hash}`
}

async function seedAdmin() {
    const email = 'maxcofie@gmail.com'
    const password = process.argv[2]

    if (!password) {
        console.error('Usage: node scripts/set_admin_password.js <password>')
        process.exit(1)
    }

    const hashedPassword = hashPassword(password)

    console.log(`Setting password for ${email}...`)

    // 1. First, find if an admin exists by phone (from previous OTP system)
    // or by email (new system)
    const { data: existingAdmin } = await supabase
        .from('admin_users')
        .select('id, email, phone')
        .or(`email.eq.${email},phone.eq.+233558508306`)
        .single()

    let error
    if (existingAdmin) {
        console.log(`Found existing admin account (ID: ${existingAdmin.id}). Updating...`)
        const { error: updateError } = await supabase
            .from('admin_users')
            .update({
                email: email,
                password_hash: hashedPassword
            })
            .eq('id', existingAdmin.id)
        error = updateError
    } else {
        console.log(`No existing admin found. Creating new account for ${email}...`)
        const { error: insertError } = await supabase
            .from('admin_users')
            .insert({
                email,
                name: 'Max Cofie',
                password_hash: hashedPassword,
                phone: '+233558508306' // Using your verified phone
            })
        error = insertError
    }

    if (error) {
        console.error('Error:', error.message)
        if (error.message.includes('column "email" of relation "admin_users" does not exist')) {
            console.error('\nIMPORTANT: You must run the migration in supabase/migrations/20260210_admin_password_auth.sql first!')
        }
    } else {
        console.log('Successfully set admin password.')
    }
}

seedAdmin()
