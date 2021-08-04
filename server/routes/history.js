const router = require('express').Router();
const { Sequelize } = require('../db/models');
const {
  getHistoriesOfOneMonth,
  getHistoriesOfSixMonth,
  createHistory,
  updateHistory,
} = require('../services/history-service');
const { getPaymentId } = require('../services/payment-service');
const {
  HISTORIES_FETCH_SUCCESS,
  HISTORIES_POST_SUCCESS,
  HISTORIES_BY_CATEGORY_FETCH_SUCCESS,
  HISTORIES_PUT_SUCCESS,
} = require('../utils/constant');
const { getDateRange, formatDate, encodeHTML } = require('../utils/routes');

/**
 * [
 *  {
 *    date: 날짜,
 *    history: [{ ...내역 }, {...내역 }, { ...내역 }],
 *    income: 00000,
 *    expenditure: -00000
 *  }
 *  {
 *    date: 날짜,
 *    history: [{ ...내역 }, {...내역 }, { ...내역 }],
 *    income: 00000,
 *    expenditure: -00000
 *  }
 * ]
 */

router.get('/', async (req, res) => {
  const { userId, year, month } = req.query;
  const [startDate, endDate] = getDateRange(year, month, 1);
  const whereOptions = {
    UserId: userId,
    date: {
      [Sequelize.Op.between]: [startDate, endDate],
    },
  };

  const { result, err } = await getHistoriesOfOneMonth(whereOptions);
  if (!err) {
    res.send({ ok: true, result, message: HISTORIES_FETCH_SUCCESS });
  } else {
    res.send({ ok: false, err });
  }
});

// 카테고리 id 별 조회
router.get('/category/:categoryId', async (req, res) => {
  const { categoryId } = req.params;
  const { userId, year, month } = req.query;

  const [startDate, endDate] = getDateRange(year, month, 1);
  const whereOptions = {
    UserId: userId,
    CategoryId: categoryId,
    date: {
      [Sequelize.Op.between]: [startDate, endDate],
    },
  };

  const { result, err } = await getHistoriesOfOneMonth(whereOptions);
  if (!err) {
    res.send({ ok: true, result, message: HISTORIES_FETCH_SUCCESS });
  } else {
    res.send({ ok: false, err });
  }
});

// 그래프를 구성할 해당 카테고리 6개월치 기록
router.get('/graph/:categoryId', async (req, res) => {
  const { categoryId } = req.params;
  const { userId, year, month } = req.query;
  const date = getDateRange(year, month, 6);
  const whereOptions = {
    UserId: userId,
    CategoryId: categoryId,
    date,
  };

  const { result, err } = await getHistoriesOfSixMonth(whereOptions);
  if (!err) {
    res.send({
      ok: true,
      result,
      message: HISTORIES_BY_CATEGORY_FETCH_SUCCESS(categoryId),
    });
  } else {
    res.send({ ok: false, err });
  }
});

/**
 * req.body = {
 *  date: YYYYMMDD,
 *  categoryId: 1 ~ 10,
 *  contents: 'sdfdf',
 *  payment: '현대카드',
 *  amount: + or - integer
 * }
 */

router.post('/', async (req, res) => {
  const { date, categoryId, contents, payment, amount, userId } = req.body;
  const formattedDate = formatDate(date);

  const whereOptions = {
    UserId: userId,
    method: payment,
  };
  const { result: PaymentId, err } = await getPaymentId(whereOptions);

  if (err) {
    res.send({ ok: false, err });
    return;
  }
  const data = {
    date: formattedDate,
    contents: encodeHTML(contents),
    amount,
    CategoryId: categoryId,
    PaymentId,
    UserId: userId,
  };

  const { err: historyErr } = await createHistory(data);
  if (!historyErr) {
    res.send({ ok: true, message: HISTORIES_POST_SUCCESS });
  } else {
    res.send({ ok: false, err: historyErr });
  }
});

router.put('/', async (req, res) => {
  const { date, categoryId, contents, payment, amount, userId } = req.body;
  const { id } = req.query;
  const formattedDate = formatDate(date);

  const paymentWhereOptions = {
    UserId: userId,
    method: payment,
  };
  const { result: PaymentId, err } = await getPaymentId(paymentWhereOptions);
  if (err) {
    res.send({ ok: false, err });
    return;
  }

  const newData = {
    date: formattedDate,
    contents: encodeHTML(contents),
    amount,
    CategoryId: categoryId,
    PaymentId,
    UserId: userId,
  };
  const whereOptions = {
    where: {
      id,
    },
  };
  const { historyErr } = await updateHistory(newData, whereOptions);
  if (!historyErr) {
    res.send({ ok: true, message: HISTORIES_PUT_SUCCESS });
  } else {
    res.send({ ok: false, err: historyErr });
  }
});

module.exports = router;
