import { IUser, User as UserModel } from "src/models/User";
import { generateRandomString } from "src/utils/randomString";
import { HydratedDocument, Types } from "mongoose";
import { AT_LEAST_ONE_SNSID_IS_REQUIRED, NOT_FOUND } from "src/api/message";
import { CustomError } from "src/api/middleware/error";
import _ from "lodash";

import * as BudgetService from "./budget";
import * as TransactionService from "./transaction";

type snsType = "google" | "naver" | "kakao";

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
  sns: snsType,
  profile: { id: string; email?: string; displayName?: string }
) => {
  const { user } = await createUser({
    userName: profile.displayName,
    email: profile.email,
    snsId: { [sns]: profile.id },
  });
  return { user };
};

export const findAll = async () => {
  const userRecordList = await UserModel.find({})
    .lean()
    .select(["email", "userName", "snsId", "createdAt", "updatedAt"]);

  return { users: userRecordList };
};

export const findById = async (_id: Types.ObjectId | string) => {
  const userRecord = UserModel.findById(_id);

  return { user: userRecord };
};

export const findAdmin = async (id: string) => {
  const userRecord = await UserModel.findOne({
    ["snsId.google"]: id,
    auth: "admin",
  });

  return { user: userRecord };
};

export const checkAdmin = async (userRecord: IUser) =>
  userRecord.auth === "admin";

export const findBySnsId = async (sns: snsType, id: string) => {
  const userRecord = await UserModel.findOne({ ["snsId." + sns]: id });

  return { user: userRecord };
};

export const findByEmail = async (email: string) => {
  const userRecord = await UserModel.findOne({ email });

  return { user: userRecord };
};

export const findCategory = (
  userRecord: IUser,
  _categoryId: string | Types.ObjectId
) => {
  const categoryId = new Types.ObjectId(_categoryId);
  for (let i = 0; i < userRecord.categories.length; i++) {
    if (userRecord.categories[i]._id.equals(categoryId)) {
      return { idx: i, category: userRecord.categories[i] };
    }
  }
  return { idx: -1, category: undefined };
};

export const updateEmailAndEnableLocalLogin = async (
  userRecord: HydratedDocument<IUser>,
  email: string
) => {
  userRecord.email = email;
  userRecord.isGuest = true;
  userRecord.isGuest = false;
  await userRecord.save();
};

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

export const disableLocalLogin = async (
  userRecord: HydratedDocument<IUser>
) => {
  if (
    !userRecord.snsId?.google &&
    !userRecord.snsId?.naver &&
    !userRecord.snsId?.kakao
  ) {
    throw new CustomError(409, AT_LEAST_ONE_SNSID_IS_REQUIRED);
  }
  userRecord.isLocal = false;
  await userRecord.save();
};

export const checkSnsIdExistence = (
  userRecord: HydratedDocument<IUser>,
  sns: snsType
) => userRecord.snsId?.[sns];

export const updateSnsId = async (
  userRecord: HydratedDocument<IUser>,
  sns: snsType,
  id: string
) => {
  userRecord.snsId = { ...userRecord.snsId, [sns]: id };
  userRecord.isGuest = false;
  await userRecord.save();
};

export const removeSnsId = async (
  userRecord: HydratedDocument<IUser>,
  sns: snsType
) => {
  if (!userRecord.snsId || !userRecord.snsId[sns]) {
    throw new CustomError(404, NOT_FOUND("snsId"));
  }

  userRecord.snsId = { ...userRecord.snsId, [sns]: undefined };
  if (
    !userRecord.isLocal &&
    !userRecord.snsId?.google &&
    !userRecord.snsId?.naver &&
    !userRecord.snsId?.kakao
  ) {
    throw new CustomError(409, AT_LEAST_ONE_SNSID_IS_REQUIRED);
  }
  await userRecord.save();
};

export const remove = async (userId: Types.ObjectId) => {
  await Promise.all([
    TransactionService.removeByUserId(userId),
    BudgetService.removeByUserId(userId),
    UserModel.findByIdAndDelete(userId),
  ]);
};
