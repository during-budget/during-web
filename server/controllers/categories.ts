import { Request, Response } from "express";
import _ from "lodash";
import { Budget } from "../models/Budget";
import { Transaction } from "../models/Transaction";

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
    await user.save();

    const { updated, added, removed } = compareCategories(
      _categories,
      user.categories,
      (c1, c2) => c1?.title === c2?.title && c1?.icon === c2?.icon
    );

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

      await Promise.all([
        budgets.forEach((budget) => {
          const idx = budget.findCategoryIdx(category._id!);
          budget.categories.splice(idx, 1);
          budget.save();
        }),
        transactions.forEach((transaction) => {
          if (transaction.category.isExpense) {
            transaction.category = {
              ...defaultExpenseCategory,
              categoryId: defaultExpenseCategory._id,
            };
          } else {
            transaction.category = {
              ...defaultIncomeCategory,
              categoryId: defaultIncomeCategory._id,
            };
          }

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
