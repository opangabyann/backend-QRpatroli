"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class user extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      user.hasMany(models.laporan, {
        as: "dataUser",
        foreignKey: "idUser",
      });
      user.hasMany(models.logPatroli, {
        as: "logUser",
        foreignKey: "idUser",
      });
      user.hasOne(models.titikPatroli, {
        as: "createdby",
        foreignKey: "createdBy",
      });
      user.hasOne(models.titikPatroli, {
        as: "updatedby",
        foreignKey: "updatedBy",  
      });
    }
  }
  user.init(
    {
      nama: DataTypes.STRING,
      nopek: DataTypes.STRING,
      password: DataTypes.STRING,
      role: DataTypes.ENUM("admin", "security", "superAdmin"),
      noTelp: DataTypes.STRING,
      createdBy: DataTypes.INTEGER,
      updatedBy: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "user",
    }
  );
  return user;
};
