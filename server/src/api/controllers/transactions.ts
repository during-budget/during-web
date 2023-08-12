import { Request, Response } from "express";
import _ from "lodash";
import { Budget, IBudget, IBudgetProps } from "@models/Budget";
import { ITransaction, Transaction } from "@models/Transaction";
import { HydratedDocument, Types } from "mongoose";
import moment from "moment-timezone";

import { logger } from "src/loggers";
import { User } from "@models/User";
import {
  CATEGORY_CANOT_BE_UPDATED,
  FIELD_INVALID,
  FIELD_REQUIRED,
  NOT_FOUND,
  NOT_PERMITTED,
} from "../message";
import { basicTimeZone } from "@models/_basicSettings";

// transaction controller

/**
 * Create transaction
 *
 * @body { budgetId, date, isCurrent, isExpense, isIncome, title: [String], amount: Number, categoryId, tags?, memo?, linkId?}
 * @return transaction
 */

const dateReg = new RegExp("[0-9]{4}[-][0-9]{2}[-][0-9]{2}");

export const create = async (req: Request, res: Response) => {
  try {
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

    const budget = await Budget.findById(req.body.budgetId);
    if (!budget) return res.status(404).send({ message: NOT_FOUND("budget") });

    const category = _.find(budget.categories, {
      categoryId: new Types.ObjectId(req.body.categoryId),
    });
    if (!category)
      return res.status(404).send({ message: NOT_FOUND("category") });

    const transaction = new Transaction({
      userId: user._id,
      budgetId: budget._id,
      date: req.body.date,
      isCurrent: req.body.isCurrent,
      isExpense: category.isExpense,
      isIncome: category.isIncome,
      linkId: req.body.linkId,
      icon: req.body.icon ?? "",
      title: req.body.title,
      amount: req.body.amount,
      category,
      tags: req.body.tags ?? [],
      memo: req.body.memo ?? "",
      updateAsset: "updateAsset" in req.body ? req.body.updateAsset : true,
    });

    let isUserUpdated = false;
    let transactionScheduled: HydratedDocument<ITransaction> | null = null;

    //  linkedCurrentTransaction
    if (transaction.isCurrent && transaction?.linkId) {
      transactionScheduled = await Transaction.findByIdAndUpdate(
        { _id: transaction.linkId },
        { linkId: transaction._id },
        { new: true }
      );
      if (!transactionScheduled)
        return res.status(404).send({ message: NOT_FOUND("transaction") });
      transaction.overAmount = transaction.amount - transactionScheduled.amount;
    }
    if (req.body.linkedPaymentMethodId) {
      const pm = _.find(user.paymentMethods, {
        _id: new Types.ObjectId(req.body.linkedPaymentMethodId),
      });
      if (!pm) return res.status(404).send({ message: NOT_FOUND("PM") });
      transaction.linkedPaymentMethodId = pm._id;
      transaction.linkedPaymentMethodType = pm.type;
      transaction.linkedPaymentMethodIcon = pm.icon;
      transaction.linkedPaymentMethodTitle = pm.title;
      transaction.linkedPaymentMethodDetail = pm.detail;
    }
    await transaction.save();

    // if pm is used and asset needs to be updated
    if (
      transaction.isCurrent &&
      transaction.linkedPaymentMethodId &&
      transaction.updateAsset
    ) {
      isUserUpdated = user.execPM({
        linkedPaymentMethodId: transaction.linkedPaymentMethodId,
        linkedPaymentMethodType: transaction.linkedPaymentMethodType!,
        amount: transaction.amount,
        isExpense: transaction.isExpense!,
      });
      if (isUserUpdated) await user.saveReqUser();
    }
    await budget.calculate();

    return res.status(200).send({
      transaction,
      transactionScheduled: transactionScheduled ?? undefined,
      budget,
      assets: isUserUpdated ? user.assets : undefined,
    });
  } catch (err: any) {
    logger.error(err.message);
    return res.status(500).send({ message: err.message });
  }
};

/**
 * Update transaction
 * @body { categoryId }
 * @return transaction
 */
const updateV2BodyFields = [
  "date",
  "icon",
  "title",
  "tags",
  "memo",
  "categoryId",
  "amount",
  "isCurrent",
  "updateAsset",
];
export const updateV2 = async (req: Request, res: Response) => {
  try {
    for (let field of updateV2BodyFields) {
      if (!(field in req.body))
        return res.status(400).send({
          message: FIELD_REQUIRED(field),
        });
    }

    const user = req.user!;
    const transaction = await Transaction.findById(req.params._id);
    if (!transaction)
      return res.status(404).send({ message: NOT_FOUND("transaction") });
    if (!transaction.userId.equals(user._id))
      return res.status(403).send({ message: NOT_PERMITTED });

    const budget = await Budget.findById(transaction.budgetId);
    if (!budget) return res.status(404).send({ message: NOT_FOUND("budget") });

    /* update date, icon, title, tags, memo */
    transaction.date = req.body.date;
    transaction.icon = req.body.icon;
    transaction.title = req.body.title;
    transaction.tags = req.body.tags;
    transaction.memo = req.body.memo;

    /* update categoryId, amount,isExpense, isCurrent */
    const isUpdated: { [key: string]: boolean } = {
      categoryId:
        transaction.category.categoryId.toString() !== req.body.categoryId,
      amount: transaction.amount !== req.body.amount,
      isCurrent: transaction.isCurrent !== req.body.isCurrent,
      linkedPaymentMethodId: transaction.linkedPaymentMethodId
        ? transaction.linkedPaymentMethodId.toString() !==
          req.body?.linkedPaymentMethodId
        : "linkedPaymentMethodId" in req.body,
      user: false,
      transactionLinked: false,
    };

    let transactionLinked: HydratedDocument<ITransaction> | null = null;

    const exUpdateAsset = transaction.updateAsset;
    transaction.updateAsset = req.body.updateAsset;
    isUpdated["updateAsset"] = exUpdateAsset !== transaction.updateAsset;

    if (
      isUpdated["categoryId"] ||
      isUpdated["amount"] ||
      isUpdated["isCurrent"]
    ) {
      if (transaction?.linkId) {
        transactionLinked = await Transaction.findById(transaction.linkId);
        if (!transactionLinked) {
          return res.status(404).send({ message: NOT_FOUND("transaction") });
        }
      }

      if (isUpdated["categoryId"]) {
        const newCategoryIdx = budget.findCategoryIdx(req.body.categoryId);
        if (newCategoryIdx === -1)
          return res.status(404).send({ message: NOT_FOUND("category") });
        const newCategory = budget.categories[newCategoryIdx];

        transaction.isExpense = newCategory.isExpense;
        transaction.isIncome = newCategory.isIncome;
        transaction.category = {
          ...newCategory,
        };

        if (transactionLinked) {
          transactionLinked.isExpense = newCategory.isExpense;
          transactionLinked.isIncome = newCategory.isIncome;
          transactionLinked.category = {
            ...newCategory,
          };
          isUpdated["transactionLinked"] = true;
        }
      }

      if (isUpdated["amount"]) {
        const exAmount = transaction.amount;
        const diff = req.body.amount - exAmount;
        transaction.amount = req.body.amount;

        // 1. scheduled transaction
        if (!transaction.isCurrent) {
          if (transactionLinked) {
            transactionLinked.overAmount =
              (transactionLinked.overAmount ?? 0) - diff;
            isUpdated["transactionLinked"] = true;
          }
        }
        // 2. current transaction
        else {
          if (transactionLinked) {
            transaction.overAmount = (transaction.overAmount ?? 0) + diff;
          }

          if (transaction.linkedPaymentMethodId) {
            let isUserUpdated1 = false;
            let isUserUpdated2 = false;
            if (exUpdateAsset) {
              isUserUpdated1 = user.cancelPM({
                linkedPaymentMethodId: transaction.linkedPaymentMethodId,
                linkedPaymentMethodType: transaction.linkedPaymentMethodType!,
                amount: exAmount,
                isExpense: transaction.isExpense!,
              });
            }
            if (transaction.updateAsset) {
              isUserUpdated2 = user.execPM({
                linkedPaymentMethodId: transaction.linkedPaymentMethodId,
                linkedPaymentMethodType: transaction.linkedPaymentMethodType!,
                amount: transaction.amount,
                isExpense: transaction.isExpense!,
              });
            }

            if (isUserUpdated1 || isUserUpdated2) isUpdated["user"] = true;
          }
        }
      }

      if (isUpdated["isCurrent"]) {
        if (transaction.linkId) {
          return res.status(409).send({
            message: CATEGORY_CANOT_BE_UPDATED,
          });
        }

        // 1. current -> scheduled
        if (transaction.isCurrent) {
          if (transaction.linkedPaymentMethodId && exUpdateAsset) {
            const isUserUpdated = user.cancelPM({
              linkedPaymentMethodId: transaction.linkedPaymentMethodId,
              linkedPaymentMethodType: transaction.linkedPaymentMethodType!,
              amount: transaction.amount,
              isExpense: transaction.isExpense!,
            });
            if (isUserUpdated) isUpdated["user"] = true;
          }
        }
        // 2. scheduled -> current
        else {
          if (transaction.linkedPaymentMethodId && transaction.updateAsset) {
            const isUserUpdated = user.execPM({
              linkedPaymentMethodId: transaction.linkedPaymentMethodId,
              linkedPaymentMethodType: transaction.linkedPaymentMethodType!,
              amount: transaction.amount,
              isExpense: transaction.isExpense!,
            });
            if (isUserUpdated) isUpdated["user"] = true;
          }
        }

        transaction.isCurrent = req.body.isCurrent;
      }

      if (isUpdated["transactionLinked"]) {
        await transactionLinked?.save();
      }
    }
    if (isUpdated["linkedPaymentMethodId"]) {
      // cancel ex paymentMethod
      if (
        transaction.isCurrent &&
        transaction.linkedPaymentMethodId &&
        exUpdateAsset
      ) {
        const isUserUpdated = user.cancelPM({
          linkedPaymentMethodId: transaction.linkedPaymentMethodId,
          linkedPaymentMethodType: transaction.linkedPaymentMethodType!,
          amount: transaction.amount,
          isExpense: transaction.isExpense!,
        });
        if (isUserUpdated) isUpdated["user"] = true;
      }

      // => id1
      if (req.body.linkedPaymentMethodId) {
        const pm = _.find(user.paymentMethods, {
          _id: new Types.ObjectId(req.body.linkedPaymentMethodId),
        });
        if (!pm) {
          return res.status(404).send({ message: NOT_FOUND("PM") });
        }
        transaction.linkedPaymentMethodId = pm._id;
        transaction.linkedPaymentMethodType = pm.type;
        transaction.linkedPaymentMethodIcon = pm.icon;
        transaction.linkedPaymentMethodTitle = pm.title;
        transaction.linkedPaymentMethodDetail = pm.detail;

        if (transaction.isCurrent && transaction.updateAsset) {
          const isUserUpdated = user.execPM({
            linkedPaymentMethodId: transaction.linkedPaymentMethodId,
            linkedPaymentMethodType: transaction.linkedPaymentMethodType,
            amount: transaction.amount,
            isExpense: transaction.isExpense!,
          });
          if (isUserUpdated) isUpdated["user"] = true;
        }
      }
      // => undefined
      else {
        transaction.linkedPaymentMethodId = undefined;
        transaction.linkedPaymentMethodType = undefined;
        transaction.linkedPaymentMethodIcon = undefined;
        transaction.linkedPaymentMethodTitle = undefined;
      }
    }
    if (
      isUpdated["updateAsset"] &&
      !isUpdated["amount"] &&
      !isUpdated["isCurrent"] &&
      !isUpdated["linkedPaymentMethodId"] &&
      transaction.isCurrent &&
      transaction.linkedPaymentMethodId
    ) {
      // false -> true
      if (transaction.updateAsset) {
        const isUserUpdated = user.execPM({
          linkedPaymentMethodId: transaction.linkedPaymentMethodId,
          linkedPaymentMethodType: transaction.linkedPaymentMethodType!,
          amount: transaction.amount,
          isExpense: transaction.isExpense!,
        });
        if (isUserUpdated) isUpdated["user"] = true;
      }
      // true -> false
      else {
        const isUserUpdated = user.cancelPM({
          linkedPaymentMethodId: transaction.linkedPaymentMethodId,
          linkedPaymentMethodType: transaction.linkedPaymentMethodType!,
          amount: transaction.amount,
          isExpense: transaction.isExpense!,
        });
        if (isUserUpdated) isUpdated["user"] = true;
      }
    }

    if (isUpdated["user"]) await user.saveReqUser();
    await transaction.save();
    await budget.calculate();

    return res.status(200).send({
      transaction,
      transactionLinked: isUpdated["transactionLinked"]
        ? transactionLinked
        : undefined,
      budget: budget ?? undefined,
      assets: isUpdated["user"] ? user.assets : undefined,
    });
  } catch (err: any) {
    logger.error(err.message);
    return res.status(500).send({ message: err.message });
  }
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

    const budget = await Budget.findById(transaction.budgetId);
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
