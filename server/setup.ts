import * as dotenv from "dotenv";
import { resolve } from "path";

if (process.env.NODE_ENV?.trim() == "development") {
  dotenv.config({ path: __dirname + "/.env.development" });
} else if (process.env.NODE_ENV?.trim() == "production") {
  dotenv.config({ path: resolve(__dirname, "/.env.production") });
} else if (process.env.NODE_ENV?.trim() == "local") {
  dotenv.config({ path: resolve(__dirname, "/.env.local") });
} else if (process.env.NODE_ENV?.trim() == "test") {
  dotenv.config({ path: resolve(__dirname, "/.env.test") });
} else {
  dotenv.config();
}
