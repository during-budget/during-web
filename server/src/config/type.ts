import { JWTInput } from "google-auth-library";

type configType = {
  NODE_ENV: string;
  allowList: string[];

  SERVER_PORT: string;

  DB_URL: string;
  REDIS_URL: string;

  OAUTH_CLIENT: {
    GOOGLE: {
      ID: string;
      SECRET: string;
      callbackURL: string;
    };
    GOOGLE_ADMIN: {
      ID: string;
      SECRET: string;
      callbackURL: string;
    };
    NAVER: {
      ID: string;
      SECRET: string;
      callbackURL: string;
    };
    KAKAO: {
      ID: string;
      callbackURL: string;
    };
  };

  GOOGLE_CREDENTIALS: Pick<JWTInput, "client_email" | "private_key">;

  APPLE_SHARED_SECRET: string;
  //   SERVER_URL: string;

  //   CLIENT: string;
  //   CLIENT_ADMIN: string;

  //   GOOGLE_CLIENT_ID: string;
  //   GOOGLE_CLIENT_SECRET: string;
  //   NAVER_CLIENT_ID: string;
  //   NAVER_CLIENT_SECRET: string;
  //   KAKAO_CLIENT_ID: string;

  //   SALT_ROUNDS: string;
  //   SESSION_KEY: string;

  //   NODEMAILER_USER: string;
  //   NODEMAILER_PASS: string;

  //   CRYPTO_KEY: string;
  //   CRYPTO_SALT: string;
  //   CRYPTO_ALGORITHM: string;

  //   S3_ACESSKEYID: string;
  //   S3_SECRETACCESSKEY: string;
  //   S3_BUCKET_LOGS: string;

  //   PORTONE_IMP_KEY: string;
  //   PORTONE_IMP_SECRET: string;
};

export type { configType };
