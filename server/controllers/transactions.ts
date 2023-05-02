import { Request, Response } from "express";
import _ from "lodash";
import { Budget, IBudget, IBudgetProps } from "../models/Budget";
import { ITransaction, Transaction } from "../models/Transaction";
import { HydratedDocument, Types } from "mongoose";

import { logger } from "../log/logger";

// transaction controller

/**
 * Create transaction
 *
 * @body { budgetId, date, isCurrent, isExpense, isIncome, title: [String], amount: Number, categoryId, tags?, memo?, linkId?}
 * @return transaction
 */

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
        return res.status(400).send({
          message: `fields(budgetId, date, isCurrent, title, amount, categoryId) are required`,
        });
    const user = req.user!;

    const budget = await Budget.findById(req.body.budgetId);
    if (!budget)
      return res
        .status(404)
        .send({ message: `budget(${req.body.budgetId}) not found` });

    const category = _.find(budget.categories, {
      categoryId: new Types.ObjectId(req.body.categoryId),
    });
    if (!category)
      return res.status(404).send({
        message: `category(${req.body.categoryId}) not found in budget`,
      });

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
    if (transaction.isCurrent && transaction?.linkId) {
      transactionScheduled = await Transaction.findByIdAndUpdate(
        { _id: transaction.linkId },
        { linkId: transaction._id }
      );
      if (!transactionScheduled) return res.status(404).send({});
      transaction.overAmount = transaction.amount - transactionScheduled.amount;
    }
    if (req.body.linkedPaymentMethodId) {
      const pm = _.find(user.paymentMethods, {
        _id: new Types.ObjectId(req.body.linkedPaymentMethodId),
      });
      if (!pm)
        return res.status(404).send({ message: "paymentMethod not found" });
      transaction.linkedPaymentMethodId = pm._id;
      transaction.linkedPaymentMethodType = pm.type;
      transaction.linkedPaymentMethodIcon = pm.icon;
      transaction.linkedPaymentMethodTitle = pm.title;
      transaction.linkedPaymentMethodDetail = pm.detail;
    }
    await transaction.save();

    // 1. scheduled transaction
    if (!transaction.isCurrent) {
      category.amountScheduled += transaction.amount;

      // 1-1. expense transaction
      if (transaction.isExpense) budget.expenseScheduled += transaction.amount;
      // 1-2. income transaction
      else budget.incomeScheduled += transaction.amount;
    }
    // 2. current transaction
    else {
      category.amountCurrent += transaction.amount;

      // 2-1. expense transaction
      if (transaction.isExpense) budget.expenseCurrent += transaction.amount;
      // 2-2. income transaction
      else budget.incomeCurrent += transaction.amount;

      if (transaction.linkedPaymentMethodId && transaction.updateAsset) {
        isUserUpdated = user.execPM({
          linkedPaymentMethodId: transaction.linkedPaymentMethodId,
          linkedPaymentMethodType: transaction.linkedPaymentMethodType!,
          amount: transaction.amount,
          isExpense: transaction.isExpense!,
        });
        if (isUserUpdated) await user.saveReqUser();
      }
    }
    await budget.save();

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
          message: `field(${field}) is missing; require ${_.join(
            updateV2BodyFields,
            ", "
          )}`,
        });
    }

    const user = req.user!;
    const transaction = await Transaction.findById(req.params._id);
    if (!transaction)
      return res.status(404).send({ message: "transaction not found" });
    if (!transaction.userId.equals(user._id)) return res.status(401).send();

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
      isExpense: false,
      linkedPaymentMethodId: transaction.linkedPaymentMethodId
        ? transaction.linkedPaymentMethodId.toString() !==
          req.body?.linkedPaymentMethodId
        : "linkedPaymentMethodId" in req.body,
      user: false,
      transactionLinked: false,
    };

    let budget: HydratedDocument<IBudget, IBudgetProps> | null = null;
    let transactionLinked: HydratedDocument<ITransaction> | null = null;

    const exUpdateAsset = transaction.updateAsset;
    transaction.updateAsset = req.body.updateAsset;
    isUpdated["updateAsset"] = exUpdateAsset !== transaction.updateAsset;

    if (
      isUpdated["categoryId"] ||
      isUpdated["amount"] ||
      isUpdated["isCurrent"]
    ) {
      budget = await Budget.findById(transaction.budgetId);
      if (!budget)
        return res
          .status(404)
          .send({ message: `budget(${transaction.budgetId}) not found` });

      if (transaction?.linkId) {
        transactionLinked = await Transaction.findById(transaction.linkId);
        if (!transactionLinked) {
          return res
            .status(404)
            .send({ message: "linked transaction not found " });
        }
      }

      if (isUpdated["categoryId"]) {
        const oldCategoryIdx = budget.findCategoryIdx(
          transaction.category.categoryId
        );
        if (oldCategoryIdx === -1)
          return res.status(404).send({
            message: `old category(${transaction.category.categoryId}) not found in budget`,
            transaction,
          });
        const oldCategory = budget.categories[oldCategoryIdx];

        const newCategoryIdx = budget.findCategoryIdx(req.body.categoryId);
        if (newCategoryIdx === -1)
          return res.status(404).send({
            message: `category(${req.body.categoryId}) not found in budget`,
            transaction,
          });
        const newCategory = budget.categories[newCategoryIdx];

        if (transaction.isExpense !== newCategory.isExpense) {
          isUpdated["isExpense"] = true;
        }

        // 1. scheduled transaction
        if (!transaction.isCurrent) {
          oldCategory.amountScheduled -= transaction.amount;
          newCategory.amountScheduled += transaction.amount;

          if (isUpdated["isExpense"]) {
            // 1-1. isExpense -> isIncome
            if (transaction.isExpense) {
              budget.expenseScheduled -= transaction.amount;
              budget.incomeScheduled += transaction.amount;
            }
            // 1-2. isIncome -> isExpense
            else {
              budget.incomeScheduled -= transaction.amount;
              budget.expenseScheduled += transaction.amount;
            }
          }
        }
        // 2. current transaction
        else {
          oldCategory.amountCurrent -= transaction.amount;
          newCategory.amountCurrent += transaction.amount;

          if (isUpdated["isExpense"]) {
            // 1-1. isExpense -> isIncome
            if (transaction.isExpense) {
              budget.expenseCurrent -= transaction.amount;
              budget.incomeCurrent += transaction.amount;
            }
            // 1-2. isIncome -> isExpense
            else {
              budget.incomeCurrent -= transaction.amount;
              budget.expenseCurrent += transaction.amount;
            }
          }
        }

        transaction.isExpense = newCategory.isExpense;
        transaction.isIncome = newCategory.isIncome;
        transaction.category = {
          ...newCategory,
        };

        if (transactionLinked) {
          // 1. scheduled transaction
          if (!transactionLinked.isCurrent) {
            oldCategory.amountScheduled -= transactionLinked.amount;
            newCategory.amountScheduled += transactionLinked.amount;

            if (isUpdated["isExpense"]) {
              // 1-1. isExpense -> isIncome
              if (transactionLinked.category.isExpense) {
                budget.expenseScheduled -= transactionLinked.amount;
                budget.incomeScheduled += transactionLinked.amount;
              }
              // 1-2. isIncome -> isExpense
              else {
                budget.incomeScheduled -= transactionLinked.amount;
                budget.expenseScheduled += transactionLinked.amount;
              }
            }
          }
          // 2. current transaction
          else {
            oldCategory.amountCurrent -= transactionLinked.amount;
            newCategory.amountCurrent += transactionLinked.amount;

            if (isUpdated["isExpense"]) {
              // 1-1. isExpense -> isIncome
              if (transactionLinked.category.isExpense) {
                budget.expenseCurrent -= transactionLinked.amount;
                budget.incomeCurrent += transactionLinked.amount;
              }
              // 1-2. isIncome -> isExpense
              else {
                budget.incomeCurrent -= transactionLinked.amount;
                budget.expenseCurrent += transactionLinked.amount;
              }
            }
          }

          transactionLinked.isExpense = newCategory.isExpense;
          transactionLinked.isIncome = newCategory.isIncome;
          transactionLinked.category = {
            ...newCategory,
          };
          isUpdated["transactionLinked"] = true;
        }

        budget.categories[oldCategoryIdx] = oldCategory;
        budget.categories[newCategoryIdx] = newCategory;
      }

      if (isUpdated["amount"]) {
        const exAmount = transaction.amount;
        const diff = req.body.amount - exAmount;
        transaction.amount = req.body.amount;

        /* category */
        const categoryIdx = budget.findCategoryIdx(
          transaction.category.categoryId
        );
        if (categoryIdx === -1)
          return res.status(404).send({
            message: `category(${transaction.category.categoryId}) not found in budget`,
            transaction,
          });

        const category = budget.categories[categoryIdx];

        // 1. scheduled transaction
        if (!transaction.isCurrent) {
          if (transactionLinked) {
            transactionLinked.overAmount =
              (transactionLinked.overAmount ?? 0) - diff;
            isUpdated["transactionLinked"] = true;
          }
          category.amountScheduled += diff;

          // 1-1. expense transaction
          if (transaction.isExpense) budget.expenseScheduled += diff;
          // 1-2. income transaction
          else budget.incomeScheduled += diff;
        }
        // 2. current transaction
        else {
          if (transactionLinked) {
            transaction.overAmount = (transaction.overAmount ?? 0) + diff;
          }
          category.amountCurrent += diff;

          // 2-1. expense transaction
          if (transaction.isExpense) budget.expenseCurrent += diff;
          // 2-2. income transaction
          else budget.incomeCurrent += diff;

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

        budget.categories[categoryIdx] = category;
      }

      if (isUpdated["isCurrent"]) {
        if (transaction.linkId) {
          return res.status(409).send({
            message: "you cannot update 'isCurrent' of linked transaction",
          });
        }
        const categoryIdx = budget.findCategoryIdx(
          transaction.category.categoryId
        );
        if (categoryIdx === -1)
          return res.status(404).send({
            message: `category(${transaction.category.categoryId}) not found in budget`,
            transaction,
          });

        const category = budget.categories[categoryIdx];

        // 1. current -> scheduled
        if (transaction.isCurrent) {
          category.amountCurrent -= transaction.amount;
          category.amountScheduled += transaction.amount;
          // 1-1. expense category
          if (transaction.isExpense) {
            budget.expenseCurrent -= transaction.amount;
            budget.expenseScheduled += transaction.amount;
          }
          // 1-1. income category
          else {
            budget.incomeCurrent -= transaction.amount;
            budget.incomeScheduled += transaction.amount;
          }

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
          category.amountScheduled -= transaction.amount;
          category.amountCurrent += transaction.amount;
          // 2-1. expense category
          if (transaction.isExpense) {
            budget.expenseScheduled -= transaction.amount;
            budget.expenseCurrent += transaction.amount;
          }
          // 2-1. income category
          else {
            budget.incomeScheduled -= transaction.amount;
            budget.incomeCurrent += transaction.amount;
          }

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
        budget.categories[categoryIdx] = category;
      }

      budget.isModified("categories");
      if (isUpdated["transactionLinked"]) {
        await transactionLinked?.save();
      }
      await budget.save();
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
          return res.status(404).send({ message: "paymentMethod not found" });
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
    if (!("budgetId" in req.query))
      return res.status(409).send({
        message: `query budgetId is required`,
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
      return res.status(409).send({
        message: `parameter _id is required`,
      });

    const user = req.user!;
    const transaction = await Transaction.findById(req.params._id);
    if (!transaction)
      return res.status(404).send({ message: "transaction not found" });

    // if (!transaction.userId.equals(user._id)) return res.status(401).send();

    const budget = await Budget.findById(transaction.budgetId);
    if (!budget)
      return res
        .status(404)
        .send({ message: `budget(${transaction.budgetId}) not found` });

    const categoryIdx = budget.findCategoryIdx(transaction.category.categoryId);
    if (categoryIdx === -1)
      return res.status(404).send({
        message: `category(${transaction.category.categoryId}) not found in budget`,
        transaction,
      });

    const category = budget.categories[categoryIdx];

    // 1. scheduled transaction
    if (!transaction.isCurrent) {
      category.amountScheduled -= transaction.amount;

      // 1-1. expense transaction
      if (transaction.isExpense) budget.expenseScheduled -= transaction.amount;
      // 1-2. income transaction
      else budget.incomeScheduled -= transaction.amount;
    }
    // 2. current transaction
    else {
      category.amountCurrent -= transaction.amount;

      // 2-1. expense transaction
      if (transaction.isExpense) budget.expenseCurrent -= transaction.amount;
      // 2-2. income transaction
      else budget.incomeCurrent -= transaction.amount;
    }

    let isUserUpdated = false;
    if (transaction.isCurrent && transaction.linkedPaymentMethodId) {
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

    budget.categories[categoryIdx] = category;
    budget.isModified("categories");
    await budget.save();

    let transactionLinked: HydratedDocument<ITransaction> | null = null;
    if (transaction.linkId) {
      transactionLinked = await Transaction.findById(transaction.linkId);
      if (transactionLinked) {
        transactionLinked.linkId = undefined;
        transactionLinked.overAmount = undefined;
        await transactionLinked.save();
      }
    }

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
