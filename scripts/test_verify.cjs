
// This script simulates the verifyPassword call in the actual server context
const { verifyPassword } = require('./server/utils/adminAuth');

async function test() {
    console.log('Testing login for maxcofie@gmail.com / Filmmaker@1');
    const result = await verifyPassword('maxcofie@gmail.com', 'Filmmaker@1');
    console.log('Result:', JSON.stringify(result, null, 2));
}

// We need to mock useRuntimeConfig for this to work outside of Nuxt
global.useRuntimeConfig = () => ({
    public: {
        supabaseUrl: process.env.NUXT_PUBLIC_SUPABASE_URL
    },
    supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY
});

// Mock $fetch if needed, but verifyPassword uses supabase client
// ... but verifyPassword is an ES module and we are in CommonJS
// I'll use a dynamic import or just run it with node's experimental loader
test();
