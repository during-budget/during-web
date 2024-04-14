declare namespace NodeJS {
  interface Process {
    /** running on server */
    env: ProcessEnv;
  }
  interface ProcessEnv {
    /** node environment */
    SERVER_URL?: string;
    SERVER_PORT: string;
    CLIENT: string;
    CLIENT_ADMIN: string;
    DB_URL: string;

    GOOGLE_CLIENT_ID: string;
    GOOGLE_CLIENT_SECRET: string;
    NAVER_CLIENT_ID: string;
    NAVER_CLIENT_SECRET: string;
    KAKAO_CLIENT_ID: string;

    SALT_ROUNDS: string;
    SESSION_KEY: string;

    NODEMAILER_USER: string;
    NODEMAILER_PASS: string;

    REDIS_URL: string;

    CRYPTO_KEY: string;
    CRYPTO_SALT: string;
    CRYPTO_ALGORITHM: string;

    S3_ACESSKEYID: string;
    S3_SECRETACCESSKEY: string;
    S3_BUCKET_LOGS: string;

    PORTONE_IMP_KEY: string;
    PORTONE_IMP_SECRET: string;

    GOOGLE_CREDENTIALS_CLIENT_EMAIL: string;
    GOOGLE_CREDENTIALS_PRIVATE_KEY: string;
  }
}
