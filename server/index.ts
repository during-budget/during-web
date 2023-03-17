import express, { Request, Response, NextFunction } from "express";
import { AddressInfo } from "net";
import dotenv from "dotenv";
// import cookieParser from "cookie-parser";
// import cors from "cors";
// import mongoose from "mongoose";
// import routers from "./routes/index";
// import session from "express-session";
// import passport from "passport";
// import passportConfig from "./passport";
// const FileStore = require("session-file-store")(session);
// const RedisStore = require("connect-redis")(session);
// import client from "./redis/index.js";
const app = express();

dotenv.config();
// passportConfig();

// mongoose
//   .connect(process.env["DB_URL"])
//   .then(() => console.log("MongoDB connection is made."))
//   .catch((err) => console.log(err));

// app.use(express.json());
// app.use(express.urlencoded({ extended: true, limit: "50mb" }));
// app.use(cookieParser());
// app.use(
//   cors({
//     origin: [process.env["CLIENT"], "http://localhost:3001"],
//     credentials: true,
//   })
// );

// app.use(
//   session({
//     resave: false, // req마다 session 새로 저장
//     saveUninitialized: false, // uninitialized session을 저장함. false인 것이 리소스 활용 측면에서 유리하지만 rolling을 사용하려면 true가 되어야 한다.
//     secret: process.env["SESSION_KEY"].trim(),
//     cookie: {
//       httpOnly: true, // 브라우저에서 쿠키값에 대한 접근을 하지 못하게 막는다.
//       secure: false, // HTTPS 통신 외에서는 쿠키를 전달하지 않는다.
//     },
//     rolling: true,
//     // store: new RedisStore({
//     //   client,
//     //   ttl: 24 * 60 * 60, //1 day
//     //   // no need to set reapInterval
//     // }),
//     store: new FileStore({
//       ttl: 24 * 60 * 60, // 1 day
//       // ttl: 10, // 10 secs
//       path: "./sessions",
//       reapInterval: 12 * 60 * 60, // purge all expired cookies every 12 hours
//     }),
//   })
// );
// app.use(passport.initialize());
// app.use(passport.session()); //반드시 app.use(session(...)) 아래에 있어야 함

// routers.forEach((router) => {
//   app.use("/api/" + router, require("./routes/" + router));
// });

app.get("/api/test", (req: Request, res: Response, next: NextFunction) => {
  res.status(200).send({ message: "hello world!" });
});

app.set("port", process.env["SERVER_PORT"]?.trim() ?? 3000);

const server = app.listen(app.get("port"), function () {
  const { port } = server.address() as AddressInfo;
  console.log("Express server listening on port " + port);
});

module.exports = app;
