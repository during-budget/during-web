import { devLogger } from "src/loggers/devLogger";
import { prodLogger } from "src/loggers/prodLogger";

let logger: any = null;

const loader = (config: { NODE_ENV: string }) => {
  if (config.NODE_ENV === "development") {
    logger = devLogger;
    console.log("✅ logger: devLogger");
  } else if (config.NODE_ENV === "production") {
    logger = prodLogger;
    console.log("✅ logger: prodLogger");
  }
};

export { loader, logger };
