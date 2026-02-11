
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
    process.env.NUXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function listTables() {
    const { data, error } = await supabase.rpc('get_tables_in_schema', { schema_name: 'rentbase' });

    if (error) {
        // Fallback if RPC doesn't exist
        const { data: tables, error: tablesError } = await supabase
            .from('pg_tables')
            .select('tablename')
            .eq('schemaname', 'rentbase');

        if (tablesError) {
            console.error('Error listing tables:', tablesError);
            return;
        }
        console.log('Tables:', tables);
    } else {
        console.log('Tables:', data);
    }
}

listTables();
