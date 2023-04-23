import { devLogger } from "./devLogger";
import { prodLogger } from "./prodLogger";

let logger = devLogger;
if (process.env.NODE_ENV === "production") {
  logger = prodLogger;
}

export { logger };
