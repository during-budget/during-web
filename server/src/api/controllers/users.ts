import { Request, Response } from "express";
import _ from "lodash";
import { User } from "src/models/User";
import { Budget } from "src/models/Budget";
import { Transaction } from "src/models/Transaction";

import * as UserService from "src/services/user";

//_____________________________________________________________________________

/**
 * Update fields(userName, birthdate, gender, tel)
 */
export const updateFields = async (req: Request, res: Response) => {
  const user = req.user!;
  await UserService.updateFields(user, req.body);

  return res.status(200).send({
    userName: user.userName,
    birthdate: user.birthdate,
    gender: user.gender,
    tel: user.tel,
  });
};

/**
 * Update agreement
 */
export const updateAgreement = async (req: Request, res: Response) => {
  const user = req.user!;

  await UserService.updateAgreement(user, req.body);

  return res.status(200).send({
    agreement: user.agreement,
  });
};

export const updateAgreementTermsOfUse = async (
  req: Request,
  res: Response
) => {
  const user = req.user!;

  await UserService.updateAgreement(user, {
    ...(user.agreement ?? {}),
    termsOfUse: req.body.termsOfUse,
  });

  return res.status(200).send({
    agreement: user.agreement,
  });
};

export const updateAgreementPrivacyPolicy = async (
  req: Request,
  res: Response
) => {
  const user = req.user!;

  await UserService.updateAgreement(user, {
    ...(user.agreement ?? {}),
    privacyPolicy: req.body.privacyPolicy,
  });

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
  const user = req.user!;
  await Promise.all([
    Transaction.deleteMany({ userId: user._id }),
    Budget.deleteMany({ userId: user._id }),
  ]);
  await UserService.remove(user._id);
  return res.status(200).send({});
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
