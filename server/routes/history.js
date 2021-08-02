const router = require('express').Router();
const { sequelize, Sequelize } = require('../db/models');
const { HISTORIES_FETCH_SUCCESS, HISTORIES_POST_SUCCESS, HISTORIES_BY_CATEGORY_FETCH_SUCCESS } = require('../utils/constant');
const { arrangeByDate, getDateRange, formatDate, encodeHTML } = require('../utils/routes');

const { History, Payment } = sequelize.models;
// history post 요청 처리

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


const selectPaymentMethod = sequelize.literal(`(SELECT method FROM payments WHERE payments.id = histories.PaymentId)`);


router.get('/', async (req, res) => {
  const { userId, year, month } = req.query;
  
  const [startDate, endDate] = getDateRange(year, month, 1);

  try {
    const histories = await History.findAll({
      attributes: ['id', 'date', 'contents', 'amount', 'UserId', 'categoryId', [selectPaymentMethod, 'payment']],
      where: {
        UserId: userId,
        date: {
          [Sequelize.Op.between]: [startDate, endDate]
        }
      },
      order: [['date', 'DESC']]
    })
    const result = arrangeByDate(histories);

    res.send({ ok: true, result, message: HISTORIES_FETCH_SUCCESS });
  } catch (err) {
    console.error(err);
  }
})

// 카테고리 id 별 조회 

router.get('/category/:categoryId', async (req, res) => { // 중복 제거 필요한 상황
  const { categoryId } = req.params;
  const { userId, year, month } = req.query;
  
  const [startDate, endDate] = getDateRange(year, month, 1);

  try {
    const histories = await History.findAll({
      attributes: ['id', 'date', 'contents', 'amount', 'UserId', 'categoryId', [selectPaymentMethod, 'payment']],
      where: {
        UserId: userId,
        CategoryId: categoryId,
        date: {
          [Sequelize.Op.between]: [startDate, endDate]
        }
      },
      order: [['date', 'DESC']]
    })
    const result = arrangeByDate(histories);

    res.send({ ok: true, result, message: HISTORIES_FETCH_SUCCESS });
  } catch (err) {
    console.error(err);
  }
})

// 그래프를 구성할 해당 카테고리 6개월치 기록
router.get('/graph/:categoryId', async (req, res) => {
  const { categoryId } = req.params;
  const { userId, year, month } = req.query;
  const [startDate, endDate] = getDateRange(year, month, 6);

  try {
    const result = await History.findAll({
      attributes: [
        'CategoryId',
        [Sequelize.fn('SUM', Sequelize.col('amount')), 'total'],
        [Sequelize.fn('MONTH', Sequelize.col('date')), 'month']
      ],
      where: {
        UserId: userId,
        CategoryId: categoryId,
        amount: {
          [Sequelize.Op.lt]: 0
        },
        date: {
          [Sequelize.Op.between]: [startDate, endDate]
        }
      },
      group: ['month'],
      order: [['month', 'DESC']]
    });
    res.send({ ok: true, result, message: HISTORIES_BY_CATEGORY_FETCH_SUCCESS(categoryId) });
  } catch (err) {
    console.error(err);
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
  const { date, categoryId, contents, payment, amount } = req.body;
  const formattedDate = formatDate(date);
  const userId = 1;

  try {
    const PaymentId = await Payment.find({
      where: {
        UserId: userId,
        method: payment
      }
    });

    await History.create({
      date: formattedDate,
      contents: encodeHTML(contents),
      amount,
      CategoryId: categoryId,
      PaymentId,
      UserId: userId
  
    })
    res.send({ ok: true, message: HISTORIES_POST_SUCCESS });
  } catch(err) {
    console.error(err);
  }
})

router.put('/', async (req, res) => {
  const { date, categoryId, contents, payment, amount } = req.body;
  const { id } = req.query;
  const formattedDate = formatDate(date);
  const userId = 1;

  try {
    const PaymentId = await Payment.find({
      where: {
        UserId: userId,
        method: payment
      }
    });

    await History.update({
      date: formattedDate,
      contents: encodeHTML(contents),
      amount,
      CategoryId: categoryId,
      PaymentId,
      UserId: userId, 
    }, {
      where: {
        id
      }
    })
    res.send({ ok: true, message: HISTORIES_PUT_SUCCESS });
  } catch(err) {
    console.error(err);
  }
})

module.exports = router;