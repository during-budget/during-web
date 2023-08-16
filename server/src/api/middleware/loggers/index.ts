import { devLogger } from "src/api/middleware/loggers/devLogger";
import { prodLogger } from "src/api/middleware/loggers/prodLogger";

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
