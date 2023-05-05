/* dotenv, express */
import * as dotenv from "dotenv";
const { resolve } = require("path");

console.log("NODE_ENV: ", process.env.NODE_ENV);
if (process.env.NODE_ENV?.trim() == "development") {
  dotenv.config({ path: __dirname + "/.env.development" });
} else if (process.env.NODE_ENV?.trim() == "production") {
  dotenv.config({ path: resolve(__dirname, "../.env.production") });
} else {
  dotenv.config();
}

import express, { Express, Request, Response, NextFunction } from "express";
import { AddressInfo } from "net";

/* cookie-parser,corse,mongoose */
import cookieParser from "cookie-parser";
import cors from "cors";
import mongoose from "mongoose";

/* routers */
import { routers } from "./routes/index";

/* session */
import session from "express-session";
const FileStore = require("session-file-store")(session);
const RedisStore = require("connect-redis")(session);
import { client } from "./redis";

/* passport */
import passport from "passport";
import { config as passportConfig } from "./passport";

/* logger */
import morgan, { StreamOptions, TokenIndexer } from "morgan";
import { logger } from "./log/logger";

const app: Express = express();

passportConfig();

mongoose
  .connect(process.env.DB_URL)
  .then(() => console.log("MongoDB connection is made."))
  .catch((err) => console.log(err));

app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(cookieParser());
app.use(
  cors({
    origin: [process.env.CLIENT, process.env.CLIENT_ADMIN],
    credentials: true,
  })
);

app.use(
  session({
    resave: false, // req마다 session 새로 저장
    saveUninitialized: false, // uninitialized session을 저장함. false인 것이 리소스 활용 측면에서 유리하지만 rolling을 사용하려면 true가 되어야 한다.
    secret: process.env.SESSION_KEY.trim(),
    cookie: {
      httpOnly: true, // 브라우저에서 쿠키값에 대한 접근을 하지 못하게 막는다.
      secure: false, // HTTPS 통신 외에서는 쿠키를 전달하지 않는다.
    },
    rolling: true,
    store: new RedisStore({
      client,
      ttl: 24 * 60 * 60, //1 day
      // no need to set reapInterval
    }),
    // store: new FileStore({
    //   ttl: 24 * 60 * 60, // 1 day
    //   // ttl: 10, // 10 secs
    //   path: "./sessions",
    //   reapInterval: 12 * 60 * 60, // purge all expired cookies every 12 hours
    // }),
  })
);
app.use(passport.initialize());
app.use(passport.session()); //반드시 app.use(session(...)) 아래에 있어야 함

const combined = (
  tokens: TokenIndexer<Request, Response>,
  req: Request,
  res: Response
) => {
  return [
    `HTTP/${tokens["http-version"](req, res)}`, // HTTP/1.1,
    tokens["remote-addr"](req, res), // ip
    req.user?._id ?? "undefined",
    tokens["method"](req, res), // POST, GET, ...
    tokens["url"](req, res), // '/api/users/current'
    JSON.stringify(req.body), // req.body
    tokens["status"](req, res), // 200, 404, ...
    tokens["response-time"](req, res), // ms
    '"' + tokens["referrer"](req, res) + '"',
    '"' + tokens["user-agent"](req, res) + '"',
  ].join(",");
};

const stream: StreamOptions = {
  write: (message) => {
    logger.http(message);
  },
};
app.use(
  morgan(combined, {
    skip: (req, res) => req.url === "/index.html",
    stream,
  })
);

routers.forEach((router: string) => {
  app.use("/api/" + router, require("./routes/" + router));
});

app.get("/api/test", (req: Request, res: Response, next: NextFunction) => {
  res.status(200).send({ message: "hello world!" });
});

app.set("port", process.env.SERVER_PORT.trim() ?? 3000);

const server = app.listen(app.get("port"), function () {
  const { port } = server.address() as AddressInfo;
  const date = new Date();
  console.log("Date: ", date);
  console.log("Express server listening on port " + port);
});

module.exports = app;
