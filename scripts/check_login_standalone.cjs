
const { createClient } = require('@supabase/supabase-js');
const crypto = require('crypto');
const dotenv = require('dotenv');

dotenv.config();

async function verifyPassword(email, password) {
    const supabase = createClient(
        process.env.NUXT_PUBLIC_SUPABASE_URL,
        process.env.SUPABASE_SERVICE_ROLE_KEY,
        {
            db: { schema: 'rentbase' }
        }
    );

    console.log('Checking email:', email);
    if (email.toLowerCase() !== 'maxcofie@gmail.com') {
        console.log('Email mismatch');
        return { success: false, error: 'Unauthorized email' };
    }

    const { data: adminUser, error: fetchError } = await supabase
        .from('admin_users')
        .select('*')
        .eq('email', email.toLowerCase())
        .eq('is_active', true)
        .single();

    if (fetchError || !adminUser) {
        console.log('User not found or fetch error:', fetchError?.message);
        return { success: false, error: 'Admin user not found or inactive' };
    }

    console.log('Found user:', adminUser.id);

    const [salt, storedHash] = (adminUser.password_hash || '').split(':');
    if (!salt || !storedHash) {
        console.log('No hash/salt found');
        return { success: false, error: 'Password not set for this account' };
    }

    const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');

    if (hash !== storedHash) {
        console.log('Hash mismatch!');
        console.log('Calc:', hash);
        console.log('Stor:', storedHash);
        return { success: false, error: 'Invalid password' };
    }

    console.log('Password verified!');

    // Try to create a session
    const sessionToken = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

    console.log('Inserting session...');
    const { error: sessionError } = await supabase
        .from('admin_sessions')
        .insert({
            admin_id: adminUser.id,
            session_token: sessionToken,
            expires_at: expiresAt
        });

    if (sessionError) {
        console.log('Session insert error:', sessionError.message);
        return { success: false, error: 'Session insert failed' };
    }

    console.log('Session created!');
    return { success: true, sessionToken };
}

verifyPassword('maxcofie@gmail.com', 'Filmmaker@1')
    .then(r => console.log('Final Result:', r))
    .catch(e => console.error('Error:', e));
