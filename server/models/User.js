const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const _ = require("lodash");

const categorySettingSchema = mongoose.Schema({
  isExpense: { type: Boolean, default: false },
  isIncome: { type: Boolean, default: false },
  isDefault: { type: Boolean, default: false },
  title: String,
  icon: String,
});

const userSchema = mongoose.Schema(
  {
    // user fields
    userName: {
      //deprecated
      type: String,
    },
    email: {
      type: String,
      unique: true,
    },
    password: {
      type: String,
      select: false, //alwasy exclude password in user document
    },
    isGuest: {
      type: Boolean,
      default: false,
    },

    /* ____________ categories ____________ */
    categories: {
      type: [categorySettingSchema],
      default: [
        // 지출 카테고리
        { isExpense: true, title: "식비", icon: "🍚" },
        { isExpense: true, title: "간식", icon: "🍫" },
        { isExpense: true, title: "생활", icon: "💸" },
        { isExpense: true, title: "교통", icon: "🚉" },
        { isExpense: true, title: "교육", icon: "🎓" },
        { isExpense: true, title: "문화/여가", icon: "🎬" },
        { isExpense: true, title: "의료/건강", icon: "💊" },
        { isExpense: true, title: "주거/통신", icon: "🏠" },
        { isExpense: true, title: "의류/미용", icon: "🛍️" },
        { isExpense: true, title: "기부/후원", icon: "🕊️" },
        { isExpense: true, title: "경조사비", icon: "💌" },
        { isExpense: true, title: "선물", icon: "🎁" },
        { isExpense: true, title: "이체", icon: "🍎" },
        { isExpense: true, title: "채무", icon: "🥭" },
        // 수입 카테고리
        { isIncome: true, title: "월급", icon: "💙" },
        { isIncome: true, title: "보너스", icon: "💜" },
        { isIncome: true, title: "용돈", icon: "💚" },
        { isIncome: true, title: "이체", icon: "🍏" },
        { isIncome: true, title: "채무", icon: "🍋" },
        // 기본 카테고리
        { isExpense: true, isDefault: true, title: "기타", icon: "" },
        { isIncome: true, isDefault: true, title: "기타", icon: "" },
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

userSchema.methods.findCategory = function (categoryId) {
  return _.find(this.categories, {
    _id: mongoose.Types.ObjectId(categoryId),
  })?.toObject();
};

userSchema.methods.findDefaultExpenseCategory = function () {
  return _.find(this.categories, {
    isExpense: true,
    isDefault: true,
  })?.toObject();
};

userSchema.methods.findDefaultIncomeCategory = function () {
  return _.find(this.categories, {
    isIncome: true,
    isDefault: true,
  })?.toObject();
};

userSchema.methods.pushCategory = function ({
  isExpense,
  isIncome,
  title,
  icon,
}) {
  this.categories.splice(this.categories.length - 2, 0, {
    isExpense,
    isIncome,
    title,
    icon,
  });
};

module.exports = mongoose.model("User", userSchema);
