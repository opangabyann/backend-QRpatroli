'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class logPatroli extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      logPatroli.belongsTo(models.titikPatroli,{
      as: "titikPatroli",
        foreignKey : "idTitikPatroli"
      })
      logPatroli.belongsTo(models.user, {
        as : "logUser",
        foreignKey : "idUser"
      })
    }
  }
  logPatroli.init({
    idTitikPatroli: DataTypes.INTEGER,
    idUser: DataTypes.INTEGER,
    latitude: DataTypes.STRING,
    longitude: DataTypes.STRING,
    jamPatroli: DataTypes.STRING,
    tanggalPatroli: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'logPatroli',
  });
  return logPatroli;
};