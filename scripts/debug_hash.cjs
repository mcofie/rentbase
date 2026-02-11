
const crypto = require('crypto');

const password = 'Filmmaker@1';
const stored = '6b9e076e88b2c3b20fb1667695bc3e7b:84673d1ed87f5029322ae0f336dbcb5ee5f4ee8b0ad24281d8250ebfa1eea0a4e68a3e2ed41324e0d0e8908ccbed55402f99702cdfafdbb6cb6f5cfb1c1ca4d1';

const [salt, storedHash] = stored.split(':');
const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');

console.log('Calculated Hash:', hash);
console.log('Stored Hash:    ', storedHash);
console.log('Match:', hash === storedHash);
