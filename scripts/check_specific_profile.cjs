
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
    process.env.NUXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    {
        db: { schema: 'rentbase' }
    }
);

async function checkSpecificProfile() {
    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('phone_number', '+233558508306');

    if (error) {
        console.error('Error:', error);
        return;
    }

    console.log('Profile found:', data);
}

checkSpecificProfile();
