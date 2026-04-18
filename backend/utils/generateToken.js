const jwt = require('jsonwebtoken');

const generateToken = (id) => {
    let secret = process.env.JWT_SECRET;
    if (!secret || secret === 'undefined' || secret === 'null') {
        secret = 'tailorshop_default_secret_key_123';
    }
    return jwt.sign({ id }, secret, {
        expiresIn: '30d',
    });
};

module.exports = generateToken;
