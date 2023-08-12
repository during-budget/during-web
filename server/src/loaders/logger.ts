import { devLogger } from "log/devLogger";
import { prodLogger } from "log/prodLogger";

let logger: any = null;

const loader = (config: { NODE_ENV: string }) => {
  if (config.NODE_ENV === "devlopment") {
    logger = devLogger;
  } else if (config.NODE_ENV === "production") {
    logger = prodLogger;
  }
};

export { loader, logger };
