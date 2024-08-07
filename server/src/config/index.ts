import * as dotenv from "dotenv";
import { resolve } from "path";
import { exit } from "src/utils/process";
import { configType } from "./type";

const isEnvValid = () => process.env.SERVER_PORT;

const setup = () => {
  const mode = process.env.NODE_ENV?.trim();

  switch (mode) {
    case "development": {
      dotenv.config({ path: resolve(__dirname, `../../.env.development`) });
      break;
    }

    case "production": {
      dotenv.config();
      break;
    }

    default:
      exit(`Invalid NODE_ENV: ${process.env.NODE_ENV}`);
  }

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
    ...(process.env.ALLOW_LIST?.split(";") ?? []),
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
  GOOGLE_CREDENTIALS: (() => {
    if (
      !process.env.GOOGLE_CREDENTIALS_CLIENT_EMAIL ||
      !process.env.GOOGLE_CREDENTIALS_PRIVATE_KEY
    ) {
      throw new Error("CONFIG ERROR: Google Credentials missing");
    }

    if (mode === "production") {
      if (!process.env.GOOGLE_CREDENTIALS_PRIVATE_KEY_NEWLINE_SEP) {
        throw new Error(
          "CONFIG ERROR: Google Credentials newline seperator missing"
        );
      }

      return {
        client_email: process.env.GOOGLE_CREDENTIALS_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_CREDENTIALS_PRIVATE_KEY.split(
          process.env.GOOGLE_CREDENTIALS_PRIVATE_KEY_NEWLINE_SEP
        ).join("\n"),
      };
    }

    return {
      client_email: process.env.GOOGLE_CREDENTIALS_CLIENT_EMAIL,
      private_key: process.env.GOOGLE_CREDENTIALS_PRIVATE_KEY,
    };
  })(),
  APPLE_SHARED_SECRET: process.env.APPLE_SHARED_SECRET ?? "",
};

console.log(`✅ config is set; `, config);

export default config;
