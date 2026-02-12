
const crypto = require('crypto');

function verify(password, salt, storedHash) {
    const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
    console.log('Input Password:', password);
    console.log('Salt:', salt);
    console.log('Stored Hash:', storedHash);
    console.log('Generated Hash:', hash);
    console.log('Match:', hash === storedHash);
}

// These values should be what's in the DB after my reset script
// I need to fetch the actual values from the DB to be sure.
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
    process.env.NUXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    { db: { schema: 'rentbase' } }
);

async function check() {
    const { data: admin } = await supabase
        .from('admin_users')
        .select('password_hash')
        .eq('email', 'maxcofie@gmail.com')
        .single();

    if (!admin || !admin.password_hash) {
        console.log('Admin not found or no hash');
        return;
    }

    const [salt, storedHash] = admin.password_hash.split(':');
    verify('admin123', salt, storedHash);
}

check();
