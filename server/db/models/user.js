'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.User.hasMany(models.History);
      models.User.hasMany(models.Payment);
    }
  }
  User.init(
    {
      nickname: DataTypes.STRING,
      accessToken: DataTypes.STRING,
    },
    {
      sequelize,
      underscored: false,
      timestamps: false,
      modelName: 'User',
      tableName: 'users',
      charset: 'utf8',
      collate: 'utf8_general_ci',
    }
  );
  return User;
};
