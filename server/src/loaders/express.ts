import express, { Express, Request, Response, NextFunction } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

import session from "express-session";
import connectRedis from "connect-redis";
const RedisStore = connectRedis(session);

import passport from "passport";

import morgan, { TokenIndexer } from "morgan";

import { client as redisClient } from "./redis";
import { logger } from "src/api/middleware/loggers";
import routers from "src/api/routes";
import { configType } from "src/config/type";

const setupDefault = (app: Express) => {
  app.use(express.json());
  app.use(express.urlencoded({ extended: true, limit: "50mb" }));
  app.use(cookieParser());
};

const setupCors = (app: Express, allowList: string[]) => {
  app.use(
    cors({
      origin: allowList,
      credentials: true,
    })
  );
};

const setupSession = async (app: Express) => {
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
        client: redisClient as unknown as connectRedis.Client,
        ttl: 24 * 60 * 60, //1 day
        // no need to set reapInterval
      }),
    })
  );
  app.use(passport.initialize());
  app.use(passport.session()); //반드시 app.use(session(...)) 아래에 있어야 함
};

const setupLogger = (app: Express) => {
  if (!logger) return;

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

  app.use(
    morgan(combined, {
      skip: (req, res) => req.url === "/index.html",
      stream: {
        write: (message) => {
          logger.http(message);
        },
      },
    })
  );
};

const setupRoutes = (app: Express) => {
  for (let router of routers) {
    app.use("/api/" + router.label, router.routes);
  }
};

const setupErrorHandler = (app: Express) => {
  app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    logger?.error(err.message);
    return res.status(err.status ?? 500).send({ message: err.message });
  });
};

export default async (app: Express, config: configType) => {
  setupDefault(app);
  setupCors(app, config.allowList);
  setupSession(app);
  setupLogger(app);
  setupRoutes(app);
  setupErrorHandler(app);
};
