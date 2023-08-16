import { User as UserModel } from "src/models/User";
import * as BudgetService from "./budget";
import { generateRandomString } from "src/utils/randomString";
import { Types } from "mongoose";
import { AT_LEAST_ONE_SNSID_IS_REQUIRED, NOT_FOUND } from "src/api/message";
import { CustomError } from "src/api/middleware/error";

type snsType = "google" | "naver" | "kakao";

const createUser = async (field: object) => {
  const userRecord = await UserModel.create(field);
  const { budget } = await BudgetService.createBasicBudget(userRecord);
  userRecord.basicBudgetId = budget._id;
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

export const findById = async (_id: Types.ObjectId) => {
  return UserModel.findById(_id);
};

export const findAdmin = async (id: string) => {
  return UserModel.findOne({ ["snsId.google"]: id, auth: "admin" });
};

export const findBySnsId = async (sns: snsType, id: string) => {
  return UserModel.findOne({ ["snsId." + sns]: id });
};

export const findByEmail = async (email: string) => {
  return UserModel.findOne({ email });
};

export const updateEmailAndEnableLocalLogin = async (
  userRecord: Express.User,
  email: string
) => {
  userRecord.email = email;
  userRecord.isGuest = true;
  userRecord.isGuest = false;
  await userRecord.save();
};

export const updateFields = async (
  userRecord: Express.User,
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
  userRecord: Express.User,
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

export const disableLocalLogin = async (userRecord: Express.User) => {
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

export const updateSnsId = async (
  userRecord: Express.User,
  sns: snsType,
  id: string
) => {
  userRecord.snsId = { ...userRecord.snsId, [sns]: id };
  userRecord.isGuest = false;
  await userRecord.save();
};

export const removeSnsId = async (userRecord: Express.User, sns: snsType) => {
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

export const remove = async (userId: Types.ObjectId) =>
  await UserModel.findByIdAndDelete(userId);
