const UserModel = require("../models").user;
const model = require("../models");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const { where } = require("sequelize");

async function login(req, res) {
  try {
    const payload = req.body;
    const { nopek, password } = payload;

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
      where: {
        nopek: nopek,
      },
    });

    if (user === null) {
      return res.status(422).json({
        status: "Gagal",
        msg: "user tidak ditemukan",
      });
    }

    if (password === null) {
      return res.status(422).json({
        status: "Fail",
        msg: "nopek dan password tidak cocok",
      });
    }

    const verify = await bcrypt.compareSync(password, user.password);

    if (verify === false) {
      return res.status(422).json({
        status: "Gagal",
        msg: "username dan password tidak cocok",
      });
    }
    const token = jwt.sign(
      {
        id: user?.id,
        nama: user?.nama,
        role: user?.role,
      },
      process.env.jwt_SECRET,
      {
        expiresIn: "1d",
      }
    );
    res.json({
      status: "Berhasil",
      msg: "Login berhasil",
      token: token,
      user: user,
    });
  } catch (error) {
    console.log(error);
    // console.log(user)
    res.status(403).json({
      status: "Gagal",
      msg: "Ada kesalahan",
      err: error,
    });
  }
}


async function tambahUser(req, res) {
  try {
    const payload = req.body;
    const { nama, nopek, password, role, noTelp } = payload;
    const existingUser = await UserModel.findOne({
      where: {
        nopek: nopek,
      },
    });
    console.log("existing user ====>", existingUser);
    // if(req.role !== "superAdmin"){
    //   res.status(400).json({
    //     status: "Gagal",
    //     msg: "Hanya super admin yang dapat menambah user",
    //   });
    // }
    // Jika user dengan nomor pegawai tersebut sudah ada
    if (existingUser) {
      return res.status(400).json({
        status: "Gagal",
        msg: "User dengan nomor pegawai tersebut sudah terdaftar.",
      });
    }
    let hashPassword = await bcrypt.hashSync(password, 10);

    await UserModel.create({
      nama,
      nopek,
      password: hashPassword,
      role,
      noTelp,
      createdBy: req.id,
    });
    res.json({
      status: "Berhasil",
      msg: "User berhasil ditambahkan",
    });
  } catch (error) {
    console.log(error);
    res.status(403).json({
      status: "fail",
      msg: "Ada kesalahan",
      err: error,
    });
  }
}
module.exports = { login, tambahUser };
