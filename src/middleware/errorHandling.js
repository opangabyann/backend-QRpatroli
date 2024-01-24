const errorHandler = (err, req, res, next) => {
  console.log(err),
    res.status(500).json({
      status: "error",
      message: "terjadi kesalahan pada server",
    });
};

module.exports = errorHandler;
