
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
    process.env.NUXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    {
        db: { schema: 'rentbase' }
    }
);

async function checkAgents() {
    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'agent');

    if (error) {
        console.error('Error:', error);
        return;
    }

    console.log('Agents found count:', data?.length);
    if (data?.length > 0) {
        console.log('First agent:', data[0]);
    }
}

checkAgents();
