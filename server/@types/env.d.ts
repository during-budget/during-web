declare namespace NodeJS {
  interface Process {
    /** running on server */
    env: ProcessEnv;
  }
  interface ProcessEnv {
    /** node environment */
    SERVER_PORT: string;
    CLIENT: string;
    DB_URL: string;

    SALT_ROUNDS: string;
    SESSION_KEY: string;

    NODEMAILER_USER: string;
    NODEMAILER_PASS: string;

    REDIS_URL: string;

    CRYPTO_KEY: string;
    CRYPTO_SALT: string;
    CRYPTO_ALGORITHM: string;
  }
}
