import * as dotenv from "dotenv";
import { resolve } from "path";
import { exit } from "src/utils/process";
import { Stage, configType } from "./type";

function setEnv(): Stage {
  const mode = process.env.NODE_ENV?.trim();

  switch (mode) {
    case "local": {
      dotenv.config({ path: resolve(__dirname, `../../.env.local`) });
      break;
    }

    case "develop": {
      dotenv.config({ path: resolve(__dirname, `../../.env.develop`) });
      break;
    }

    case "development": {
      dotenv.config({ path: resolve(__dirname, `../../.env.development`) });
      return mode as Stage;
    }

    case "production": {
      dotenv.config();
      break;
    }

    default:
      exit(`Invalid NODE_ENV: ${process.env.NODE_ENV}`);
  }

  dotenv.config({ path: resolve(__dirname, `../../.env.shared`) });

  return mode as Stage;
}

function getConfig(stage: Stage): configType {
  return {
    stage,
    allowList: [
      process.env.CLIENT.trim(),
      ...process.env.PORTONE_IMP_IP_LIST.split(
        process.env.PORTONE_IMP_IP_SEP
      ).map((ip) => ip.trim()),
    ],
    SERVER_PORT: process.env.SERVER_PORT.trim(),
    DB_URL: process.env.DB_URL.trim(),
    REDIS_URL: process.env.REDIS_URL.trim(),
    CRYPTO: {
      KEY: process.env.CRYPTO_KEY.trim(),
      SALT: process.env.CRYPTO_SALT.trim(),
      ALGORITHM: process.env.CRYPTO_ALGORITHM.trim(),
    },
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
    GOOGLE_CREDENTIALS: {
      client_email: process.env.GOOGLE_CREDENTIALS_CLIENT_EMAIL,
      private_key: process.env.GOOGLE_CREDENTIALS_PRIVATE_KEY.split(
        process.env.GOOGLE_CREDENTIALS_PRIVATE_KEY_NEWLINE_SEP
      ).join("\n"),
    },
    APPLE_SHARED_SECRET: process.env.APPLE_SHARED_SECRET ?? "",
  };
}

const stage = setEnv();
console.log(`✅ ENV is set; Stage is ${stage}`);

const config = getConfig(stage);
console.log("✅ Config is set: ", config);

export default config;
