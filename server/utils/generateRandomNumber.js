const _ = require("lodash");

const nums = "0123456789";

module.exports = (length) => {
  let string = "";
  for (var i = 0; i < length; i++) {
    const randomNumber = Math.floor(Math.random() * nums.length);
    string += nums[randomNumber];
  }
  return string;
};
