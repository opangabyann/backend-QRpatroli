const patroliModel = require("../models").titikPatroli;
const { post, del } = require("../controllers/cloudinaryController");

const model = require("../models");
const { Op } = require("sequelize");

async function tambahTitik(req, res) {
  try {
    const payload = req.body;
    let { nama, foto, thumbnail_id, latitude, longitude, deskripsi } = payload;
    const { secure_url, public_id } = await post(
      req?.file.path,
      "titikPatroli"
    );
    console.log(secure_url);
    foto = secure_url;
    thumbnail_id = public_id;
    const patroli = await patroliModel.create({
      nama,
      latitude,
      longitude,
      foto,
      thumbnail_id,
      deskripsi,
    });
    if (!req.file) {
      console.log(req.file);
      console.log(payload);
      return res.status(400).send("No file uploaded.");
    }
    // console.log(laporan instanceof laporanModel);
    res.status(201).json({
      status: "Berhasil",
      message: "Titik patroli berhasil dibuat",
      data: patroli,
    });
  } catch (error) {
    // console.log("id user login =>>", req.id);
    console.log(error);
    res.status(500).json({
      status: "Fail",
      message: "Ada kesalahan",
      error: error,
    });
  }
}

async function getListTitikPatroli(req, res) {
  const { keyword, page, pageSize, offset } = req.query;
  try {
    const patroli = await patroliModel.findAndCountAll({
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
      where: {
        [Op.or]: [
          {
            nama: {
              [Op.substring]: keyword,
            },
          },
        ],
      },

      limit: pageSize,
      offset: offset,
    });

    if (patroli == null) {
      res.status(403).json({
        status: "Gagal",
        msg: "lokasi patroli tidak ditemukan",
      });
    }

    res.json({
      status: "Berhasil",
      msg: "titik-titik patroli berhasil ditemukan",
      pagination: {
        currentPage: page,
        pageSize: pageSize,
        totalData: patroli.count,
      },
      data: patroli,
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
async function deletepatroli(req, res) {
  try {
    const { id } = req.params;
    const patroli = await patroliModel.findByPk(id);

    if (patroli === null) {
      return res.status(403).json({
        status: "Gagal",
        msg: "titik patroli tidak ditemukan",
      });
    }

    if (patroli.thumbnail_id) {
      await del(patroli.thumbnail_id);
    }

    await patroliModel.destroy({
      where: {
        id: id,
      },
    });

    return res.json({
      status: "Berhasil",
      msg: "titik patroli berhasil dihapus",
    });
  } catch (error) {
    return res.status(403).json({
      status: "Gagal",
      msg: "Ada kesalahan",
      err: error,
    });
  }
}

async function detailTitik(req, res) {
  try {
    const { id } = req.params;
    const patroli = await patroliModel.findOne({
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
      where: {
        id: id,
      },
    });
    if (patroli == null) {
      res.status(403).json({
        status: "Gagal",
        msg: "lokasi patroli tidak ditemukan",
      });
    } else
      res.json({
        status: "Berhasil",
        msg: "detail patroli berhasil ditemukan",
        data: patroli,
      });
  } catch (error) {
    console.log(error);
    res.json({
      status: "Gagal",
      msg: "ada kesalahan",
    });
  }
}
async function updatepatroli(req, res) {
  try {
    const { id } = req.params;
    const payload = req.body;
    let { nama, latitude, longitude, deskripsi } = payload;

    const patroli = await patroliModel.findByPk(id);

    if (patroli === null) {
      return res.status(404).json({
        status: "Gagal",
        msg: `titik patroli tidak ditemukan`,
      });
    }

    let foto = patroli.foto; // Tetapkan foto yang sudah ada sebagai default

    if (req.file) {
      // Jika ada file yang diunggah, ganti foto dengan yang baru
      const { secure_url, public_id } = await post(
        req?.file.path,
        "titikPatroli"
      );
      foto = secure_url;
      thumbnail_id = public_id;

      if (patroli.thumbnail_id) {
        // Hapus foto lama jika ada
        await del(patroli.thumbnail_id);
      }
    }
    await patroliModel.update(
      {
        nama,
        latitude,
        longitude,
        foto,
        deskripsi,
      },
      {
        where: {
          id: id,
        },
      }
    );

    res.status(201).json({
      status: "Berhasil",
      msg: "titik patroli telah diupdate",
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
  tambahTitik,
  getListTitikPatroli,
  deletepatroli,
  detailTitik,
  updatepatroli,
};
