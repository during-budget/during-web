import { Schema, model, Model, Types, HydratedDocument } from "mongoose";

import bcrypt from "bcrypt";
import _ from "lodash";

interface ICategory {
  isExpense?: boolean;
  isIncome?: boolean;
  isDefault?: boolean;
  title: string;
  icon: string;
}

const categorySchema = new Schema<ICategory>({
  isExpense: { type: Boolean, default: false },
  isIncome: { type: Boolean, default: false },
  isDefault: { type: Boolean, default: false },
  title: String,
  icon: String,
});

interface IUser {
  _id: Types.ObjectId;
  userName: string;
  email: string;
  password: string;
  isGuest: boolean;
  categories: ICategory[];
}

interface IUserProps {
  /* subdocument array */
  categories: Types.DocumentArray<ICategory>;
  /* methods */
  comparePassword: (password: string) => Promise<boolean | Error>;
  findCategory: (categoryId: string) => HydratedDocument<ICategory> | undefined;
  findCategoryIdx: (categoryId: string) => number;
  findDefaultExpenseCategory: () => HydratedDocument<ICategory>;
  findDefaultIncomeCategory: () => HydratedDocument<ICategory>;
  pushCategory: (category: any) => void;
}

interface IUserModel extends Model<IUser, {}, IUserProps> {}

const userSchema = new Schema<IUser, IUserModel, IUserProps>(
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
      type: [categorySchema],
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
    bcrypt.genSalt(parseInt(process.env.SALT_ROUNDS!), function (err, salt) {
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

userSchema.methods.comparePassword = async function (plainPassword: string) {
  var user = this;
  try {
    const isMatch = await bcrypt.compare(plainPassword, user.password);
    return isMatch;
  } catch (err: any) {
    return err;
  }
};

userSchema.methods.findCategory = function (categoryId: string) {
  return _.find(this.categories, {
    _id: new Types.ObjectId(categoryId),
  })?.toObject();
};

userSchema.methods.findCategoryIdx = function (categoryId: string) {
  return _.findIndex(this.categories, {
    _id: new Types.ObjectId(categoryId),
  });
};

userSchema.methods.findDefaultExpenseCategory = function () {
  return this.categories[this.categories.length - 2].toObject();
};

userSchema.methods.findDefaultIncomeCategory = function () {
  return this.categories[this.categories.length - 1].toObject();
};

userSchema.methods.pushCategory = function (category: any) {
  this.categories.splice(this.categories.length - 2, 0, category);
};

const User = model<IUser, IUserModel>("User", userSchema);
export { User, IUser, IUserModel, ICategory };
