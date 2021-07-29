'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Payment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      models.Payment.hasMany(models.History);
      models.Payment.belongsTo(models.User);
    }
  };
  Payment.init({
    method: {
      type: DataTypes.TEXT,
      allowNull: false
    }
  }, {
    sequelize,
    underscored: false,
    timestamps: false,
    modelName: 'Payment',
    tableName: 'payments',
    charset: 'utf8',
    collate: 'utf8_general_ci'   
  });
  return Payment;
};