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
  birthDate?: Date;
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
    ...userEntity,
    agreement: {
      termsOfUse: temrsOfUseAgreement?.version,
      privacyPolicy: privacyPolicyAgreement?.version,
    },
  };
}
