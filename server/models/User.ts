import { Schema, model, Model, Types, HydratedDocument } from "mongoose";

import _ from "lodash";
import { Budget } from "./Budget";
import { basicCategories } from "./_basicCategories";

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

interface IUser {
  _id: Types.ObjectId;
  email: string | undefined;
  userName: string | undefined;
  picture: string | undefined;
  isLocal: boolean;
  snsId: {
    google: string | undefined;
    naver: string | undefined;
    kakao: string | undefined;
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
  settings: {
    chartSkin: string;
  };
}

interface IUserProps {
  /* subdocument array */
  categories: Types.DocumentArray<ICategory>;
  assets: Types.DocumentArray<IAsset>;
  cards: Types.DocumentArray<ICard>;
  paymentMethods: Types.DocumentArray<IPaymentMethod>;
  /* methods */
  initialize: () => Promise<void>;
  saveReqUser: () => Promise<void>;
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
    email: {
      type: String,
    },
    isLocal: {
      type: Boolean,
      default: false,
    },
    userName: {
      type: String,
    },
    picture: { type: String },
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
      default: basicCategories,
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
    settings: {
      type: Object,
      default: {
        chartSkin: "basic",
      },
    },
  },
  { timestamps: true }
);

userSchema.methods.initialize = async function () {
  try {
    const user = this;

    const budget = await Budget.create({
      userId: user._id,
      title: "기본 예산",
      categories: user.categories.map((category) => {
        return {
          ...category,
          categoryId: category._id,
          amountPlanned: 0,
        };
      }),
    });

    user.basicBudgetId = budget._id;
    await user.save();
  } catch (err: any) {
    return err;
  }
};

userSchema.methods.saveReqUser = async function () {
  try {
    return await this.save();
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
