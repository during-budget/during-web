import config from "src/config";
import loaders from "src/loaders";

import express, { Express } from "express";
import { routers } from "routes";

const app: Express = express();

const start = async () => {
  await loaders(app, config);

  routers.forEach((router) => {
    app.use("/api/" + router.label, router.routes);
  });

  app.listen(config.SERVER_PORT, function () {
    console.log("✅ Express server listening on port " + config.SERVER_PORT);
  });
};

start();
