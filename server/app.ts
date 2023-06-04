/* setup env */
import "./_setup";
import * as _connect from "./_connect";
import { client } from "./_redisConfig/index";

import express, { Express, Request, Response, NextFunction } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import session from "express-session";

/* passport */
import passport from "passport";
import { config as passportConfig } from "./_passportConfig";

/* routers */
import { routers } from "./routes/index";

/* logger */
import morgan, { StreamOptions, TokenIndexer } from "morgan";
import { logger } from "@logger";

/* session */
import connectRedis from "connect-redis";
const RedisStore = connectRedis(session);

const app: Express = express();

passportConfig();

app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(cookieParser());
app.use(
  cors({
    origin: [
      process.env.CLIENT,
      process.env.CLIENT_ADMIN,
      "52.78.100.19",
      "52.78.48.223",
      "52.78.5.241",
    ],
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
      client: client as unknown as connectRedis.Client,
      ttl: 24 * 60 * 60, //1 day
      // no need to set reapInterval
    }),
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

routers.forEach((router) => {
  app.use("/api/" + router.label, router.routes);
});

app.set("port", process.env.SERVER_PORT.trim() ?? 3000);

export { app };
