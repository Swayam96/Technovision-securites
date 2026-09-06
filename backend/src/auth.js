const crypto = require('crypto');

const ITERATIONS = 120000;
const KEYLEN = 32; // sha256 output is 32 bytes
const DIGEST = 'sha256';

function hashPassword(password) {
    const salt = crypto.randomBytes(16);
    const derivedKey = crypto.pbkdf2Sync(password, salt, ITERATIONS, KEYLEN, DIGEST);
    return `${salt.toString('hex')}:${derivedKey.toString('hex')}`;
}

function verifyPassword(password, stored) {
    try {
        const parts = stored.split(':');
        if (parts.length !== 2) return false;
        
        const saltHex = parts[0];
        const digestHex = parts[1];
        
        const salt = Buffer.from(saltHex, 'hex');
        const expected = Buffer.from(digestHex, 'hex');
        
        const actual = crypto.pbkdf2Sync(password, salt, ITERATIONS, KEYLEN, DIGEST);
        
        return crypto.timingSafeEqual(actual, expected);
    } catch (e) {
        return false;
    }
}

module.exports = {
    hashPassword,
    verifyPassword
};
