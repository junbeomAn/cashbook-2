const { sequelize } = require('../db/models');

const { Payment } = sequelize.models;

const getPaymentId = async (whereOptions) => {
  try {
    const result = await Payment.findOne({
      where: whereOptions,
    });
    return { result: result.id };
  } catch (err) {
    console.error(err);
    return { err: err.message };
  }
};

const getAllPayments = async (whereOptions) => {
  try {
    const result = await Payment.findAll({
      where: whereOptions,
    });
    return { result };
  } catch (err) {
    console.error(err);
    return { err: err.message };
  }
};

const registerPayment = async (data) => {
  try {
    const result = await Payment.create(data);
    return { result };
  } catch (err) {
    console.error(err);
    return { err: err.message };
  }
};

const deletePayment = async (whereOptions) => {
  try {
    const result = await Payment.destroy({
      where: whereOptions,
    });
    return { result };
  } catch (err) {
    console.error(err);
    return { err: err.message };
  }
};

module.exports = {
  getPaymentId,
  getAllPayments,
  registerPayment,
  deletePayment,
};
