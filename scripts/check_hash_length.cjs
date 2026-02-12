
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
    process.env.NUXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    { db: { schema: 'rentbase' } }
);

async function checkColumn() {
    // We can't easily check information_schema via supabase-js without an RPC, 
    // but we can just fetch the data and check its length.
    const { data: admin } = await supabase
        .from('admin_users')
        .select('password_hash')
        .eq('email', 'maxcofie@gmail.com')
        .single();

    if (admin && admin.password_hash) {
        console.log('Value:', admin.password_hash);
        console.log('Length:', admin.password_hash.length);
    }
}

checkColumn();
