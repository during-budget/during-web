import express, { Express } from "express";
import config from "src/config";
import loaders from "src/loaders";
import { tasks } from "./tasks";

const app: Express = express();

const start = async () => {
  await loaders(app, config);

  app.listen(config.SERVER_PORT, function () {
    console.log("✅ Express server listening on port " + config.SERVER_PORT);

    tasks.forEach((task) => task.run());
  });
};

start();
