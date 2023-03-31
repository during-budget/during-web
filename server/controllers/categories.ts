import { Request, Response } from "express";
import _ from "lodash";
import { HydratedDocument } from "mongoose";
import { Budget } from "../models/Budget";
import { ITransaction, Transaction } from "../models/Transaction";

import { compareCategories } from "../utils/compare";

// category settings controller

export const updateV2 = async (req: Request, res: Response) => {
  try {
    if (!("categories" in req.body))
      return res
        .status(409)
        .send({ message: "field 'categories' is required" });

    const user = req.user!;

    const _categories = user.categories;
    const defaultExpenseCategory = user.findDefaultExpenseCategory();
    const defaultIncomeCategory = user.findDefaultIncomeCategory();
    user.categories = [
      ...req.body.categories,
      defaultExpenseCategory,
      defaultIncomeCategory,
    ];
    await user.saveReqUser();

    const { updated, added, removed } = compareCategories({
      prevArr: _categories,
      newArr: user.categories,
      compareFunc: (c1, c2) => c1?.title === c2?.title && c1?.icon === c2?.icon,
    });

    for (const category of updated) {
      // update budgets and transactions categories

      const budgets = await Budget.find({
        userId: user._id,
        "categories.categoryId": category._id,
      });
      const transactions = await Transaction.find({
        userId: user._id,
        "category.categoryId": category._id,
      });

      await Promise.all([
        budgets.forEach((budget) => {
          const idx = budget.findCategoryIdx(category._id!);
          Object.assign(budget.categories[idx], {
            ...category,
            categoryId: category._id!,
          });
          budget.save();
        }),
        transactions.forEach((transaction) => {
          transaction.category = {
            ...category,
            categoryId: category._id!,
          };
          transaction.save();
        }),
      ]);
    }

    for (const category of removed) {
      const budgets = await Budget.find({
        userId: user._id,
        "categories.categoryId": category._id,
      });
      const transactions = await Transaction.find({
        userId: user._id,
        "category.categoryId": category._id,
      });

      const transactionsDict: {
        [key: string]: HydratedDocument<ITransaction>[];
      } = _.groupBy(transactions, "budgetId");

      for (let budget of budgets) {
        for (let transaction of transactionsDict[budget._id.toString()]) {
          if (transaction.category.isExpense) {
            const category = budget.findCategory(
              transaction.category.categoryId
            );
            budget.increaseDefaultExpenseCategory(
              "amountPlanned",
              category?.amountPlanned ?? 0
            );
            budget.increaseDefaultExpenseCategory(
              transaction.isCurrent ? "amountCurrent" : "amountScheduled",
              transaction.amount
            );

            transaction.category = {
              ...defaultExpenseCategory,
              categoryId: defaultExpenseCategory._id,
            };
          } else {
            const category = budget.findCategory(
              transaction.category.categoryId
            );
            budget.increaseDefaultIncomeCategory(
              "amountPlanned",
              category?.amountPlanned ?? 0
            );
            budget.increaseDefaultIncomeCategory(
              transaction.isCurrent ? "amountCurrent" : "amountScheduled",
              transaction.amount
            );

            transaction.category = {
              ...defaultIncomeCategory,
              categoryId: defaultIncomeCategory._id,
            };
          }
        }
      }

      await Promise.all([
        budgets.forEach((budget) => {
          const idx = budget.findCategoryIdx(category._id!);
          budget.categories.splice(idx, 1);
          budget.save();
        }),
        transactions.forEach((transaction) => {
          transaction.save();
        }),
      ]);
    }

    return res.status(200).send({ updated, added, removed });
  } catch (err: any) {
    return res.status(500).send({ message: err.message });
  }
};

/**
 * Read user's category settings
 *
 * @return categories
 */
export const find = async (req: Request, res: Response) => {
  try {
    const user = req.user!;

    return res.status(200).send({ categories: user.categories });
  } catch (err: any) {
    return res.status(500).send({ message: err.message });
  }
};
