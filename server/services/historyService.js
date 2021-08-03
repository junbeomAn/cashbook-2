const { QueryTypes } = require('sequelize');

const { sequelize, Sequelize } = require('../db/models');

const { History } = sequelize.models;

const { arrangeByDate } = require('../utils/routes');

const selectPaymentMethod = sequelize.literal(
  '(SELECT method FROM `payments` WHERE payments.id = `History`.`PaymentId`)'
);

const getHistoriesOfOneMonth = async (whereOptions) => {
  try {
    const histories = await History.findAll({
      attributes: [
        'id',
        'date',
        'contents',
        'amount',
        'UserId',
        'CategoryId',
        [selectPaymentMethod, 'payment'],
      ],
      where: whereOptions,
      order: [['date', 'DESC']],
    });
    const result = arrangeByDate(histories);

    return { result };
  } catch (err) {
    console.error(err);
    return { err };
  }
};

const getHistoriesOfSixMonth = async (whereOptions) => {
  const { UserId, CategoryId, date } = whereOptions;
  const [startDate, endDate] = date;
  const selectSixMonthHistoriesQuery = `SELECT CategoryId, SUM(amount) AS total, MONTH(date) AS month FROM histories AS History WHERE History.UserId = ${UserId} AND History.CategoryId = ${CategoryId} AND History.amount < 0 AND History.date BETWEEN '${startDate}' AND '${endDate}' GROUP BY month ORDER BY month DESC`;

  try {
    const result = await sequelize.query(selectSixMonthHistoriesQuery, {
      type: Sequelize.QueryTypes.SELECT,
    });

    return { result };
  } catch (err) {
    console.error(err);
    return { err };
  }
};

const createHistory = async (data) => {
  try {
    const result = await History.create(data);
    return { result };
  } catch (err) {
    console.error(err);
    return { err };
  }
};

const updateHistory = async (newData, whereOptions) => {
  try {
    const result = await History.update(newData, whereOptions);
    return { result };
  } catch (err) {
    console.error(err);
    return { err };
  }
};

module.exports = {
  getHistoriesOfOneMonth,
  getHistoriesOfSixMonth,
  createHistory,
  updateHistory,
};
