import _ from "lodash";

const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
const specialChars = "!@#$%^&*()";
const nums = "0123456789";

export const generateRandomString = (length: number) => {
  let string = "";
  for (var i = 0; i < length; i++) {
    const randomNumber = Math.floor(Math.random() * chars.length);
    string += chars[randomNumber];
  }
  return string;
};

export const generateRandomNumber = (length: number) => {
  let string = "";
  for (var i = 0; i < length; i++) {
    const randomNumber = Math.floor(Math.random() * nums.length);
    string += nums[randomNumber];
  }
  return string;
};
