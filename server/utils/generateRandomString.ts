import _ from "lodash";

const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
const specialChars = "!@#$%^&*()";

module.exports = (length: number) => {
  let string = "";
  for (var i = 0; i < length; i++) {
    const randomNumber = Math.floor(Math.random() * chars.length);
    string += chars[randomNumber];
  }
  return string;
};
