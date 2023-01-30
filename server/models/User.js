const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const _ = require("lodash");

const categorySettingSchema = mongoose.Schema({
  isExpense: Boolean, // true -> expense, false -> income, undefined -> etc
  title: String,
  icon: String,
});

const userSchema = mongoose.Schema(
  {
    // user fields
    userName: {
      type: String,
      unique: true,
    },
    password: {
      type: String,
      select: false, //alwasy exclude password in user document
    },

    /* ____________ categories ____________ */

    // 지출 카테고리
    expenseCategories: {
      type: [categorySettingSchema],
      default: [
        { isExpense: true, title: "교통비", icon: "🚉" },
        { isExpense: true, title: "경조사비", icon: "🎉" },
        { isExpense: true, title: "식비", icon: "🍚" },
        { isExpense: true, title: "건강", icon: "🏃‍♀️" },
        { isExpense: true, title: "교육", icon: "🎓" },
      ],
    },

    // 수입 카테고리
    incomeCategories: {
      type: [categorySettingSchema],
      default: [
        { isExpense: false, title: "월급", icon: "💙" },
        { isExpense: false, title: "보너스", icon: "💜" },
        { isExpense: false, title: "용돈", icon: "💚" },
      ],
    },

    // 기타 카테고리
    etcCategories: {
      type: [categorySettingSchema],
      default: [
        { title: "이체", icon: "🍫" },
        { title: "채무", icon: "🍟" },
      ],
    },
  },
  { timestamps: true }
);

userSchema.pre("save", function (next) {
  var user = this;
  if (user.isModified("password")) {
    //비밀번호가 바뀔때만 암호화
    bcrypt.genSalt(parseInt(process.env["SALT_ROUNDS"]), function (err, salt) {
      if (err) return next(err);
      bcrypt.hash(user.password, salt, function (err, hash) {
        if (err) return next(err);
        user.password = hash;
        next();
      });
    });
  } else {
    next();
  }
});

userSchema.methods.comparePassword = async function (plainPassword) {
  var user = this;
  try {
    const isMatch = await bcrypt.compare(plainPassword, user.password);
    return isMatch;
  } catch (err) {
    return err;
  }
};

userSchema.methods.findCategory = function ({ isExpense, categoryId }) {
  return _.find(
    isExpense
      ? this.expenseCategories
      : isExpense !== undefined
      ? this.incomeCategories
      : this.ectCategories,
    {
      _id: mongoose.Types.ObjectId(categoryId),
    }
  )?.toObject();
};

module.exports = mongoose.model("User", userSchema);
