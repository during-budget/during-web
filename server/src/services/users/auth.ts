import { HydratedDocument } from "mongoose";

import { UserEntity } from "src/models/user.model";

type snsType = "google" | "naver" | "kakao";

export const isAdmin = async (userRecord: UserEntity) =>
  userRecord.auth === "admin";

export const isLocalLoginActive = (userRecord: HydratedDocument<UserEntity>) =>
  userRecord.isLocal;

export const checkSnsIdActive = (
  userRecord: HydratedDocument<UserEntity>,
  sns: snsType
) => userRecord.snsId && sns in userRecord.snsId && userRecord.snsId[sns];

export const countActiveSnsId = (userRecord: HydratedDocument<UserEntity>) => {
  let cnt = 0;
  if (checkSnsIdActive(userRecord, "google")) cnt += 1;
  if (checkSnsIdActive(userRecord, "naver")) cnt += 1;
  if (checkSnsIdActive(userRecord, "kakao")) cnt += 1;
  return cnt;
};

export const hasActiveSnsId = (userRecord: HydratedDocument<UserEntity>) =>
  countActiveSnsId(userRecord) > 0;

export const disableLocalLogin = async (
  userRecord: HydratedDocument<UserEntity>
) => {
  userRecord.isLocal = false;
  await userRecord.save();
};

export const updateSnsId = async (
  userRecord: HydratedDocument<UserEntity>,
  sns: snsType,
  id: string
) => {
  userRecord.snsId = { ...userRecord.snsId, [sns]: id };
  userRecord.isGuest = false;
  await userRecord.save();
};

export const updateEmailAndActivateLocalLogin = async (
  userRecord: HydratedDocument<UserEntity>,
  email: string
) => {
  userRecord.email = email;
  userRecord.isLocal = true;
  userRecord.isGuest = false;
  await userRecord.save();
};

export const removeSnsId = async (
  userRecord: HydratedDocument<UserEntity>,
  sns: snsType
) => {
  userRecord.snsId = { ...userRecord.snsId, [sns]: undefined };
  await userRecord.save();
};

export const isGuest = (userRecord: UserEntity) => userRecord.isGuest;
