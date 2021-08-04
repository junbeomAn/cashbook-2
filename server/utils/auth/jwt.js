const jwt = require('jsonwebtoken');

const key = process.env.JWT_KEY;

module.exports = {
  sign: (payload) => {
    const token = jwt.sign(payload, key, {
      expiresIn: '7d',
    });
    return token;
  },
  verify: (token) => {
    try {
      const decoded = jwt.verify(token, key);
      return { ok: true, decoded };
    } catch (err) {
      return { ok: false, err: err.message };
    }
  },
};
