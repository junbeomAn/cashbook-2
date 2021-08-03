const { sequelize } = require('../db/models');

const { Payment } = sequelize.models;

const getPaymentId = async (whereOptions) => {
  try {
    const result = await Payment.findOne({
      where: whereOptions,
    });
    return result;
  } catch (err) {
    console.error(err);
    return err;
  }
};

module.exports = {
  getPaymentId,
};
