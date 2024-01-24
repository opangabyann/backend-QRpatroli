'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class laporan extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      laporan.belongsTo(models.user, {
        as : "dataUser",
        foreignKey : "idUser"
      })
    }
  }
  laporan.init({
    idUser : DataTypes.INTEGER,
    latitude: DataTypes.STRING,
    longitude: DataTypes.STRING,
    judulLaporan: DataTypes.STRING,
    tanggalLaporan: DataTypes.DATE,
    jenisLaporan: DataTypes.STRING,
    gambarLaporan: DataTypes.STRING,
    thumbnail_id: DataTypes.STRING,
    deskripsi: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'laporan',
  });
  return laporan;
};