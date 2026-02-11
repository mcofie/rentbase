
const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
dotenv.config();

const supabaseUrl = process.env.NUXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey, {
    db: { schema: 'rentbase' }
});

async function checkPolicies() {
    const { data, error } = await supabase.rpc('get_policies', { table_name: 'agent_reports' });

    if (error) {
        // fallback to manual query
        const { data: policies, error: polErr } = await supabase
            .from('pg_policies')
            .select('*')
            .eq('schemaname', 'rentbase')
            .eq('tablename', 'agent_reports');

        if (polErr) console.error(polErr);
        else console.log('Policies:', policies);
    } else {
        console.log('Policies:', data);
    }
}

checkPolicies().then(() => process.exit());
