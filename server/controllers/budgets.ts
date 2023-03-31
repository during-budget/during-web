import { Request, Response } from "express";
import _ from "lodash";
import { HydratedDocument, Types } from "mongoose";
import { Budget, ICategory } from "../models/Budget";
import { Transaction } from "../models/Transaction";
import { compareCategories } from "../utils/compare";

// budget controller

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
          .send({ message: "field 'amountPlanned' is required" });

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
    if (!("year" in req.body) || !("month" in req.body)) {
      return res.status(400).send({ message: "body(year, month) is missing" });
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
    return res.status(500).send({ message: err.message });
  }
};

export const updateCategoriesV2 = async (req: Request, res: Response) => {
  try {
    if (!("categories" in req.body))
      return res
        .status(409)
        .send({ message: "field 'categories' is required" });
    const user = req.user!;
    const budget = await Budget.findById(req.params._id);
    if (!budget) return res.status(404).send({});
    if (!budget.userId.equals(user._id)) return res.status(401).send();

    const _categories = budget.categories;

    const { updated, added, removed } = compareCategories({
      prevArr: _categories,
      newArr: req.body.categories,
      compareFunc: (c1, c2) => false,
      key: "categoryId",
    });

    const categories: Types.DocumentArray<ICategory> = new Types.DocumentArray(
      []
    );

    // budget.categories = new Types.DocumentArray([]);
    let sumExpenseAmountPlanned = 0;
    let sumIncomeAmountPlanned = 0;

    for (let _category of added) {
      if (!("amountPlanned" in _category))
        return res
          .status(400)
          .send({ message: "field 'amountPlanned' is required" });

      const category = user.findCategory(_category.categoryId);
      if (!category)
        return res.status(404).send({
          message: "category not found in user.categories",
          category: _category,
        });
      if (category.isDefault)
        return res.status(404).send({
          message: `you can't set default category`,
        });

      if (category.isExpense)
        sumExpenseAmountPlanned += _category.amountPlanned;
      else sumIncomeAmountPlanned += _category.amountPlanned;
      categories.push({
        ...category,
        categoryId: category._id,
        amountPlanned: _category.amountPlanned,
      });
    }

    for (let _category of updated) {
      if (!("amountPlanned" in _category))
        return res
          .status(400)
          .send({ message: "field 'amountPlanned' is required" });

      const category = budget.findCategory(_category.categoryId);
      if (!category)
        return res.status(404).send({
          message: "category not found in budget.categories",
          category: _category,
        });
      if (category.isDefault)
        return res.status(404).send({
          message: `you can't set default category`,
        });

      if (category.isExpense)
        sumExpenseAmountPlanned += _category.amountPlanned;
      else sumIncomeAmountPlanned += _category.amountPlanned;
      categories.push({
        ...category,
        amountPlanned: _category.amountPlanned,
      });
    }
    const defaultExpenseCategory = budget.findDefaultExpenseCategory();
    const defaultIncomeCategory = budget.findDefaultIncomeCategory();
    categories.push({
      ...defaultExpenseCategory,
      amountPlanned: budget.expensePlanned - sumExpenseAmountPlanned,
    });
    categories.push({
      ...defaultIncomeCategory,
      amountPlanned: budget.incomePlanned - sumIncomeAmountPlanned,
    });
    budget.categories = categories;

    for (const category of removed) {
      if (category.isDefault) continue;
      const transactions = await Transaction.find({
        userId: user._id,
        budgetId: budget._id,
        "category.categoryId": category.categoryId,
      });

      await Promise.all(
        transactions.map((transaction) => {
          if (transaction.category.isExpense) {
            transaction.category = {
              ...defaultExpenseCategory,
              categoryId: defaultExpenseCategory._id,
            };
            budget.increaseDefaultExpenseCategory(
              transaction.isCurrent ? "amountCurrent" : "amountScheduled",
              transaction.amount
            );
          } else {
            transaction.category = {
              ...defaultIncomeCategory,
              categoryId: defaultIncomeCategory._id,
            };
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
    return res.status(200).send({ budget, updated, added, removed });
  } catch (err: any) {
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
    if (!budget.userId.equals(user._id)) return res.status(401).send();

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
      if (!budget.userId.equals(user._id)) return res.status(401).send();

      const transactions = await Transaction.find({ budgetId: budget._id });
      return res.status(200).send({ budget, transactions });

      // return res.status(200).send({
      //   message: "check",
      //   budget: {
      //     title: budget.title,
      //     expenseScheduled: budget.expenseScheduled,
      //     expenseCurrent: budget.expenseCurrent,
      //     expensePlanned: budget.expensePlanned,
      //     incomeScheduled: budget.incomeScheduled,
      //     incomeCurrent: budget.incomeCurrent,
      //     incomePlanned: budget.incomePlanned,
      //     categories: budget.categories.map((cat) => {
      //       return {
      //         categoryId: cat.categoryId,
      //         title: cat.title,
      //         amountPlanned: cat.amountPlanned,
      //         amountScheduled: cat.amountScheduled,
      //         amountCurrent: cat.amountCurrent,
      //       };
      //     }),
      //   },

      //   transactions: transactions.map((t) => {
      //     return {
      //       _id: t._id,
      //       linkId: t.linkId,
      //       title2: _.join(t.title, "/"),
      //       amount: t.amount,
      //       category: {
      //         title: t.category.title,
      //         categoryId: t.category.categoryId,
      //       },
      //     };
      //   }),
      // });
    }
    const budgets = await Budget.find({ userId: user._id });
    return res.status(200).send({ budgets });
  } catch (err: any) {
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
    const user = req.user;
    const budget = await Budget.findById(req.params._id);
    if (!budget) return res.status(404).send();
    // if (!budget.userId.equals(user._id)) return res.status(401).send();

    await Transaction.deleteMany({ budgetId: budget._id });
    await budget.remove();
    return res.status(200).send();
  } catch (err: any) {
    return res.status(500).send({ message: err.message });
  }
};
