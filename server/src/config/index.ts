import * as dotenv from "dotenv";
import { resolve } from "path";
import { exit } from "src/utils/process";
import { configType } from "./type";

const isModeValid = (mode: string | undefined) => {
  if (mode === "development") return true;
  if (mode === "production") return true;
  return false;
};

const getPath = (mode?: string) => {
  if (mode === "development") {
    return resolve(__dirname, `../../.env.development`);
  } else if (mode === "production") {
    return resolve(__dirname, `../../../.env.production`);
  }
  return "";
};

const isEnvValid = () => process.env.SERVER_PORT;

const setup = () => {
  const mode = process.env.NODE_ENV?.trim();
  if (!isModeValid(mode)) {
    exit(`Invalid NODE_ENV: ${process.env.NODE_ENV}`);
  }

  dotenv.config({ path: getPath(mode) });
  if (!isEnvValid()) {
    exit(`env file or env.SERVER_PORT is missing`);
  }

  return mode;
};

const mode = setup();
console.log(`✅ ENV is set; NODE_ENV=${mode}`);

const config: configType = {
  NODE_ENV: process.env.NODE_ENV?.trim() ?? "",
  allowList: [
    process.env.CLIENT.trim(),
    process.env.CLIENT_ADMIN.trim(),
    "52.78.100.19",
    "52.78.48.223",
    "52.78.5.241",
  ],
  SERVER_PORT: process.env.SERVER_PORT.trim(),
  DB_URL: process.env.DB_URL.trim(),
  REDIS_URL: process.env.REDIS_URL.trim(),
  OAUTH_CLIENT: {
    GOOGLE: {
      ID: process.env.GOOGLE_CLIENT_ID.trim(),
      SECRET: process.env.GOOGLE_CLIENT_SECRET.trim(),
      callbackURL:
        (process.env.SERVER_URL?.trim() ?? "") + "/api/auth/google/callback",
    },
    GOOGLE_ADMIN: {
      ID: process.env.GOOGLE_CLIENT_ID.trim(),
      SECRET: process.env.GOOGLE_CLIENT_SECRET.trim(),
      callbackURL:
        (process.env.SERVER_URL?.trim() ?? "") +
        "/api/auth/google/admin/callback",
    },
    NAVER: {
      ID: process.env.NAVER_CLIENT_ID.trim(),
      SECRET: process.env.NAVER_CLIENT_SECRET.trim(),
      callbackURL: "/api/auth/naver/callback",
    },
    KAKAO: {
      ID: process.env.KAKAO_CLIENT_ID.trim(),
      callbackURL: "/api/auth/kakao/callback",
    },
  },
};

export default config;