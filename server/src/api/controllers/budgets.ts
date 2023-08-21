import { Request, Response } from "express";
import _ from "lodash";
import * as BudgetService from "src/services/budget";
import * as UserService from "src/services/user";

import {
  FIELD_INVALID,
  FIELD_REQUIRED,
  NOT_FOUND,
  NOT_PERMITTED,
} from "../message";

/**
 * Create budget based on basic budget
 *
 * @body { startDate,endDate, title, expensePlanned,incomePlanned,categories}
 * @return budget
 */
export const createWithBasic = async (req: Request, res: Response) => {
  for (let field of ["year", "month"]) {
    if (!(field in req.body)) {
      return res.status(400).send({ message: FIELD_REQUIRED(field) });
    }
  }
  const year = parseInt(req.body.year);
  const month = parseInt(req.body.month);
  const title = req.body.title;

  const user = req.user!;

  const { budget, transactions } = await BudgetService.createWithBasicBudget(
    user,
    year,
    month,
    title
  );

  return res.status(200).send({ budget, transactions });
};

export const updateCategoriesV3 = async (req: Request, res: Response) => {
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
  const { budget } = await BudgetService.findById(req.params._id);
  if (!budget) return res.status(404).send({ message: NOT_FOUND("budget") });
  if (!BudgetService.checkBudgetUserIdMatch(budget, user._id)) {
    return res.status(403).send({ message: NOT_PERMITTED });
  }

  await BudgetService.updateCategories(
    user,
    budget,
    isExpense,
    req.body.categories
  );

  return res.status(200).send({
    categories: budget.categories,
  });
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
  if (!("amountPlanned" in req.body))
    return res.status(400).send({ message: FIELD_REQUIRED("amountPlanned") });

  const user = req.user!;

  const { budget } = await BudgetService.findById(req.params._id);
  if (!budget) return res.status(404).send({ message: NOT_FOUND("budget") });
  if (!BudgetService.checkBudgetUserIdMatch(budget, user._id)) {
    return res.status(403).send({ message: NOT_PERMITTED });
  }

  await BudgetService.updateCategoryAmountPlanned(
    budget,
    req.params.categoryId,
    req.body.amountPlanned
  );

  return res.status(200).send({ budget });
};

/**
 * Update budget fields
 *
 * @body { startDate?, endDate? title?, expensePlanned?, incomePlanned?}
 * @return budget
 */
export const updateField = async (req: Request, res: Response) => {
  const user = req.user!;
  const { budget } = await BudgetService.findById(req.params._id);
  if (!budget) return res.status(404).send({ message: NOT_FOUND("budget") });
  if (!BudgetService.checkBudgetUserIdMatch(budget, user._id)) {
    return res.status(403).send({ message: NOT_PERMITTED });
  }

  await BudgetService.updateFields(budget, req.body);

  return res.status(200).send({ budget });
};

/**
 * Find budget
 *
 * @param { _id?}
 * @return budget or budgets
 */
export const find = async (req: Request, res: Response) => {
  const user = req.user!;

  if (req.params._id) {
    const { budget, transactions } =
      await BudgetService.findByIdWithTransactions(req.params._id);

    if (!budget) return res.status(404).send({ message: NOT_FOUND("budget") });
    if (!BudgetService.checkBudgetUserIdMatch(budget, user._id)) {
      if (!UserService.checkAdmin(user)) {
        return res.status(403).send({ message: NOT_PERMITTED });
      }
    }

    return res.status(200).send({ budget, transactions });
  }
  if ("year" in req.query) {
    const year = parseInt(req.query.year as string);
    if ("month" in req.query) {
      const month = parseInt(req.query.month as string);
      const { budget } = await BudgetService.findByYearAndMonth(
        user._id,
        year,
        month
      );
      return res.status(200).send({ budget });
    }
    const { budgets } = await BudgetService.findByYear(user._id, year);
    return res.status(200).send({ budgets });
  }
  if ("userId" in req.query) {
    if (!UserService.checkAdmin(user)) {
      return res.status(403).send({ message: NOT_PERMITTED });
    }
    if (req.query.userId === "*") {
      const { budgets } = await BudgetService.findAllBudgets();
      return res.status(200).send({ budgets });
    }
    const { budgets } = await BudgetService.findByUserId(
      req.query.userId as string
    );
    return res.status(200).send({ budgets });
  }

  const { budgets } = await BudgetService.findByUserId(user._id);
  return res.status(200).send({ budgets });
};

/**
 * Remove budget
 *
 * @param { _id}
 */
export const remove = async (req: Request, res: Response) => {
  const user = req.user!;
  const { budget } = await BudgetService.findById(req.params._id);
  if (!budget) return res.status(404).send({ message: NOT_FOUND("budget") });

  if (!BudgetService.checkBudgetUserIdMatch(budget, user._id)) {
    if (!UserService.checkAdmin(user)) {
      return res.status(403).send({ message: NOT_PERMITTED });
    }
  }

  await BudgetService.remove(budget);
  return res.status(200).send();
};
