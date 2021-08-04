const express = require('express');

const historyRouter = require('./history');
const usersRouter = require('./users');
const paymentRouter = require('./payment');
const { authMiddleware } = require('../utils/auth/middleware');

const router = express.Router();

router.use('/users', usersRouter);
router.use(authMiddleware);
router.use('/history', historyRouter);
router.use('/payment', paymentRouter);

module.exports = router;
