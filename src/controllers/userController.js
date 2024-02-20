const UserModel = require("../models").user;
const model = require("../models");
const { Op } = require("sequelize");
const bcrypt = require("bcrypt");

async function getListUser(req, res) {
  const { keyword, page, pageSize, offset } = req.query;
  try {
    const user = await UserModel.findAndCountAll({
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
      include: [
        {
          model: model.logPatroli,
          require: true,
          as: "logUser",
          include: [
            {
              model: model.titikPatroli,
              require: true,
              as: "titikPatroli",
            },
          ],
        },
        
      ],
      where: {
        role: ["security", "admin"],
        [Op.or]: [
          {
            nama: { [Op.substring]: keyword },
          },
        ], // Filter null values jika role atau keyword kosong
      },

      limit: pageSize,
      offset: offset,
    });
    console.log(user);
    return res.json({
      status: "Berhasil",
      msg: "user berhasil ditemukan",
      pagination: {
        currentPage: page,
        pageSize: pageSize,
        totalData: user.count,
      },
      data: user,
      
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

async function getListUserSecurity(req, res) {
  const { keyword, page, pageSize, offset } = req.query;
  try {
    const user = await UserModel.findAndCountAll({
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
      include: [
        {
          model: model.logPatroli,
          require: true,
          as: "logUser",
          include: [
            {
              model: model.titikPatroli,
              require: true,
              as: "titikPatroli",
            },
          ],
        },
      ],
      where: {
        role: "security",
        [Op.or]: [
          {
            nama: { [Op.substring]: keyword },
          },
        ], // Filter null values jika role atau keyword kosong
      },

      limit: pageSize,
      offset: offset,
    });

    console.log(user);
    res.json({
      status: "Berhasil",
      msg: "user berhasil ditemukan",
      pagination: {
        currentPage: page,
        pageSize: pageSize,
        totalData: user.count,
      },
      data: user,
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
async function deleteUser(req, res) {
  try {
    const { id } = req.params;
    const user = await UserModel.findByPk(id);

    if (user === null) {
      res.status(403).json({
        status: "Gagal",
        msg: "user tidak ditemukan",
      });
    }

    await UserModel.destroy({
      where: {
        id: id,
      },
    });
    res.json({
      status: "Berhasil",
      msg: "user berhasil dihapus",
      user: user,
    });
  } catch (error) {
    res.status(403).json({
      status: "Gagal",
      msg: "Ada kesalahan",
      err: error,
    });
  }
}

async function detailUser(req, res) {
  try {
    const { id } = req.params;
    console.log("id user login", req.id);
    const user = await UserModel.findOne({
      attributes: [
        "id",
        "nama",
        "nopek",
        "password",
        "role",
        "noTelp",
        "createdAt",
        "updatedAt",
      ],
      include: [
        {
          model: model.logPatroli,
          require: true,
          as: "logUser",
          include: [
            {
              model: model.titikPatroli,
              require: true,
              as: "titikPatroli",
            },
          ],
        },
      ],
      where: {
        id: id,
      },
    });
    if (user == null) {
      return res.status(403).json({
        status: "Gagal",
        msg: "Petugas tidak ditemukan",
      });
    }
    res.json({
      status: "Berhasil",
      msg: "detail user berhasil ditemukan",
      data: user,
    });
  } catch (error) {
    console.log(error);
    res.json({
      status: "Gagal",
      msg: "ada kesalahan",
    });
  }
}
async function updateUser(req, res) {
  try {
    const { id } = req.params;
    const payload = req.body;
    const { nama, nopek, role, noTelp } = payload;
    const user = await UserModel.findByPk(id);

    if (user === null) {
      res.json({
        status: "Gagal",
        msg: "user tidak ditemukan",
      });
    }
    await UserModel.update(
      {
        nama,
        nopek,
        role,
        noTelp,
        updatedBy : req.id
      },
      {
        where: {
          id: id,
        },
      }
    );
    return res.json({
      status: "Berhasil",
      msg: "user berhasil diupdate",
    });
  } catch (error) {
    console.log(error);
    res.json({
      status: "Gagal",
      msg: "ada kesalahan",
    });
  }
}

async function updatePassword() {
  try {
    const { id } = req.params;
    const payload = req.body;
    const { password } = payload;
    const user = await UserModel.findByPk(id);

    if (user == null) {
      return res.json({
        status: "Gagal",
        msg: "user tidak ditemukan",
      });
    } else {
      let hashPassword = await bcrypt.hashSync(password, 10);

      await UserModel.update({ hashPassword }, { where: { id: id } });
      return res.json({
        status: "Berhasil",
        msg: "Password berhasil dirubah",
      });
    }
  } catch (error) {
    return res.json({
      status: "Gagal",
      msg: "Terjadi kesalahan",
    });
  }
}
module.exports = {
  getListUser,
  deleteUser,
  detailUser,
  updateUser,
  updatePassword,
  getListUserSecurity,
};
