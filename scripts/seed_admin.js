import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

// Load environment variables
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
dotenv.config({ path: path.resolve(__dirname, '../.env') })

const supabaseUrl = process.env.NUXT_PUBLIC_SUPABASE_URL
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !serviceRoleKey) {
    console.error('Error: Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env')
    process.exit(1)
}

const supabase = createClient(supabaseUrl, serviceRoleKey)

async function seedAdmin() {
    const phone = '+233558508306'
    const password = 'password123'

    console.log(`Creating/Updating admin user with phone: ${phone}`)

    // 1. Check if user already exists
    const { data: { users }, error: listError } = await supabase.auth.admin.listUsers()

    if (listError) {
        console.error('Error listing users:', listError)
        return
    }

    let userId = users.find(u => u.phone === phone)?.id

    if (!userId) {
        // 2. Create user if not exists
        console.log('User not found, creating new user...')
        const { data: { user }, error: createError } = await supabase.auth.admin.createUser({
            phone,
            password,
            phone_confirm: true
        })

        if (createError) {
            console.error('Error creating user:', createError)
            return
        }

        if (!user) {
            console.error('User creation returned no data')
            return
        }

        userId = user.id
        console.log(`User created with ID: ${userId}`)

        // Give existing trigger a moment to run
        await new Promise(r => setTimeout(r, 2000))
    } else {
        console.log(`User already exists with ID: ${userId}`)
    }

    // 3. Update profile role
    console.log('Updating profile role to admin...')

    // Retry loop because trigger might be slightly delayed
    for (let i = 0; i < 3; i++) {
        const { error: updateError } = await supabase
            .from('profiles')
            .update({ role: 'admin' })
            .eq('id', userId)

        if (!updateError) {
            console.log('Successfully updated role to admin!')
            return
        }

        console.log(`Attempt ${i + 1} failed, retrying in 1s...`)
        await new Promise(r => setTimeout(r, 1000))
    }

    console.error('Failed to update profile role after retries.')
}

seedAdmin()
