import { Request, Response } from "express";
import _ from "lodash";
import { HydratedDocument, Types } from "mongoose";
import { Budget, ICategory } from "../models/Budget";
import { Transaction } from "../models/Transaction";

import { logger } from "../log/logger";
import {
  CATEGORY_CANOT_BE_UPDATED,
  FIELD_INVALID,
  FIELD_REQUIRED,
  INVALID_CATEGORY,
  NOT_PERMITTED,
} from "../@message";

// budget controller
type budgetKeys =
  | "expenseScheduled"
  | "expenseScheduledRemain"
  | "expenseCurrent"
  | "incomeScheduled"
  | "incomeScheduledRemain"
  | "incomeCurrent";
type categoryKeys = "amountPlanned" | "amountScheduled" | "amountCurrent";
export const validate = async (req: Request, res: Response) => {
  try {
    const budget = await Budget.findById(req.params._id);
    if (!budget) {
      return res.status(404).send({ message: "budget not found" });
    }

    const b: { [key: string]: number } = {
      expenseScheduled: 0,
      expenseScheduledRemain: 0,
      expenseCurrent: 0,
      incomeScheduled: 0,
      incomeScheduledRemain: 0,
      incomeCurrent: 0,
    };
    const amountPlanned: { [key: string]: number } = {};
    const amountScheduled: { [key: string]: number } = {};
    const amountCurrent: { [key: string]: number } = {};

    let sumExpensePlanned = 0;
    let sumIncomePlanned = 0;
    for (let category of budget.categories) {
      if (!category.isDefault) {
        if (category.isExpense) sumExpensePlanned += category.amountPlanned;
        else sumIncomePlanned += category.amountPlanned;
      } else {
        amountPlanned[category.categoryId.toString()] = 0;
      }
      amountScheduled[category.categoryId.toString()] = 0;
      amountCurrent[category.categoryId.toString()] = 0;
    }

    const transactions = await Transaction.find({ budgetId: budget._id });

    for (let transaction of transactions) {
      if (!transaction.isCurrent) {
        if (transaction.category.isExpense) {
          b.expenseScheduled += transaction.amount;
          if (!transaction.linkId) {
            b.expenseScheduledRemain += transaction.amount;
          }
        } else {
          b.incomeScheduled += transaction.amount;
          if (!transaction.linkId) {
            b.incomeScheduledRemain += transaction.amount;
          }
        }
        amountScheduled[transaction.category.categoryId.toString()] +=
          transaction.amount;
      } else {
        if (transaction.category.isExpense) {
          b.expenseCurrent += transaction.amount;
        } else {
          b.incomeCurrent += transaction.amount;
        }
        amountCurrent[transaction.category.categoryId.toString()] +=
          transaction.amount;
      }
    }
    amountPlanned[budget.findDefaultExpenseCategory()?.categoryId.toString()] =
      budget.expensePlanned - sumExpensePlanned;
    amountPlanned[budget.findDefaultIncomeCategory()?.categoryId.toString()] =
      budget.incomePlanned - sumIncomePlanned;

    /* validate */
    const invalid: {
      category?: any;
      field: string;
    }[] = [];

    for (let [key, value] of Object.entries(b)) {
      const k = key as budgetKeys;
      if (!(k in budget) || budget[k] !== value) {
        invalid.push({ field: key });
      }
    }

    for (let category of budget.categories) {
      if (
        category.isDefault &&
        category.amountPlanned !== amountPlanned[category.categoryId.toString()]
      ) {
        invalid.push({ category, field: "amountPlanned" });
      }
      if (
        category.amountScheduled !==
        amountScheduled[category.categoryId.toString() ?? ""]
      ) {
        invalid.push({
          category,
          field: "amountScheduled",
        });
      }
      if (
        category.amountCurrent !==
        amountCurrent[category.categoryId.toString() ?? ""]
      ) {
        invalid.push({
          category,
          field: "amountCurrent",
        });
      }
    }

    return res.status(200).send({
      budget,
      invalid,
      b,
      amountPlanned,
      amountScheduled,
      amountCurrent,
    });
  } catch (err: any) {
    logger.error(err.message);
    return res.status(500).send({ message: err.message });
  }
};
export const fix = async (req: Request, res: Response) => {
  try {
    const budget = await Budget.findById(req.params._id);
    if (!budget) {
      return res.status(404).send({ message: "budget not found" });
    }

    const key = req.body.key;
    if (
      key === "expenseScheduled" ||
      key === "expenseScheduledRemain" ||
      key === "expenseCurrent" ||
      key === "incomeScheduled" ||
      key === "incomeScheduledRemain" ||
      key === "incomeCurrent"
    ) {
      const k = key as budgetKeys;
      budget[k] = req.body.amount;
    } else if (
      key === "amountPlanned" ||
      key === "amountScheduled" ||
      key === "amountCurrent"
    ) {
      const k = key as categoryKeys;
      const idx = budget.findCategoryIdx(req.body.categoryId);
      budget.categories[idx][k] = req.body.amount;
    } else {
      return res.status(400).send({ message: FIELD_INVALID("key") });
    }
    budget.isModified("categories");
    await budget.save();

    return res.status(200).send({ budget });
  } catch (err: any) {
    logger.error(err.message);
    return res.status(500).send({ message: err.message });
  }
};

/**
 * Create budget
 *
 * @body { startDate,endDate, title, expensePlanned,incomePlanned,categories}
 * @return budget
 */

export const create = async (req: Request, res: Response) => {
  try {
    const user = req.user!;

    const budget = new Budget({
      userId: user._id,
      startDate: req.body.startDate,
      endDate: req.body.endDate,
      title: req.body.title,
      expensePlanned: req.body.expensePlanned,
      incomePlanned: req.body.incomePlanned,
    });

    let sumExpenseAmountPlanned = 0;
    let sumIncomeAmountPlanned = 0;

    for (let _category of req.body.categories) {
      const category = user.findCategory(_category.categoryId);

      if (!category)
        return res.status(404).send({
          message: `category with _id ${_category.categoryId} not found`,
        });
      if (category.isDefault)
        return res.status(404).send({
          message: `you can't set default category`,
        });

      if (!("amountPlanned" in _category))
        return res
          .status(400)
          .send({ message: FIELD_REQUIRED("amountPlanned") });

      if (category.isExpense)
        sumExpenseAmountPlanned += _category.amountPlanned;
      else sumIncomeAmountPlanned += _category.amountPlanned;

      budget.categories.push({
        ...category,
        categoryId: category._id,
        amountPlanned: _category.amountPlanned,
      });
    }
    const defaultExpenseCategory = user.findDefaultExpenseCategory();
    const defaultIncomeCategory = user.findDefaultIncomeCategory();
    budget.categories.push({
      ...defaultExpenseCategory,
      categoryId: defaultExpenseCategory._id,
      amountPlanned: budget.expensePlanned - sumExpenseAmountPlanned,
    });
    budget.categories.push({
      ...defaultIncomeCategory,
      categoryId: defaultIncomeCategory._id,
      amountPlanned: budget.incomePlanned - sumIncomeAmountPlanned,
    });

    await budget.save();

    return res.status(200).send({ budget });
  } catch (err: any) {
    logger.error(err.message);
    return res.status(500).send({ message: err.message });
  }
};

/**
 * Create budget based on basic budget
 *
 * @body { startDate,endDate, title, expensePlanned,incomePlanned,categories}
 * @return budget
 */
export const createWithBasic = async (req: Request, res: Response) => {
  try {
    for (let field in ["year", "month"]) {
      if (!(field in req.body)) {
        return res.status(400).send({ message: FIELD_REQUIRED(field) });
      }
    }

    const startDate = new Date(req.body.year, req.body.month - 1, 1, 9);
    const lastDate = new Date(req.body.year, req.body.month, 0);
    const endDate = new Date(
      req.body.year,
      req.body.month - 1,
      lastDate.getDate(),
      9
    );

    const user = req.user!;

    const budget = await Budget.findById(user.basicBudgetId);
    if (!budget) return res.status(404).send();

    const transactions = await Transaction.find({
      budgetId: budget._id,
    });

    budget.isNew = true;
    budget._id = new Types.ObjectId();
    budget.title = req.body.title ?? budget.title;
    budget.startDate = startDate;
    budget.endDate = endDate;
    budget.createdAt = undefined;
    budget.updatedAt = undefined;

    const save: Promise<any>[] = [budget.save()];

    for (let transaction of transactions) {
      transaction.isNew = true;
      transaction._id = new Types.ObjectId();
      transaction.budgetId = budget._id;
      transaction.date = new Date(
        req.body.year,
        req.body.month - 1,
        transaction.date.getDate(),
        9
      );
      transaction.createdAt = undefined;
      transaction.updatedAt = undefined;
      save.push(transaction.save());
    }

    await Promise.all(save);

    return res.status(200).send({ budget, transactions });
  } catch (err: any) {
    logger.error(err.message);
    return res.status(500).send({ message: err.message });
  }
};

export const updateCategoriesV3 = async (req: Request, res: Response) => {
  try {
    /* validate */
    if (!("isExpense" in req.body) && !("isIncome" in req.body))
      return res.status(400).send({ message: FIELD_REQUIRED("isExpense") });
    if (!("categories" in req.body))
      return res.status(400).send({ message: FIELD_REQUIRED("categories") });

    const isExpense = "isExpense" in req.body ? req.body.isExpense : false;
    const isIncome = "isIncome" in req.body ? req.body.isIncome : false;
    if (isExpense === isIncome) {
      return res.status(400).send({ message: FIELD_INVALID("isExpense") });
    }

    const user = req.user!;
    const budget = await Budget.findById(req.params._id);
    if (!budget) return res.status(404).send({});
    if (!budget.userId.equals(user._id)) {
      return res.status(403).send({ message: NOT_PERMITTED });
    }

    const categoryDict: { [key: string]: ICategory } = Object.fromEntries(
      budget.categories.map((category) => [
        category.categoryId,
        category.toObject(),
      ])
    );

    const _categories: Types.DocumentArray<ICategory> = new Types.DocumentArray(
      []
    );
    const included: Types.DocumentArray<ICategory> = new Types.DocumentArray(
      []
    );
    const updated: Types.DocumentArray<ICategory> = new Types.DocumentArray([]);
    const excluded: Types.DocumentArray<ICategory> = new Types.DocumentArray(
      []
    );

    let sumDefaultAmountPlanned = 0;

    for (let _category of req.body.categories) {
      if (!("amountPlanned" in _category))
        return res
          .status(400)
          .send({ message: FIELD_REQUIRED("amountPlanned") });
      if (!("categoryId" in _category))
        return res.status(400).send({ message: FIELD_REQUIRED("categoryId") });

      /* include category */
      if (!categoryDict[_category.categoryId]) {
        const category = user.findCategory(_category.categoryId);
        if (!category)
          return res.status(404).send({
            message: "category not found in user.categories",
            category: _category,
          });
        if (category.isDefault)
          return res.status(409).send({
            message: CATEGORY_CANOT_BE_UPDATED,
          });
        if (category.isExpense !== isExpense)
          return res.status(409).send({
            message: INVALID_CATEGORY,
          });

        sumDefaultAmountPlanned += _category.amountPlanned;

        const newCategory = {
          ...category,
          categoryId: category._id,
          amountPlanned: _category.amountPlanned,
        };
        _categories.push(newCategory);
        included.push(newCategory);
      } /* update category */ else {
        const key = _category.categoryId;
        const exCategory = categoryDict[key];
        if (!exCategory)
          return res.status(404).send({
            message: "category not found in budget.categories",
            category: _category,
          });
        if (exCategory.isDefault)
          return res.status(409).send({
            message: CATEGORY_CANOT_BE_UPDATED,
          });
        if (exCategory.isExpense !== isExpense)
          return res.status(409).send({
            message: INVALID_CATEGORY,
          });

        sumDefaultAmountPlanned += _category.amountPlanned;

        const category = {
          ...exCategory,
          amountPlanned: _category.amountPlanned,
        };
        _categories.push(category);
        delete categoryDict[key];

        if (category.amountPlanned !== exCategory.amountPlanned) {
          updated.push(category);
        }
      }
    }
    /* exclude category */
    for (const category of Object.values(categoryDict)) {
      if (!category.isDefault) {
        if (category.isExpense === isExpense) {
          excluded.push(category);
        } else {
          _categories.push(category);
        }
      }
    }

    const defaultExpenseCategory = budget.findDefaultExpenseCategory();
    const defaultIncomeCategory = budget.findDefaultIncomeCategory();
    if (isExpense) {
      _categories.push({
        ...defaultExpenseCategory,
        amountPlanned: budget.expensePlanned - sumDefaultAmountPlanned,
      });
      _categories.push(defaultIncomeCategory);
    } else {
      _categories.push(defaultExpenseCategory);
      _categories.push({
        ...defaultIncomeCategory,
        amountPlanned: budget.expensePlanned - sumDefaultAmountPlanned,
      });
    }
    budget.categories = _categories;

    for (const category of excluded) {
      const transactions = await Transaction.find({
        userId: user._id,
        budgetId: budget._id,
        "category.categoryId": category.categoryId,
      });

      await Promise.all(
        transactions.map((transaction) => {
          if (isExpense) {
            transaction.category = defaultExpenseCategory;
            budget.increaseDefaultExpenseCategory(
              transaction.isCurrent ? "amountCurrent" : "amountScheduled",
              transaction.amount
            );
          } else {
            transaction.category = defaultIncomeCategory;
            budget.increaseDefaultIncomeCategory(
              transaction.isCurrent ? "amountCurrent" : "amountScheduled",
              transaction.amount
            );
          }

          return transaction.save();
        })
      );
    }

    await budget.save();
    return res.status(200).send({
      categories: budget.categories,
      included,
      updated,
      excluded,
    });
  } catch (err: any) {
    logger.error(err.message);
    return res.status(500).send({ message: err.message });
  }
};

/**
 * Update budget category amountPlanned
 *
 * @param {_id, categoryId}
 * @body {  amount }
 * @return budget
 */
export const updateCategoryAmountPlanned = async (
  req: Request,
  res: Response
) => {
  try {
    if (!("amountPlanned" in req.body))
      return res.status(400).send({ message: FIELD_REQUIRED("amountPlanned") });

    const user = req.user!;
    const budget = await Budget.findById(req.params._id);
    if (!budget) return res.status(404).send({ message: "budget not found" });
    if (!budget.userId.equals(user._id))
      return res.status(403).send({ message: NOT_PERMITTED });

    const categoryIdx = budget.findCategoryIdx(
      req.params.categoryId.toString()
    );
    const category = budget.categories[categoryIdx];
    if (!category)
      return res.status(404).send({
        message: `budget category not found`,
      });

    if (category.isDefault)
      return res.status(409).send({
        message: CATEGORY_CANOT_BE_UPDATED,
      });

    if (category.isExpense) {
      budget.increaseDefaultExpenseCategory(
        "amountPlanned",
        category.amountPlanned - req.body.amountPlanned
      );
    } else {
      budget.increaseDefaultIncomeCategory(
        "amountPlanned",
        category.amountPlanned - req.body.amountPlanned
      );
    }

    budget.categories[categoryIdx].amountPlanned = req.body.amountPlanned;
    await budget.save();

    return res.status(200).send({ budget });
  } catch (err: any) {
    logger.error(err.message);
    return res.status(500).send({ message: err.message });
  }
};

/**
 * Update budget fields
 *
 * @body { startDate?, endDate? title?, expensePlanned?, incomePlanned?}
 * @return budget
 */
export const updateField = async (req: Request, res: Response) => {
  try {
    const user = req.user!;
    const budget = await Budget.findById(req.params._id);
    if (!budget) return res.status(404).send({});
    if (!budget.userId.equals(user._id))
      return res.status(403).send({ message: NOT_PERMITTED });

    budget.startDate = req.body.startDate ?? budget.startDate;
    budget.endDate = req.body.endDate ?? budget.endDate;
    budget.title = req.body.title ?? budget.title;
    if ("expensePlanned" in req.body) {
      budget.increaseDefaultExpenseCategory(
        "amountPlanned",
        req.body.expensePlanned - budget.expensePlanned
      );
      budget.expensePlanned = req.body.expensePlanned;
    }
    if ("incomePlanned" in req.body) {
      budget.increaseDefaultIncomeCategory(
        "amountPlanned",
        req.body.incomePlanned - budget.incomePlanned
      );
      budget.incomePlanned = req.body.incomePlanned;
    }
    await budget.save();

    return res.status(200).send({ budget });
  } catch (err: any) {
    logger.error(err.message);
    return res.status(500).send({ message: err.message });
  }
};

/**
 * Find budget
 *
 * @param { _id?}
 * @return budget or budgets
 */
export const find = async (req: Request, res: Response) => {
  try {
    const user = req.user!;

    if (req.params._id) {
      const budget = await Budget.findById(req.params._id);
      if (!budget) return res.status(404).send();
      if (!budget.userId.equals(user._id)) {
        if (user.auth !== "admin") {
          return res.status(403).send({ message: NOT_PERMITTED });
        }
      }

      const transactions = await Transaction.find({
        budgetId: budget._id,
      }).lean();
      return res.status(200).send({ budget, transactions });
    }
    if ("year" in req.query) {
      const year = parseInt(req.query.year as string);
      if ("month" in req.query) {
        const month = parseInt(req.query.month as string);
        const budget = await Budget.findOne({
          userId: user._id,
          startDate: new Date(year, month - 1, 1, 9),
        });
        if (!budget) {
          return res.status(404).send({ message: "budget not found" });
        }
        return res.status(200).send({ budget });
      }
      const budgets = await Budget.find({
        userId: user._id,
        startDate: {
          $gte: new Date(year, 0, 1, 9),
          $lte: new Date(year, 11, 1, 9),
        },
      });
      return res.status(200).send({ budgets });
    }
    if ("userId" in req.query) {
      if (user.auth !== "admin") {
        return res.status(403).send({ message: NOT_PERMITTED });
      }
      if (req.query.userId === "*") {
        const budgets = await Budget.find({}).lean();
        return res.status(200).send({ budgets });
      }
      const budgets = await Budget.find({ userId: req.query.userId }).lean();
      return res.status(200).send({ budgets });
    }

    const budgets = await Budget.find({ userId: user._id });
    return res.status(200).send({ budgets });
  } catch (err: any) {
    logger.error(err.message);
    return res.status(500).send({ message: err.message });
  }
};

/**
 * Remove budget
 *
 * @param { _id}
 */
export const remove = async (req: Request, res: Response) => {
  try {
    const user = req.user!;
    const budget = await Budget.findById(req.params._id);
    if (!budget) return res.status(404).send();

    if (!budget.userId.equals(user._id)) {
      if (user.auth !== "admin") {
        return res.status(403).send({ message: NOT_PERMITTED });
      }
    }

    await Transaction.deleteMany({ budgetId: budget._id });
    await budget.remove();
    return res.status(200).send();
  } catch (err: any) {
    logger.error(err.message);
    return res.status(500).send({ message: err.message });
  }
};
