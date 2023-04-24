import winston, { format } from "winston";
const { combine, timestamp, printf } = format;
import WinstonDaily from "winston-daily-rotate-file";
import * as _S3StreamLogger from "s3-streamlogger-daily";
const S3StreamLogger = _S3StreamLogger.S3StreamLogger;
import strftime from "strftime";

const strftimeKOR = strftime.timezone("+0900");
const time_data = () => strftimeKOR("%F", new Date());

import * as _stream from "stream";

/* prodLogger */
const stream = (level = "") =>
  new S3StreamLogger({
    bucket: process.env.S3_BUCKET_LOGS ?? "undefined",
    access_key_id: process.env.S3_ACESSKEYID ?? "undefined",
    secret_access_key: process.env.S3_SECRETACCESSKEY ?? "undefined",
    name_format: `${time_data()}${level !== "" ? "." + level : ""}.log`,
    rotate_every: "day",
  });

const prodLogger = winston.createLogger({
  level: "http",
  format: combine(
    timestamp({
      format: "YYYY-MM-DD HH:mm:ss",
    }),
    printf((info) => {
      return `${info.timestamp},${info.level},${info.message}`;
    })
  ),
  defaultMeta: { service: "user-service" },
  transports: [
    new WinstonDaily({
      level: "http",
      stream: stream(),
    }),
    new WinstonDaily({
      level: "info",
      stream: stream("info"),
    }),
    new WinstonDaily({
      level: "error",
      stream: stream("error"),
    }),
  ],
});

prodLogger.stream = (options?: any) =>
  new _stream.Duplex({
    write: (message: string) => {
      prodLogger.http(message);
    },
  });

export { prodLogger };
