import { HydratedDocument } from "mongoose";

import { IUser } from "src/models/User";

type snsType = "google" | "naver" | "kakao";

export const isAdmin = async (userRecord: IUser) => userRecord.auth === "admin";

export const isLocalLoginActive = (userRecord: HydratedDocument<IUser>) =>
  userRecord.isLocal;

export const checkSnsIdActive = (
  userRecord: HydratedDocument<IUser>,
  sns: snsType
) => userRecord.snsId && sns in userRecord.snsId && userRecord.snsId[sns];

export const countActiveSnsId = (userRecord: HydratedDocument<IUser>) => {
  let cnt = 0;
  if (checkSnsIdActive(userRecord, "google")) cnt += 1;
  if (checkSnsIdActive(userRecord, "naver")) cnt += 1;
  if (checkSnsIdActive(userRecord, "kakao")) cnt += 1;
  return cnt;
};

export const hasActiveSnsId = (userRecord: HydratedDocument<IUser>) =>
  countActiveSnsId(userRecord) > 0;

export const disableLocalLogin = async (
  userRecord: HydratedDocument<IUser>
) => {
  userRecord.isLocal = false;
  await userRecord.save();
};

export const updateSnsId = async (
  userRecord: HydratedDocument<IUser>,
  sns: snsType,
  id: string
) => {
  userRecord.snsId = { ...userRecord.snsId, [sns]: id };
  userRecord.isGuest = false;
  await userRecord.save();
};

export const updateEmailAndActivateLocalLogin = async (
  userRecord: HydratedDocument<IUser>,
  email: string
) => {
  userRecord.email = email;
  userRecord.isLocal = true;
  userRecord.isGuest = false;
  await userRecord.save();
};

export const removeSnsId = async (
  userRecord: HydratedDocument<IUser>,
  sns: snsType
) => {
  userRecord.snsId = { ...userRecord.snsId, [sns]: undefined };
  await userRecord.save();
};

export const isGuest = (userRecord: IUser) => userRecord.isGuest;
