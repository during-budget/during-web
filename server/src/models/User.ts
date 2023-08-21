import { Schema, model, Model, Types, HydratedDocument } from "mongoose";

import _ from "lodash";
import { basicCategories } from "./_basicCategories";
import {
  IAsset,
  ICard,
  IPaymentMethod,
  assetSchema,
  cardSchema,
  paymentMethodSchema,
} from "./PaymentMethod";
import { basicChartSkin, basicTimeZone, basicTheme } from "./_basicSettings";

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
    timeZone: string;
    theme: string;
  };
  agreement?: {
    termsOfUse?: string;
    privacyPolicy?: string;
  };
}

interface IUserProps {
  /* subdocument array */
  categories: Types.DocumentArray<ICategory>;
  assets: Types.DocumentArray<IAsset>;
  cards: Types.DocumentArray<ICard>;
  paymentMethods: Types.DocumentArray<IPaymentMethod>;
  /* methods */
  saveReqUser: () => Promise<void>;
  findDefaultExpenseCategory: () => HydratedDocument<ICategory>;
  findDefaultIncomeCategory: () => HydratedDocument<ICategory>;
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
        chartSkin: basicChartSkin,
        timeZone: basicTimeZone,
        theme: basicTheme,
      },
    },
    agreement: {
      type: Object,
      default: {},
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

userSchema.methods.findDefaultExpenseCategory = function () {
  return this.categories[this.categories.length - 2].toObject();
};

userSchema.methods.findDefaultIncomeCategory = function () {
  return this.categories[this.categories.length - 1].toObject();
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
