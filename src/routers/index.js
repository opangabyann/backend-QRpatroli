const express = require("express");
const path = require("path");
const fs = require("fs");
const authMiddleware = require("../middleware/auth");

const routers = express.Router();
const { tambahUser, login } = require("../controllers/authController");
const {
  getListUser,
  deleteUser,
  detailUser,
  updateUser,
  updatePassword,
} = require("../controllers/userController");
const {
  getListTitikPatroli,
  tambahTitik,
  deletepatroli,
  updatepatroli,
  detailTitik,
} = require("../controllers/titikPatroli");
const {
  tambahLog,
  getListLog,
  deletelog,
  updatelog,
  detaillog,
} = require("../controllers/logPatroliController");
const {
  tambahLaporan,
  getListLaporan,
  updateLaporan,
  deletelaporan,
  detailLaporan,
} = require("../controllers/laporanController");
const jwtValidateMiddleware = require("../middleware/jwtValidatemiddleware");
const uploadSingle = require("../storage/fileuploadsingle");

routers.post("/login", login);
routers.get("/tes", (req, res) => {
  res.send("hello world");
});
routers.use(jwtValidateMiddleware);
routers.post("/tambah-user", tambahUser);

routers.get("/user/list", getListUser); // get list user
routers.delete("/user/delete/:id", deleteUser);
routers.get("/user/detail/:id", detailUser);
routers.put("/user/update/:id", updateUser);
routers.put("/user/update-password/:id", updatePassword);

routers.post("/titik-patroli/tambah", uploadSingle, tambahTitik);
routers.get("/titik-patroli/list", getListTitikPatroli);
routers.get("/titik-patroli/detail/:id", detailTitik);
routers.delete("/titik-patroli/delete/:id", deletepatroli);
routers.put("/titik-patroli/update/:id", uploadSingle, updatepatroli);

routers.post("/log-patroli/tambah", tambahLog);
routers.get("/log-patroli/list", getListLog);
routers.get("/log-patroli/detail/:id", detaillog);
routers.delete("/log-patroli/delete/:id", deletelog);
routers.put("/log-patroli/update/:id", updatelog);

routers.post("/laporan/tambah", uploadSingle, tambahLaporan);
routers.get("/laporan/list", getListLaporan);
routers.get("/laporan/detail/:id", detailLaporan);
routers.delete("/laporan/delete/:id", deletelaporan);
routers.put("/laporan/update/:id", uploadSingle, updateLaporan);
module.exports = routers;
