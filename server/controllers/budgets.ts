import { Request, Response } from "express";
import _ from "lodash";
import { Budget } from "../models/Budget";
import { Transaction } from "../models/Transaction";

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
 * create budget category
 *
 * @param {_id}
 * @body {  categoryId, amountPlanned }
 * @return budget
 */
export const createCategory = async (req: Request, res: Response) => {
  try {
    const user = req.user!;
    const budget = await Budget.findById(req.params._id);
    if (!budget) return res.status(404).send({});
    if (!budget.userId.equals(user._id)) return res.status(401).send();

    const exCategory = budget.findCategory(req.body.categoryId);
    if (exCategory) {
      return res.status(409).send({
        message: `budget category with _id ${req.body.categoryId} already exists`,
      });
    }

    const category = user.findCategory(req.body.categoryId);
    if (!category) {
      return res.status(404).send({
        message: `user category with _id ${req.body.categoryId} not found`,
      });
    }
    if (!("amountPlanned" in req.body))
      return res
        .status(400)
        .send({ message: "field 'amountPlanned' is required" });

    budget.addDefaultCategory(category.isExpense!, -1 * req.body.amountPlanned);
    budget.pushCategory({
      ...category,
      categoryId: category._id,
      amountPlanned: req.body.amountPlanned,
    });

    await budget.save();

    return res.status(200).send({ budget });
  } catch (err: any) {
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
    if (!req.query.categoryId) return res.status(400).send();
    if (!("amountPlanned" in req.body))
      return res
        .status(400)
        .send({ message: "field 'amountPlanned' is required" });

    const user = req.user!;
    const budget = await Budget.findById(req.params._id);
    if (!budget) return res.status(404).send({});
    if (!budget.userId.equals(user._id)) return res.status(401).send();

    const idx = budget.findCategoryIdx(req.query.categoryId.toString());
    if (idx === -1)
      return res.status(404).send({
        message: `budget category with _id ${req.query.categoryId} not found`,
      });

    if (budget.categories[idx].isDefault)
      return res.status(409).send({
        message: `amountPlanned of default category cannot be updated`,
      });

    budget.addDefaultCategory(
      budget.categories[idx].isExpense!,
      budget.categories[idx].amountPlanned - req.body.amountPlanned
    );
    budget.categories[idx].amountPlanned = req.body.amountPlanned;
    await budget.save();

    return res.status(200).send({ budget });
  } catch (err: any) {
    return res.status(500).send({ message: err.message });
  }
};

/**
 * remove budget category
 *
 * @param {_id}
 * @return budget
 */
export const removeCategory = async (req: Request, res: Response) => {
  try {
    if (!req.query.categoryId) return res.status(400).send();

    const user = req.user!;
    const budget = await Budget.findById(req.params._id);
    if (!budget) return res.status(404).send({ message: "budget not found" });
    if (!budget.userId.equals(user._id)) return res.status(401).send();

    const idx = budget.findCategoryIdx(req.query.categoryId.toString());
    if (idx === -1) {
      return res.status(404).send({
        message: `budget category with _id ${req.query.categoryId} not found`,
      });
    }

    // 해당 카테고리를 사용하는 transaction이 존재하는가?
    const transactions = await Transaction.find({
      userId: user._id,
      budgetId: budget._id,
      "categories.categoryId": req.query.categoryId,
    });
    if (transactions.length > 0)
      return res.status(409).send({
        message: "해당 카테고리를 사용하는 거래내역이 있습니다.",
        transactions,
      });

    budget.addDefaultCategory(
      budget.categories[idx].isExpense!,
      budget.categories[idx].amountPlanned
    );
    budget.categories.splice(idx, 1);
    await budget.save();

    return res.status(200).send({});
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
      budget.addDefaultCategory(
        true,
        req.body.expensePlanned - budget.expensePlanned
      );
      budget.expensePlanned = req.body.expensePlanned;
    }
    if ("incomePlanned" in req.body) {
      budget.addDefaultCategory(
        false,
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
