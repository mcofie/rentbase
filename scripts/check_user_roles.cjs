
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
    process.env.NUXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    { db: { schema: 'rentbase' } }
);

async function checkUserStats() {
    const phone = '+233558508306';

    const { data: admin } = await supabase.from('admin_users').select('id, name').eq('phone', phone).single();
    const { data: profile } = await supabase.from('profiles').select('id, role').eq('phone_number', phone).single();
    const { data: claim } = await supabase.from('agent_claims').select('id, status').eq('phone', phone).single();

    console.log('User Stats for', phone);
    console.log('Admin User:', admin ? 'YES' : 'NO');
    console.log('Profile:', profile ? `YES (Role: ${profile.role})` : 'NO');
    console.log('Agent Claim:', claim ? `YES (Status: ${claim.status})` : 'NO');
}

checkUserStats();
