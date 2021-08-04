const auth = require('./jwt');

const authMiddleware = (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      throw new Error('Token does not exist.');
    }

    const result = auth.verify(token);
    if (!result.ok) {
      throw new Error('User verification falied.');
    }
    req.user = result;
    next();
  } catch (err) {
    res.status(403).send({ ok: false, message: err.message });
  }
};

module.exports = {
  authMiddleware,
};
