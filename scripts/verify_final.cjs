
const crypto = require('crypto');

const password = 'Filmmaker@1';
const stored = '50bab425a1ee5c7a4e00c99cead91963:c7ebb1a761ef92bc900421f76a08eff4349b7dc54367a17948bcb6b1b32f215d6457d27622c8bb277da917e82db88fad241945188158aa28589fd8df1814ba4b';

const [salt, storedHash] = stored.split(':');
const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');

console.log('Calculated Match:', hash === storedHash);
