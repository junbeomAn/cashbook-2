'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class History extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      models.History.belongsTo(models.User);
      models.History.belongsTo(models.Category);
      models.History.belongsTo(models.Payment);
    }
  };
  History.init({
    date: DataTypes.DATE,
    contents: DataTypes.STRING,
    amount: DataTypes.INTEGER
  }, {
    sequelize,
    underscored: false,
    timestamps: false,
    modelName: 'History',
    tableName: 'histories',
    charset: 'utf8',
    collate: 'utf8_general_ci'
  });
  return History;
};