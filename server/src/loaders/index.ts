import { Express } from "express";
import passportLoader from "./passport";
import expressLoader from "./express";
import mongooseLoader from "./mongoose";
import { loader as redisLoader } from "./redis";
import { loader as loggerLoader } from "./logger";
import { configType } from "src/config/type";

export default async (app: Express, config: configType) => {
  passportLoader(config);
  await mongooseLoader(config);
  await redisLoader(config);
  loggerLoader(config);

  await expressLoader(app, config);
};
