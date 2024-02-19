const laporanModel = require("../models").laporan;
const model = require("../models");
const { Op } = require("sequelize");
const { post, del } = require("../controllers/cloudinaryController");
const dayjs = require("dayjs");

async function tambahLaporan(req, res) {
  try {
    const payload = req.body;
    let { idUser, latitude, longitude, judulLaporan, jenisLaporan, deskripsi } =
      payload;
    const { secure_url, public_id } = await post(req?.file.path, "laporan");
    console.log(secure_url);
    gambarLaporan = secure_url;
    thumbnail_id = public_id;
    console.log(req.file);
    const laporan = await laporanModel.create({
      idUser: req.id,
      latitude,
      longitude,
      judulLaporan,
      tanggalLaporan: dayjs().format("YYYY-MM-DD"),
      jenisLaporan,
      gambarLaporan,
      thumbnail_id,
      deskripsi,
    });
    console.log(laporan instanceof laporanModel);
    res.status(201).json({
      status: "Berhasil",
      message: "Laporan berhasil dibuat",
      data: laporan,
    });
  } catch (error) {
    console.log("id user login =>>", req.id);
    console.log(error);
    res.status(500).json({
      status: "Fail",
      message: "Ada kesalahan",
      error: error,
    });
  }
}

async function getListLaporan(req, res) {
  const { keyword, page, pageSize, offset, jenisLaporan, status } = req.query;
  console.log(status);
  try {
    const laporan = await laporanModel.findAndCountAll({
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
      limit: pageSize,
      offset: offset,
      include: [
        {
          model: model.user,
          require: true,
          as: "dataUser",
        },
      ],
      where: {
        [Op.or]: [
          {
            judulLaporan: { [Op.substring]: keyword },
            jenisLaporan: { [Op.substring]: jenisLaporan },
            status: { [Op.substring]: status },
          },
        ],
      },
    });

    res.json({
      status: "Berhasil",
      msg: "Laporan-laporan berhasil ditemukan",
      pagination: {
        currentPage: page,
        pageSize: pageSize,
        totalData: laporan.count,
      },
      data: laporan,
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
async function deletelaporan(req, res) {
  try {
    const { id } = req.params;
    const laporan = await laporanModel.findByPk(id);

    if (laporan === null) {
      return res.status(403).json({
        status: "Gagal",
        msg: "laporan tidak ditemukan",
      });
    }
    if (laporan.thumbnail_id) {
      await del(laporan.thumbnail_id);
    }
    await laporanModel.destroy({
      where: {
        id: id,
      },
    });
    res.json({
      status: "Berhasil",
      msg: "data laporan berhasil dihapus",
      laporan: laporan,
    });
  } catch (error) {
    res.status(403).json({
      status: "Gagal",
      msg: "Ada kesalahan",
      err: error,
    });
  }
}

async function detailLaporan(req, res) {
  try {
    const { id } = req.params;
    const laporan = await laporanModel.findOne({
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
      where: {
        id: id,
      },
      include: [
        {
          model: model.user,
          require: true,
          as: "dataUser",
          attributes: ["id", "nama", "nopek"],
        },
      ],
    });
    res.json({
      status: "Berhasil",
      msg: "detail laporan berhasil ditemukan",
      data: laporan,
    });
  } catch (error) {
    console.log(error);
    res.json({
      status: "Gagal",
      msg: "ada kesalahan",
    });
  }
}
async function updateLaporan(req, res) {
  try {
    const { id } = req.params;
    const payload = req.body;
    let { latitude, longitude, judulLaporan, jenisLaporan, deskripsi, status } =
      payload;

    const laporan = await laporanModel.findByPk(id);

    if (laporan === null) {
      return res.status(404).json({
        status: "fail",
        msg: `laporan tidak ditemukan`,
      });
    }

    let gambarLaporan = laporan.gambarLaporan; // Tetapkan foto yang sudah ada sebagai default

    if (req.file) {
      // Jika ada file yang diunggah, ganti foto dengan yang baru
      const { secure_url, public_id } = await post(req?.file.path, "laporan");
      gambarLaporan = secure_url;
      thumbnail_id = public_id;

      if (laporan.thumbnail_id) {
        // Hapus foto lama jika ada
        await del(laporan.thumbnail_id);
      }
    }
    await laporanModel.update(
      {
        latitude,
        longitude,
        judulLaporan,
        jenisLaporan,
        gambarLaporan,
        deskripsi,
        status,
      },
      {
        where: {
          id: id,
        },
      }
    );

    res.status(201).json({
      status: "Success",
      msg: "laporan telah diupdate",
      data: payload,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: "Failed",
      msg: "Ada kesalahan",
    });
  }
}

module.exports = {
  tambahLaporan,
  getListLaporan,
  deletelaporan,
  detailLaporan,
  updateLaporan,
};
