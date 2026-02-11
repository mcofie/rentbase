
const crypto = require('crypto');

const password = 'testpassword123';
const stored = '64e55a0b3d4ce92620bae9d51ec6b01b:f69cd3a19eeed86ee6b10950177119ae6efecbeaf16d0e0d730ec47d8370dc124af7e47ec6373e6d120dd3e370b80e0693eabfa177a217e18540253d99505043';

const [salt, storedHash] = stored.split(':');
const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');

console.log('Calculated Match:', hash === storedHash);
