const router = require('express').Router();
const { sequelize } = require('../db/models');

const { Payment } = sequelize.models

router.get('/', async (req, res) => {
  // 로그인 검증 프로세스 필요함.
  const { userId } = req.query;
  try {
    const result = await Payment.findAll({
      where: {
        UserId: userId
      },
    });
    res.send({ ok: true, result, message: "결제수단 조회 완료" });
  } catch(err) {
    console.error(err);
  }
})

router.post('/', async (req, res) => {
  const { userId, method } = req.body;
  try {
    await Payment.create({
      method,
      UserId: userId
    });
    res.send({ ok: true, message: "결제수단 등록 완료" });
  } catch(err) {
    console.error(err);
  }
})

router.delete('/', async (req, res) => {
  const { userId, method } = req.body;
  try {
    await Payment.destroy({
      where: {
        UserId: userId,
        method
      }
    })
    res.send({ ok: true, message: "결제수단 삭제 완료" })
  } catch(err) {
    console.error(err);
  }
})

module.exports = router;