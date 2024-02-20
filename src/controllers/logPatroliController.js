const logModel = require("../models").logPatroli;
const model = require("../models");
const { Op } = require("sequelize");
const dayjs = require("dayjs");

async function tambahLog(req, res) {
  try {
    const payload = req.body;
    const { idTitikPatroli, latitude, longitude, jamPatroli } = payload;

    await logModel.create({
      idTitikPatroli,
      idUser: req.id,
      latitude,
      longitude,
      jamPatroli,
      tanggalPatroli: dayjs().format("YYYY-MM-DD"),
    });
    res.json({
      status: "Berhasil",
      msg: "log patroli berhasil ditambahkan",
      data: payload,
    });
  } catch (error) {
    console.log(error);
    res.status(403).json({
      status: "Gagal",
      msg: "Ada kesalahan",
      err: error,
    });
  }
}
async function getListLog(req, res) {
  const { keyword, page, pageSize, offset, dari_jam,sampai_jam } = req.query;
  try {
    const log = await logModel.findAndCountAll({
      attributes: {
        exclude: ["updatedAt"],
      },

      include: [
        {
          model: model.user,
          require: true,
          as: "logUser",
          attributes: ["id", "nama", "nopek"],
        },
        {
          model: model.titikPatroli,
          require: true,
          as: "titikPatroli",
          attributes: ["id", "nama", "foto", "latitude", "longitude"],
        },
      ],

      where : {
        jamPatroli : {
          [Op.between] : [dari_jam,sampai_jam]
        },
      },
      limit: pageSize,
      offset: offset,
    });

    res.json({
      status: "Berhasil",
      msg: "Log-log patroli berhasil ditemukan",
      pagination: {
        currentPage: page,
        pageSize: pageSize,
        totalData: log.count,
      },
      data: log,
    });
  } catch (error) {
    console.log(error);
    res.status(403).json({
      status: "Gagal",
      msg: "Ada kesalahan",
      err: error,
    });
  }
}
async function deletelog(req, res) {
  try {
    const { id } = req.params;
    const log = await logModel.findByPk(id);

    if (log === null) {
      return res.status(403).json({
        status: "Gagal",
        msg: "titik log tidak ditemukan",
      });
    }

    await logModel.destroy({
      where: {
        id: id,
      },
    });
    res.json({
      status: "Berhasil",
      msg: "titik log berhasil dihapus",
      log: log,
    });
  } catch (error) {
    res.status(403).json({
      status: "Gagal",
      msg: "Ada kesalahan",
      err: error,
    });
  }
}

async function detaillog(req, res) {
  try {
    const { id } = req.params;
    const log = await logModel.findOne({
      attributes: {
        exclude: ["updatedAt"],
      },
      where: {
        id: id,
      },
      include: [
        {
          model: model.user,
          require: true,
          as: "logUser",
          attributes: ["id", "nama", "nopek"],
        },
        {
          model: model.titikPatroli,
          require: true,
          as: "titikPatroli",
          attributes: ["id", "nama", "latitude", "longitude"],
        },
      ],
    });
    res.json({
      status: "Berhasil",
      msg: "detail log berhasil ditemukan",
      data: log,
    });
  } catch (error) {
    console.log(error);
    res.json({
      status: "Gagal",
      msg: "ada kesalahan",
    });
  }
}
async function updatelog(req, res) {
  try {
    const { id } = req.params;
    const payload = req.body;
    const { idTitikPatroli, latitude, longitude, jamPatroli } = payload;
    const log = await logModel.findByPk(id);

    if (log === null) {
      return res.json({
        status: "Gagal",
        msg: "log patroli tidak ditemukan",
      });
    }

    await logModel.update(
      {
        idTitikPatroli,
        idUser: req.id,
        latitude,
        longitude,
        jamPatroli,
      },
      {
        where: {
          id: id,
        },
      }
    );
    res.json({
      status: "Berhasil",
      msg: "log patroli berhasil diupdate",
    });
  } catch (error) {
    res.json({
      status: "Gagal",
      msg: "ada kesalahan",
    });
  }
}
module.exports = {
  tambahLog,
  getListLog,
  deletelog,
  detaillog,
  updatelog,
};
