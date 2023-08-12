import { Request, Response, NextFunction } from "express";
import _ from "lodash";
import { User, IUser, IUserProps } from "@models/User";
import { Budget } from "@models/Budget";
import { Transaction } from "@models/Transaction";
import passport from "passport";
import { HydratedDocument } from "mongoose";
import {
  generateRandomString,
  generateRandomNumber,
} from "../../../utils/randomString";
import { cipher, decipher } from "../../../utils/crypto";

import { logger } from "@logger";
import {
  EMAIL_IN_USE,
  FIELD_REQUIRED,
  USER_NOT_FOUND,
} from "../../../@message";

//_____________________________________________________________________________

/**
 * Update fields(userName, birthdate, gender, tel)
 */
export const updateFields = async (req: Request, res: Response) => {
  const user = req.user!;
  user.userName = req.body.userName;
  user.birthdate = req.body.birthdate;
  user.gender = req.body.gender;
  user.tel = req.body.tel;
  await user.saveReqUser();

  let message = undefined;
  const undefinedFields = [];
  if (!user.userName) undefinedFields.push("userName");
  if (!user.birthdate) undefinedFields.push("birthdate");
  if (!user.gender) undefinedFields.push("gender");
  if (!user.tel) undefinedFields.push("tel");
  if (undefinedFields.length !== 0) {
    message = `field(${_.join(undefinedFields, ", ")}) is undefined`;
  }

  return res.status(200).send({
    userName: user.userName,
    birthdate: user.birthdate,
    gender: user.gender,
    tel: user.tel,
    message,
  });
};

/**
 * Update agreement
 */
export const updateAgreement = async (req: Request, res: Response) => {
  const user = req.user!;

  user.agreement = {
    termsOfUse: req.body.termsOfUse,
    privacyPolicy: req.body.privacyPolicy,
  };
  await user.saveReqUser();

  return res.status(200).send({
    agreement: user.agreement,
  });
};

export const updateAgreementTermsOfUse = async (
  req: Request,
  res: Response
) => {
  const user = req.user!;

  user.agreement = {
    ...(user.agreement ?? {}),
    termsOfUse: req.body.termsOfUse,
  };
  await user.saveReqUser();

  return res.status(200).send({
    agreement: user.agreement,
  });
};

export const updateAgreementPrivacyPolicy = async (
  req: Request,
  res: Response
) => {
  const user = req.user!;

  user.agreement = {
    ...(user.agreement ?? {}),
    privacyPolicy: req.body.privacyPolicy,
  };
  await user.saveReqUser();

  return res.status(200).send({
    agreement: user.agreement,
  });
};

/**
 * Read current user's info
 */
export const current = (req: Request, res: Response) => {
  return res.status(200).send({ user: req.user });
};

export const remove = async (req: Request, res: Response) => {
  try {
    const user = req.user!;
    await Promise.all([
      Transaction.deleteMany({ userId: user._id }),
      Budget.deleteMany({ userId: user._id }),
    ]);
    await User.findByIdAndRemove(user._id);
    return res.status(200).send({});
  } catch (err: any) {
    return res.status(err.status || 500).send({ message: err.message });
  }
};

/* admin */
export const list = async (req: Request, res: Response) => {
  try {
    const users = await User.find({})
      .lean()
      .select(["email", "userName", "snsId", "createdAt", "updatedAt"]);
    return res.status(200).send({ users });
  } catch (err: any) {
    return res.status(err.status || 500).send({ message: err.message });
  }
};
export const find = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params._id).lean();
    return res.status(200).send({ user });
  } catch (err: any) {
    return res.status(err.status || 500).send({ message: err.message });
  }
};
export const remove2 = async (req: Request, res: Response) => {
  try {
    await Promise.all([
      Transaction.deleteMany({ userId: req.params._id }),
      Budget.deleteMany({ userId: req.params._id }),
    ]);
    await User.findByIdAndRemove(req.params._id);
    return res.status(200).send({});
  } catch (err: any) {
    return res.status(err.status || 500).send({ message: err.message });
  }
};