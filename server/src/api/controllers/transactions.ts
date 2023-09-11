import { Request, Response } from "express";
import _ from "lodash";
import { ITransaction, Transaction } from "src/models/Transaction";
import { HydratedDocument, Types } from "mongoose";
import moment from "moment-timezone";

import { logger } from "src/api/middleware/loggers";
import { User } from "src/models/User";

import {
  CATEGORY_CANOT_BE_UPDATED,
  FIELD_INVALID,
  FIELD_REQUIRED,
  NOT_FOUND,
  NOT_PERMITTED,
} from "../message";
import { basicTimeZone } from "src/models/_basicSettings";

import { PaymentMethodService } from "src/services/users";
import * as BudgetService from "src/services/budgets";
import * as TransactionService from "src/services/transactions";
import { TransactionNotFoundError } from "errors/NotFoundError";

const { CategoryService: BudgetCategoryService } = BudgetService;

// transaction controller

/**
 * Create transaction
 *
 * @body { budgetId, date, isCurrent, isExpense, isIncome, title: [String], amount: Number, categoryId, tags?, memo?, linkId?}
 * @return transaction
 */

const dateReg = new RegExp("[0-9]{4}[-][0-9]{2}[-][0-9]{2}");

export const create = async (req: Request, res: Response) => {
  for (let field of [
    "budgetId",
    "date",
    "isCurrent",
    "title",
    "amount",
    "categoryId",
  ])
    if (!(field in req.body))
      return res.status(400).send({ message: FIELD_REQUIRED(field) });
  const user = req.user!;

  const { budget } = await BudgetService.findById(req.body.budgetId);
  if (!budget) return res.status(404).send({ message: NOT_FOUND("budget") });

  const { category } = BudgetCategoryService.findById(
    budget,
    req.body.categoryId
  );
  if (!category)
    return res.status(404).send({ message: NOT_FOUND("category") });

  const { transaction } = await TransactionService.create(
    user,
    budget,
    category,
    {
      date: req.body.date,
      isCurrent: req.body.isCurrent,
      icon: req.body.icon,
      title: req.body.title,
      amount: req.body.amount,
      tags: req.body.tags,
      memo: req.body.memo,
      updateAsset: req.body.updateAsset,
    }
  );

  let transactionScheduled: HydratedDocument<ITransaction> | null = null;

  //  linkedCurrentTransaction
  if (TransactionService.isCurrent(transaction) && req.body.linkId) {
    const { transaction: _transactionScheduled } =
      await TransactionService.findById(req.body.linkId);
    transactionScheduled = _transactionScheduled;

    if (!transactionScheduled)
      return res.status(404).send({ message: NOT_FOUND("transaction") });

    await TransactionService.linkTransaction(transaction, transactionScheduled);
  }

  if (req.body.linkedPaymentMethodId) {
    const { paymentMethod: paymentMethod } = PaymentMethodService.findById(
      req.user!,
      req.body.linkedPaymentMethodId
    );
    if (!paymentMethod)
      return res.status(404).send({ message: NOT_FOUND("paymentMethod") });
    await TransactionService.updatePaymentMethod(transaction, paymentMethod);
  }

  // if pm is used and asset needs to be updated
  if (TransactionService.hasToUpdateAsset(transaction)) {
    await PaymentMethodService.execPaymentMethod(user, transaction);
  }

  await BudgetService.calculate(budget);

  return res.status(200).send({
    transaction,
    transactionScheduled,
    budget,
    assets: TransactionService.hasToUpdateAsset(transaction)
      ? user.assets
      : undefined,
  });
};

export const updateV2 = async (req: Request, res: Response) => {
  const user = req.user!;

  for (let field of [
    "date",
    "icon",
    "title",
    "tags",
    "memo",
    "categoryId",
    "amount",
    "isCurrent",
    "updateAsset",
  ]) {
    if (!(field in req.body))
      return res.status(400).send({
        message: FIELD_REQUIRED(field),
      });
  }

  const transactionId = req.params._id as string;
  const date = new Date(req.body.date);
  const icon = req.body.icon;
  const title = req.body.title;
  const tags = req.body.tags;
  const memo = req.body.memo;
  const categoryId = req.body.categoryId;
  const amount = parseInt(req.body.amount);
  const isCurrent = req.body.isCurrent as boolean;
  const updateAsset = req.body.updateAsset as boolean;
  const linkedPaymentMethodId = req.body.linkedPaymentMethodId as string;

  const { transaction } = await TransactionService.findById(transactionId);
  if (!transaction) throw new TransactionNotFoundError();

  if (!TransactionService.isUser(transaction, user)) throw new Error();

  const { transactionLinked, budget, assets } = await TransactionService.update(
    transaction,
    {
      date,
      icon,
      title,
      tags,
      memo,
      categoryId,
      amount,
      isCurrent,
      updateAsset,
      linkedPaymentMethodId,
    }
  );

  return res.status(200).send({
    transaction,
    transactionLinked,
    budget,
    assets,
  });
};

export const find = async (req: Request, res: Response) => {
  try {
    const user = req.user!;

    if (req.params._id) {
      const transactions = await Transaction.findById(req.params._id);
      return res.status(200).send({ transactions });
    }
    if ("userId" in req.query) {
      if (user.auth !== "admin") {
        return res.status(403).send({ message: NOT_PERMITTED });
      }
      if (req.query.userId === "*") {
        const transactions = await Transaction.find({}).lean();
        return res.status(200).send({ transactions });
      }
      const transactions = await Transaction.find({ userId: user._id }).lean();
      return res.status(200).send({ transactions });
    }
    if ("linkedPaymentMethodId" in req.query) {
      for (let field of ["startDate", "endDate"]) {
        if (!(field in req.query)) {
          return res.status(400).send({ message: FIELD_REQUIRED(field) });
        }
        if (!dateReg.test(`${req.query[field]}`)) {
          return res.status(400).send({ message: FIELD_INVALID(field) });
        }
      }

      const tz = user.settings.timeZone ?? basicTimeZone;
      const startMMT = moment.tz(req.query.startDate, tz);
      const endMMT = moment.tz(req.query.endDate, tz);
      const transactions = await Transaction.find({
        userId: user._id,
        budgetId: { $exists: true, $ne: user.basicBudgetId },
        linkedPaymentMethodId: req.query.linkedPaymentMethodId,
        date: { $gte: startMMT.toDate(), $lt: endMMT.toDate() },
      }).lean();
      return res.status(200).send({
        amountTotal: transactions.reduce((sum, cur) => sum + cur.amount, 0),
        description: {
          gte: `${startMMT.format()}`,
          lt: `${endMMT.format()}`,
        },
        transactions,
      });
    }
    if ("tag" in req.query) {
      const transactions = await Transaction.find({
        userId: user._id,
        budgetId: { $ne: user.basicBudgetId },
        tags: { $elemMatch: { $eq: req.query.tag } },
      });

      return res.status(200).send({
        transactions,
      });
    }
    if (!("budgetId" in req.query))
      return res.status(400).send({
        message: FIELD_REQUIRED("budgetId"),
      });
    const transactions = await Transaction.find({
      userId: user._id,
      budgetId: req.query.budgetId,
    });
    return res.status(200).send({ transactions });
  } catch (err: any) {
    logger.error(err.message);
    return res.status(500).send({ message: err.message });
  }
};

/**
 * Remove transaction
 *
 * @param {_id: oid}
 */
export const remove = async (req: Request, res: Response) => {
  try {
    if (!("_id" in req.params))
      return res.status(400).send({
        message: FIELD_REQUIRED("_id"),
      });

    let user = req.user!;
    const transaction = await Transaction.findById(req.params._id);
    if (!transaction)
      return res.status(404).send({ message: NOT_FOUND("transaction") });

    if (!transaction.userId.equals(user._id)) {
      if (user.auth !== "admin") {
        return res.status(403).send({ message: NOT_PERMITTED });
      }
      const _user = await User.findById(transaction.userId);
      if (!_user) return res.status(404).send({ message: NOT_FOUND("user") });
      user = _user;
    }

    const { budget } = await BudgetService.findById(transaction.budgetId);
    if (!budget) return res.status(404).send({ message: NOT_FOUND("budget") });

    let transactionLinked: HydratedDocument<ITransaction> | null = null;
    if (transaction.linkId) {
      transactionLinked = await Transaction.findById(transaction.linkId);
    }

    let isUserUpdated = false;
    if (
      transaction.isCurrent &&
      transaction.linkedPaymentMethodId &&
      transaction.updateAsset
    ) {
      if (transaction.linkedPaymentMethodType === "asset") {
        const asset = _.find(user.assets, {
          _id: transaction.linkedPaymentMethodId,
        });
        if (asset) {
          asset.amount += transaction.amount;
          isUserUpdated = true;
        }
      } else {
        const card = _.find(user.cards, {
          _id: transaction.linkedPaymentMethodId,
        });
        if (card && card.linkedAssetId) {
          const asset = _.find(user.assets, {
            _id: card.linkedAssetId,
          });
          if (asset) {
            asset.amount += transaction.amount;
            isUserUpdated = true;
          }
        }
      }
    }
    if (isUserUpdated) user.saveReqUser();
    await transaction.remove();

    if (transactionLinked) {
      transactionLinked.linkId = undefined;
      transactionLinked.overAmount = undefined;
      await transactionLinked.save();
    }
    await budget.calculate();

    return res.status(200).send({
      transactionLinked: transactionLinked ?? undefined,
      budget,
      assets: isUserUpdated ? user.assets : undefined,
    });
  } catch (err: any) {
    logger.error(err.message);
    return res.status(500).send({ message: err.message });
  }
};
