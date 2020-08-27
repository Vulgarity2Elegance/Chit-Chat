"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class UserRecipe extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      UserRecipe.belongsTo(models.User, {
        foreignKey: {
          allowNull: false,
        },
      });
    }
  }
  UserRecipe.init(
    {
      recipeID: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "UserRecipe",
    }
  );
  return UserRecipe;
};
