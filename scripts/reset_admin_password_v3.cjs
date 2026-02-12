
const { createClient } = require('@supabase/supabase-js');
const crypto = require('crypto');
require('dotenv').config();

const supabase = createClient(
    process.env.NUXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    { db: { schema: 'rentbase' } }
);

function hashPassword(password) {
    const salt = crypto.randomBytes(16).toString('hex');
    // Important: Use exactly the same parameters as server/utils/adminAuth.ts
    const hash = crypto.pbkdf2Sync(password.trim(), salt, 1000, 64, 'sha512').toString('hex');
    return `${salt}:${hash}`;
}

async function resetPassword() {
    const email = 'maxcofie@gmail.com';
    const newPassword = 'Filmmaker@1';
    const newHash = hashPassword(newPassword);

    console.log(`Resetting password for ${email} to "${newPassword}"...`);

    const { error } = await supabase
        .from('admin_users')
        .update({ password_hash: newHash })
        .eq('email', email);

    if (error) {
        console.error('Error:', error);
    } else {
        console.log('Password reset successfully!');
    }
}

resetPassword();
