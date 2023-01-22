require("dotenv").config();

const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const routers = require("./routes/index");
const app = express();

mongoose
  .connect(process.env["DB_URL"])
  .then(() => console.log("MongoDB connection is made."))
  .catch((err) => console.log(err));

app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(cookieParser());
app.use(
  //   cors({
  //     origin: process.env["CLIENT"].trim(),
  //     credentials: true,
  //   })
  cors() //테스트를 위해 모든 도메인에서 오는 요청 허용(임시)
);

routers.forEach((router) => {
  app.use("/api/" + router, require("./routes/" + router));
});

app.set("port", process.env["SERVER_PORT"].trim() || 3000);

const server = app.listen(app.get("port"), function () {
  console.log("Express server listening on port " + server.address().port);
});

module.exports = app;
