
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
    process.env.NUXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    {
        db: { schema: 'rentbase' }
    }
);

async function checkClaims() {
    const { data, error } = await supabase
        .from('agent_claims')
        .select('*');

    if (error) {
        console.error('Error:', error);
        return;
    }

    console.log('Claims found count:', data?.length);
    if (data?.length > 0) {
        console.log('Last claim:', data[data.length - 1]);
    }
}

checkClaims();
