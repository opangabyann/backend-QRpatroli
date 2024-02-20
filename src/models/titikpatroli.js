"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class titikPatroli extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      titikPatroli.hasOne(models.logPatroli, {
        as: "titikPatroli",
        foreignKey: "idTitikPatroli",
      });
      titikPatroli.belongsTo(models.user, {
        as: "createdby",
        foreignKey: "createdBy",
      });
      titikPatroli.belongsTo(models.user, {
        as: "updatedby",
        foreignKey: "updatedBy",
      });
    }
  }
  titikPatroli.init(
    {
      nama: DataTypes.STRING,
      foto: DataTypes.STRING,
      thumbnail_id: DataTypes.STRING,
      latitude: DataTypes.STRING,
      longitude: DataTypes.STRING,
      deskripsi: DataTypes.STRING,
      createdBy: DataTypes.INTEGER,
      updatedBy: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "titikPatroli",
    }
  );
  return titikPatroli;
};
