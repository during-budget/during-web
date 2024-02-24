import { AgreementEntity } from "@models/Agreement";
import { UserEntity } from "@models/User";
import { Types } from "mongoose";
import { AgreementType } from "./agreement";

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

export type User = {
  _id: Types.ObjectId;
  email?: string;
  userName?: string;
  isLocal: boolean;
  snsId: {
    google?: string;
    naver?: string;
    kakao?: string;
  };
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
  settings: {
    chartSkin: string;
    timeZone: string;
    theme: string;
  };
  agreement: {
    termsOfUse?: string;
    privacyPolicy?: string;
  };
};

export function convertToUser(req: {
  userEntity: UserEntity;
  agreements: Array<AgreementEntity>;
}): User {
  const { userEntity, agreements } = req;

  const temrsOfUseAgreement = agreements.find(
    (agreement) => agreement.type === AgreementType.TermsOfUse
  );

  const privacyPolicyAgreement = agreements.find(
    (agreement) => agreement.type === AgreementType.PrivacyPolicy
  );

  return {
    _id: userEntity._id,
    email: userEntity.email,
    userName: userEntity.userName,
    isLocal: userEntity.isLocal,
    snsId: userEntity.snsId
      ? {
          google: userEntity.snsId.google,
          naver: userEntity.snsId.naver,
          kakao: userEntity.snsId.kakao,
        }
      : {},
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
    settings: {
      chartSkin: userEntity.settings.chartSkin,
      timeZone: userEntity.settings.timeZone,
      theme: userEntity.settings.theme,
    },
    agreement: {
      termsOfUse: temrsOfUseAgreement?.version,
      privacyPolicy: privacyPolicyAgreement?.version,
    },
  };
}
