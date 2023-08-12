import { Request, Response } from "express";
import _ from "lodash";
import { ObjectId, Types } from "mongoose";

import { IPaymentMethod, IUser, User } from "@models/User";

import { logger } from "@logger";
import { FIELD_REQUIRED, NOT_FOUND, NOT_PERMITTED } from "../../../@message";
import { FIELD_INVALID } from "../../../@message";
import { Challenge, IChallenge } from "@models/Challenge";
import { Transaction } from "@models/Transaction";

const findTransactions = async (opts: {
  challenge: IChallenge;
  user: IUser;
}) => {
  if (opts.challenge.type === "category") {
    return await Transaction.find({
      userId: opts.user._id,
      budgetId: { $ne: opts.user.basicBudgetId },
      date: { $gte: opts.challenge.startDate, $lte: opts.challenge.endDate },
      "category.categoryId": opts.challenge.categoryId,
    });
  }

  return await Transaction.find({
    userId: opts.user._id,
    budgetId: { $ne: opts.user.basicBudgetId },
    date: { $gte: opts.challenge.startDate, $lte: opts.challenge.endDate },
    tags: { $elemMatch: { $eq: opts.challenge.tag } },
  });
};

export const create = async (req: Request, res: Response) => {
  try {
    for (let field of [
      "startDate",
      "endDate",
      "type",
      "amount",
      "comparison",
    ]) {
      if (!(field in req.body)) {
        return res.status(400).send({ message: FIELD_REQUIRED(field) });
      }
    }
    if (req.body.type === "category") {
      if (!("categoryId" in req.body)) {
        return res.status(400).send({ message: FIELD_REQUIRED("categoryId") });
      }
      if (
        !_.find(req.user?.categories, {
          _id: new Types.ObjectId(req.body.categoryId),
        })
      ) {
        return res.status(404).send({ message: NOT_FOUND("category") });
      }
    } else if (req.body.type === "tag") {
      if (!("tag" in req.body)) {
        return res.status(400).send({ message: FIELD_REQUIRED("tag") });
      }
    } else {
      return res.status(400).send({ message: FIELD_INVALID("type") });
    }
    if (
      req.body.comparison !== "lt" &&
      req.body.comparison !== "lte" &&
      req.body.comparison !== "gt" &&
      req.body.comparison !== "gte"
    ) {
      return res.status(400).send({ message: FIELD_INVALID("comparison") });
    }
    const user = req.user!;

    const challenge = await Challenge.create({
      userId: user._id,
      startDate: req.body.startDate,
      endDate: req.body.endDate,
      type: req.body.type,
      categoryId: req.body.categoryId,
      tag: req.body.tag,
      amount: req.body.amount,
      comparison: req.body.comparison,
    });
    const transactions = await findTransactions({ challenge, user });

    return res.status(200).send({
      challenge,
      transactions,
    });
  } catch (err: any) {
    logger.error(err.message);
    return res.status(500).send({ message: err.message });
  }
};

export const find = async (req: Request, res: Response) => {
  try {
    let user = req.user!;

    if ("userId" in req.query) {
      if (user.auth !== "admin") {
        return res.status(403).send({ message: NOT_PERMITTED });
      }
      const _user = await User.findOne({ userId: req.query.userId });
      if (!_user) {
        return res.status(404).send({ message: NOT_FOUND("user") });
      }
      user = _user;
    }

    const challenges = await Challenge.find({ userId: user._id });
    const transactionsList = await Promise.all(
      challenges.map((challenge) => findTransactions({ challenge, user }))
    );

    return res.status(200).send({
      challengeList: challenges.map((challenge, idx) => {
        return {
          ...challenge.toObject(),
          transactions: transactionsList[idx],
        };
      }),
    });
  } catch (err: any) {
    logger.error(err.message);
    return res.status(500).send({ message: err.message });
  }
};
