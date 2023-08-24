import { HydratedDocument, Types } from "mongoose";

import { IUser, User as UserModel } from "src/models/User";

import * as BudgetService from "src/services/budgets";
import * as TransactionService from "src/services/transactions";

import * as AuthService from "./auth";
import * as CategoryService from "./categories";
import * as PaymentMethodService from "./paymentMethods";
import * as AssetService from "./assets";
import * as CardService from "./cards";

import { generateRandomString } from "src/utils/randomString";

export {
  AuthService,
  CategoryService,
  PaymentMethodService,
  AssetService,
  CardService,
};

/* create user */

const createUser = async (field: object) => {
  const userRecord = await UserModel.create(field);
  const { budget: budgetRecord } = await BudgetService.createBasicBudget(
    userRecord
  );
  userRecord.basicBudgetId = budgetRecord._id;
  await userRecord.save();
  return { user: userRecord };
};

export const createGuest = async () => {
  const { user } = await createUser({
    userName: "guest-" + generateRandomString(5),
    isGuest: true,
  });
  return { user };
};

export const createLocalUser = async (email: string) => {
  const { user } = await createUser({
    email,
    isLocal: true,
  });
  return { user };
};

export const createSnsUser = async (
  sns: string,
  profile: { id: string; email?: string; displayName?: string }
) => {
  const { user } = await createUser({
    userName: profile.displayName,
    email: profile.email,
    snsId: { [sns]: profile.id },
  });
  return { user };
};

/* find users */

export const findAdminByGoogleId = async (id: string) => {
  const userRecord = await UserModel.findOne({
    ["snsId.google"]: id,
    auth: "admin",
  });

  return { user: userRecord };
};

export const findAll = async () => {
  const userRecordList = await UserModel.find({})
    .lean()
    .select(["email", "userName", "snsId", "createdAt", "updatedAt"]);

  return { users: userRecordList };
};

export const findById = async (_id: Types.ObjectId | string) => {
  const userRecord = await UserModel.findById(_id);

  return { user: userRecord };
};

export const findBySnsId = async (sns: string, id: string) => {
  const userRecord = await UserModel.findOne({ ["snsId." + sns]: id });

  return { user: userRecord };
};

export const findByEmail = async (email: string) => {
  const userRecord = await UserModel.findOne({ email });

  return { user: userRecord };
};
/* update */

export const updateFields = async (
  userRecord: HydratedDocument<IUser>,
  user: {
    userName: string;
    birthdate: Date;
    gender: string;
    tel: string;
  }
) => {
  userRecord.userName = user.userName;
  userRecord.birthdate = user.birthdate;
  userRecord.gender = user.gender;
  userRecord.tel = user.tel;
  await userRecord.save();
};

export const updateAgreement = async (
  userRecord: HydratedDocument<IUser>,
  agreement: {
    termsOfUse?: string;
    privacyPolicy?: string;
  }
) => {
  userRecord.agreement = {
    termsOfUse: agreement.termsOfUse,
    privacyPolicy: agreement.privacyPolicy,
  };

  await userRecord.save();
};

/* remove */

export const remove = async (userRecord: HydratedDocument<IUser>) => {
  await Promise.all([
    TransactionService.removeByUserId(userRecord._id),
    BudgetService.removeByUserId(userRecord._id),
    userRecord.remove(),
  ]);
};
