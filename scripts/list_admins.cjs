
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
    process.env.NUXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    { db: { schema: 'rentbase' } }
);

async function listAdmins() {
    const { data, error } = await supabase
        .from('admin_users')
        .select('id, email, phone, name, password_hash');

    if (error) {
        console.error('Error:', error);
        return;
    }

    data.forEach(admin => {
        console.log(`ID: ${admin.id} | Email: ${admin.email} | Phone: ${admin.phone} | Name: ${admin.name} | Has Password: ${admin.password_hash ? 'YES' : 'NO'}`);
    });
}

listAdmins();
