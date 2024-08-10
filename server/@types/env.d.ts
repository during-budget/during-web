declare namespace NodeJS {
  interface Process {
    /** running on server */
    env: ProcessEnv;
  }
  interface ProcessEnv {
    /** node environment */
    SERVER_URL: string;
    SERVER_PORT: string;
    CLIENT: string;
    DB_URL: string;

    REDIS_URL: string;
    SESSION_KEY: string;

    CRYPTO_KEY: string;
    CRYPTO_SALT: string;
    CRYPTO_ALGORITHM: string;

    GOOGLE_CLIENT_ID: string;
    GOOGLE_CLIENT_SECRET: string;
    NAVER_CLIENT_ID: string;
    NAVER_CLIENT_SECRET: string;
    KAKAO_CLIENT_ID: string;

    NODEMAILER_USER: string;
    NODEMAILER_PASS: string;

    PORTONE_IMP_KEY: string;
    PORTONE_IMP_SECRET: string;
    PORTONE_IMP_IP_LIST: string;
    PORTONE_IMP_IP_SEP: string;

    GOOGLE_CREDENTIALS_CLIENT_EMAIL: string;
    GOOGLE_CREDENTIALS_PRIVATE_KEY_NEWLINE_SEP: string;
    GOOGLE_CREDENTIALS_PRIVATE_KEY: string;

    APPLE_SHARED_SECRET: string;
  }
}
