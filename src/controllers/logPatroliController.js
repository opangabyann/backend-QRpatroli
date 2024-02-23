const logModel = require("../models").logPatroli;
const model = require("../models");
const { Op } = require("sequelize");
const dayjs = require("dayjs");
const checkQuery = require("../utils/queryString");

async function tambahLog(req, res) {
  try {
    const payload = req.body;
    const { idTitikPatroli, latitude, longitude, jamPatroli, status } = payload;

    await logModel.create({
      idTitikPatroli,
      idUser: req.id,
      latitude,
      longitude,
      jamPatroli,
      status,
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
  const {
    page,
    pageSize,
    offset,
    dari_jam,
    sampai_jam,
    tanggal,
    status,
    nama_petugas,
  } = req.query;
  try {
    const date = tanggal ? new Date(tanggal) : null;

    console.log(tanggal, date);
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
          where: {
            [Op.or]: [
              {
                nama: { [Op.substring]: nama_petugas },
              },
            ], // Filter null values jika role atau keyword kosong
          },
        },
        {
          model: model.titikPatroli,
          require: true,
          as: "titikPatroli",
          attributes: ["id", "nama", "foto", "latitude", "longitude"],
        },
      ],

      where: {
        ...(checkQuery(status) && { status: { [Op.eq]: status } }),

        ...(checkQuery(dari_jam, sampai_jam) && {
          jamPatroli: {
            [Op.between]: [dari_jam, sampai_jam],
          },
        }),
        ...(checkQuery(date) && {
          tanggalPatroli: {
            [Op.eq]: date,
          },
        }),
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

async function detailByIdLog(req, res) {
  try {
    const { id } = req.params;
    const { page, pageSize, offset, dari_jam, sampai_jam, tanggal, status } =
      req.query;
    const date = tanggal ? new Date(tanggal) : null;
    console.log(tanggal, date);

    const log = await logModel.findAndCountAll({
      attributes: {
        exclude: ["updatedAt"],
      },
      limit: pageSize,
      offset: offset,
      where: {
        idUser: id,
        ...(checkQuery(dari_jam, sampai_jam) && {
          jamPatroli: {
            [Op.between]: [dari_jam, sampai_jam],
          },
        }),
        ...(checkQuery(status) && { status: { [Op.eq]: status } }),
        ...(checkQuery(date) && {
          tanggalPatroli: {
            [Op.eq]: date,
          },
        }),
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
      pagination: {
        currentPage: page,
        pageSize: pageSize,
        // totalData: ,
      },
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
    const { idTitikPatroli, latitude, longitude, jamPatroli, status, idUser } =
      payload;
    console.log(idTitikPatroli, latitude, longitude, jamPatroli, status);
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
        idUser,
        latitude,
        longitude,
        jamPatroli,
        status: status,
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
    console.log(error);
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
  detailByIdLog,
};
