import { AgreementEntity } from "@models/Agreement";
import { UserEntity } from "@models/User";
import { Types } from "mongoose";
import { AgreementType } from "./agreement";
import {
  basicChartSkin,
  basicTheme,
  basicTimeZone,
} from "@models/_basicSettings";

export type UserCategory = {
  _id: Types.ObjectId;
  isExpense?: boolean;
  isIncome?: boolean;
  isDefault?: boolean;
  title: string;
  icon: string;
};

export type UserAsset = {
  _id: Types.ObjectId;
  icon: string;
  title: string;
  amount: number;
  detail: string;
};

export type UserCard = {
  _id: Types.ObjectId;
  icon: string;
  title: string;
  linkedAssetId?: Types.ObjectId;
  linkedAssetIcon?: string;
  linkedAssetTitle?: string;
  detail: string;
  paymentDate?: number;
};

export type UserPaymentMethod = {
  _id: Types.ObjectId;
  type: "asset" | "card";
  icon: string;
  title: string;
  detail: string;
  isChecked: boolean;
};

enum Sns {
  Google = "google",
  Naver = "naver",
  Kakao = "kakao",
}

type UserSnsId = {
  [key in Sns]?: string;
};

enum UserSettingsField {
  ChartSkin = "chartSkin",
  TimeZone = "timeZone",
  Theme = "theme",
}

type UserSettings = {
  [key in UserSettingsField]: string;
};

enum UserAgreementField {
  TermsOfUse = "termsOfUse",
  PrivacyPolicy = "privacyPolicy",
}

type UserAgreement = {
  [key in UserAgreementField]?: string;
};

export type User = {
  _id: Types.ObjectId;
  email?: string;
  userName?: string;
  isLocal: boolean;
  snsId: UserSnsId;
  isGuest?: boolean;
  categories: Array<UserCategory>;
  birthdate?: Date;
  gender?: string;
  tel?: string;
  basicBudgetId: Types.ObjectId;
  assets: Array<UserAsset>;
  cards: Array<UserCard>;
  paymentMethods: Array<UserPaymentMethod>;
  auth?: string;
  settings: UserSettings;
  agreement: UserAgreement;
};

export function convertToUser(
  userEntity: UserEntity,
  opts?: {
    agreements?: Array<AgreementEntity>;
  }
): User {
  const userSnsId: UserSnsId = {};
  if (userEntity.snsId) {
    for (const sns of [Sns.Google, Sns.Kakao, Sns.Naver]) {
      if (sns in userEntity.snsId) {
        userSnsId[sns] = "connected";
      }
    }
  }

  const userSettings: UserSettings = {
    [UserSettingsField.ChartSkin]:
      userEntity.settings?.chartSkin ?? basicChartSkin,
    [UserSettingsField.TimeZone]:
      userEntity.settings?.timeZone ?? basicTimeZone,
    [UserSettingsField.Theme]: userEntity.settings?.theme ?? basicTheme,
  };

  const userAgreement: UserAgreement = {};

  if (opts) {
    const { agreements } = opts;

    if (agreements) {
      userAgreement[UserAgreementField.TermsOfUse] = agreements?.find(
        (agreement) => agreement.type === AgreementType.TermsOfUse
      )?.version;

      userAgreement[UserAgreementField.PrivacyPolicy] = agreements?.find(
        (agreement) => agreement.type === AgreementType.PrivacyPolicy
      )?.version;
    }
  }

  return {
    _id: userEntity._id,
    email: userEntity.email,
    userName: userEntity.userName,
    isLocal: userEntity.isLocal,
    snsId: userSnsId,
    isGuest: userEntity.isGuest,
    categories: userEntity.categories,
    birthdate: userEntity.birthdate,
    gender: userEntity.gender,
    tel: userEntity.tel,
    basicBudgetId: userEntity.basicBudgetId,
    assets: userEntity.assets,
    cards: userEntity.cards,
    paymentMethods: userEntity.paymentMethods,
    auth: userEntity.auth,
    settings: userSettings,
    agreement: userAgreement,
  };
}
