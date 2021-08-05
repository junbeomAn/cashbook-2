const router = require('express').Router();
const {
  getAllPayments,
  registerPayment,
  deletePayment,
} = require('../services/payment-service');
const {
  PAYMENT_FETCH_SUCCESS,
  PAYMENT_POST_SUCCESS,
  PAYMENT_DELETE_SUCCESS,
} = require('../utils/constant');

router.get('/', async (req, res) => {
  // 로그인 검증 프로세스 필요함.
  const { userId } = req.query;
  const whereOptions = {
    UserId: userId,
  };

  const { result, err } = await getAllPayments(whereOptions);
  if (!err) {
    res.send({ ok: true, result, message: PAYMENT_FETCH_SUCCESS });
  } else {
    res.send({ ok: false, err });
  }
});

router.post('/', async (req, res) => {
  const { userId, method, color } = req.body;
  const data = {
    method,
    color,
    UserId: userId,
  };
  const { err } = await registerPayment(data);
  if (!err) {
    res.send({ ok: true, message: PAYMENT_POST_SUCCESS });
  } else {
    res.send({ ok: false, err });
  }
});

router.delete('/', async (req, res) => {
  const { userId, method } = req.body;
  const whereOptions = {
    UserId: userId,
    method,
  };
  const { err } = await deletePayment(whereOptions);
  if (!err) {
    res.send({ ok: true, message: PAYMENT_DELETE_SUCCESS });
  } else {
    res.send({ ok: false, err });
  }
});

module.exports = router;
