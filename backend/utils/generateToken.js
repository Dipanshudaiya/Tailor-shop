const jwt = require('jsonwebtoken');

const generateToken = (id) => {
    const secret = process.env.JWT_SECRET || 'tailorshop_default_secret_key_123';
    return jwt.sign({ id }, secret, {
        expiresIn: '30d',
    });
};

module.exports = generateToken;
