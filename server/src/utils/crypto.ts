// 양방향 암호화 & 복호화
import crypto from "crypto";
import config from "src/config";

const key = crypto.scryptSync(config.CRYPTO.KEY, config.CRYPTO.SALT, 32);
const algorithm = config.CRYPTO.ALGORITHM;
const iv = crypto.randomBytes(16);

// 암호화 메서드
export const cipher = (text: string) => {
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  let result = cipher.update(text, "utf8", "base64");
  result += cipher.final("base64");
  return result;
};

// 복호화 메서드
export const decipher = (text: string) => {
  const deciper = crypto.createDecipheriv(algorithm, key, iv);
  let result = deciper.update(text, "base64", "utf8");
  result += deciper.final("utf8");
  return result;
};

export function randomKey(length: number) {
  return crypto.randomBytes(length).toString("hex");
}
