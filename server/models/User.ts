import { Schema, model, Model, Types, HydratedDocument } from "mongoose";

import bcrypt from "bcrypt";
import _ from "lodash";

interface IAsset {
  _id: Types.ObjectId;
  icon: string;
  title: string;
  amount: number;
  detail: string;
}
const assetSchema = new Schema<IAsset>({
  icon: { type: String, default: "" },
  title: String,
  amount: { type: Number, default: 0 },
  detail: { type: String, default: "" },
});

interface ICard {
  _id: Types.ObjectId;
  icon: string;
  title: string;
  linkedAssetId?: Types.ObjectId;
  linkedAssetIcon?: string;
  linkedAssetTitle?: string;
  detail: string;
}
const cardSchema = new Schema<ICard>({
  icon: { type: String, default: "" },
  title: String,
  linkedAssetId: Schema.Types.ObjectId,
  linkedAssetIcon: String,
  linkedAssetTitle: String,
  detail: { type: String, default: "" },
});

interface IPaymentMethod {
  _id: Types.ObjectId;
  type: "asset" | "card";
  icon: string;
  title: string;
  detail: string;
  isChecked: boolean;
}

const paymentMethodSchema = new Schema<IPaymentMethod>({
  type: String,
  icon: String,
  title: String,
  detail: { type: String, default: "" },
  isChecked: { type: Boolean, default: true },
});

interface ICategory {
  _id: Types.ObjectId;
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

type TypeSnsId = {
  id: string;
  email: string | undefined;
  name: string | undefined;
  picture: string | undefined;
};

interface IUser {
  _id: Types.ObjectId;
  userName: string | undefined;
  email: string | undefined;
  snsId: {
    google: string | undefined;
    naver: TypeSnsId | undefined;
    kakao: TypeSnsId | undefined;
  };
  isGuest: boolean;
  categories: ICategory[];
  birthdate?: Date;
  gender?: string;
  tel?: string;
  basicBudgetId: Types.ObjectId;
  assets: IAsset[];
  cards: ICard[];
  paymentMethods: IPaymentMethod[];
  auth?: string;
}

interface IUserProps {
  /* subdocument array */
  categories: Types.DocumentArray<ICategory>;
  assets: Types.DocumentArray<IAsset>;
  cards: Types.DocumentArray<ICard>;
  paymentMethods: Types.DocumentArray<IPaymentMethod>;
  /* methods */
  saveReqUser: () => Promise<void>;
  setDefaultCategories: () => void;
  findCategory: (categoryId: string) => ICategory | undefined;
  findCategoryIdx: (categoryId: string) => number;
  findDefaultExpenseCategory: () => HydratedDocument<ICategory>;
  findDefaultIncomeCategory: () => HydratedDocument<ICategory>;
  pushCategory: (category: any) => void;
  execPM: (transaction: {
    linkedPaymentMethodId: Types.ObjectId;
    linkedPaymentMethodType: "asset" | "card";
    amount: number;
    isExpense: boolean;
  }) => boolean;
  cancelPM: (transaction: {
    linkedPaymentMethodId: Types.ObjectId;
    linkedPaymentMethodType: "asset" | "card";
    amount: number;
    isExpense: boolean;
  }) => boolean;
}

interface IUserModel extends Model<IUser, {}, IUserProps> {}

const userSchema = new Schema<IUser, IUserModel, IUserProps>(
  {
    // user fields
    userName: {
      type: String,
    },
    email: {
      type: String,
    },
    snsId: {
      type: Object,
      default: {},
    },
    isGuest: {
      type: Boolean,
      default: false,
    },

    /* ____________ categories ____________ */
    categories: {
      type: [categorySchema],
    },
    birthdate: Date,
    gender: String,
    tel: String,
    basicBudgetId: Schema.Types.ObjectId,
    assets: {
      type: [assetSchema],
    },
    cards: {
      type: [cardSchema],
    },
    paymentMethods: {
      type: [paymentMethodSchema],
    },
    auth: {
      type: String,
    },
  },
  { timestamps: true }
);

userSchema.methods.saveReqUser = async function () {
  try {
    return await this.save();
  } catch (err: any) {
    return err;
  }
};

userSchema.methods.setDefaultCategories = async function () {
  try {
    const categories = [
      // 지출 카테고리
      {
        isExpense: true,
        title: "식비",
        icon: "🍚",
      },
      {
        isExpense: true,
        title: "간식",
        icon: "🍫",
      },
      {
        isExpense: true,
        title: "생활",
        icon: "💸",
      },
      {
        isExpense: true,
        title: "교통",
        icon: "🚉",
      },
      {
        isExpense: true,
        title: "교육",
        icon: "🎓",
      },
      {
        isExpense: true,
        title: "문화/여가",
        icon: "🎬",
      },
      {
        isExpense: true,
        title: "의료/건강",
        icon: "💊",
      },
      {
        isExpense: true,
        title: "주거/통신",
        icon: "🏠",
      },
      {
        isExpense: true,
        title: "의류/미용",
        icon: "🛍️",
      },
      {
        isExpense: true,
        title: "기부/후원",
        icon: "🕊️",
      },
      {
        isExpense: true,
        title: "경조사비",
        icon: "💌",
      },
      {
        isExpense: true,
        title: "선물",
        icon: "🎁",
      },
      {
        isExpense: true,
        title: "이체",
        icon: "🍎",
      },
      {
        isExpense: true,
        title: "채무",
        icon: "🥭",
      },
      // 수입 카테고리
      {
        isIncome: true,
        title: "월급",
        icon: "💙",
      },
      {
        isIncome: true,
        title: "보너스",
        icon: "💜",
      },
      {
        isIncome: true,
        title: "용돈",
        icon: "💚",
      },
      {
        isIncome: true,
        title: "이체",
        icon: "🍏",
      },
      {
        isIncome: true,
        title: "채무",
        icon: "🍋",
      },
      // 기본 카테고리
      {
        isExpense: true,
        isDefault: true,
        title: "기타",
        icon: "",
      },
      {
        isIncome: true,
        isDefault: true,
        title: "기타",
        icon: "",
      },
    ];
    for (let category of categories) {
      this.categories.push(category);
    }
    return;
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

userSchema.methods.execPM = function (transaction: {
  linkedPaymentMethodId: Types.ObjectId;
  linkedPaymentMethodType: "asset" | "card";
  amount: number;
  isExpense: boolean;
}) {
  let isUserUpdated = false;
  if (transaction.linkedPaymentMethodType === "asset") {
    const asset = _.find(this.assets, {
      _id: transaction.linkedPaymentMethodId,
    });
    if (asset) {
      if (transaction.isExpense) asset.amount -= transaction.amount;
      else asset.amount += transaction.amount;
      isUserUpdated = true;
    }
  } else {
    const card = _.find(this.cards, { _id: transaction.linkedPaymentMethodId });
    if (card && card.linkedAssetId) {
      const asset = _.find(this.assets, {
        _id: card.linkedAssetId,
      });
      if (asset) {
        if (transaction.isExpense) asset.amount -= transaction.amount;
        else asset.amount += transaction.amount;
        isUserUpdated = true;
      }
    }
  }
  return isUserUpdated;
};

userSchema.methods.cancelPM = function (transaction: {
  linkedPaymentMethodId: Types.ObjectId;
  linkedPaymentMethodType: "asset" | "card";
  amount: number;
  isExpense: boolean;
}) {
  let isUserUpdated = false;
  if (transaction.linkedPaymentMethodType === "asset") {
    const asset = _.find(this.assets, {
      _id: transaction.linkedPaymentMethodId,
    });
    if (asset) {
      if (transaction.isExpense) asset.amount += transaction.amount;
      else asset.amount -= transaction.amount;
      isUserUpdated = true;
    }
  } else {
    const card = _.find(this.cards, { _id: transaction.linkedPaymentMethodId });
    if (card && card.linkedAssetId) {
      const asset = _.find(this.assets, {
        _id: card.linkedAssetId,
      });
      if (asset) {
        if (transaction.isExpense) asset.amount += transaction.amount;
        else asset.amount -= transaction.amount;
        isUserUpdated = true;
      }
    }
  }
  return isUserUpdated;
};

const User = model<IUser, IUserModel>("User", userSchema);
export {
  User,
  IUser,
  IUserProps,
  ICategory,
  IUserModel,
  IAsset,
  ICard,
  IPaymentMethod,
};
