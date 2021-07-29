'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Category extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.Category.hasMany(models.History);
    }
  };
  Category.init({
    name: {
      type: DataTypes.TEXT,
      allowNull: false
    }
  }, {
    sequelize,
    underscored: false,
    timestamps: false,
    modelName: 'Category',
    tableName: 'categories',
    charset: 'utf8',
    collate: 'utf8_general_ci'
  });
  return Category;
};