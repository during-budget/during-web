import { Express } from "express";
import passportLoader from "./passport";
import expressLoader from "./express";
import mongooseLoader from "./mongoose";
import { loader as redisLoader } from "./redis";
import loggerLoader from "./logger";
import { configType } from "src/config/type";
import morgan from "morgan";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);
dayjs.extend(timezone);

export default async (app: Express, config: configType) => {
  passportLoader(config);
  await mongooseLoader(config);
  await redisLoader(config);
  // loggerLoader(config);

  // NOTE: TEMP LOGGER
  morgan.token("body", (req) => JSON.stringify((req as any).body));
  morgan.token("time", () =>
    dayjs().tz("Asia/Seoul").format("YYYY-MM-DD HH:mm:ss")
  );
  const customFormat =
    ":time :method :url :status :res[content-length] - :response-time ms :body";
  app.use(morgan(customFormat));

  await expressLoader(app, config);
};
