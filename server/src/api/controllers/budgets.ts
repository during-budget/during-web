import { Request, Response } from "express";
import _ from "lodash";

import * as BudgetService from "src/services/budgets";
const BudgetCategoryService = BudgetService.CategoryService;

import { AuthService } from "src/services/users";

import { FieldInvalidError, FieldRequiredError } from "src/errors/InvalidError";
import {
  BudgetNotFoundError,
  CategoryNotFoundError,
} from "src/errors/NotFoundError";
import { NotPermittedError } from "src/errors/ForbiddenError";
import { DefaultCategoryCannotBeUpdatedError } from "src/errors/ConfilicError";

/**
 * Create budget based on basic budget
 *
 * @body { startDate,endDate, title, expensePlanned,incomePlanned,categories}
 * @return budget
 */
export const createWithBasic = async (req: Request, res: Response) => {
  for (let field of ["year", "month"]) {
    if (!(field in req.body)) {
      throw new FieldRequiredError(field);
    }
  }
  const year = parseInt(req.body.year);
  const month = parseInt(req.body.month);
  const title = req.body.title;

  const user = req.user!;

  const { budget: basicBudget } = await BudgetService.findById(
    user.basicBudgetId
  );
  if (!basicBudget) {
    throw new BudgetNotFoundError();
  }

  const { budget, transactions } = await BudgetService.createWithBasicBudget(
    user,
    basicBudget,
    year,
    month,
    title
  );

  return res.status(200).send({ budget, transactions });
};

export const findBasicBudget = async (req: Request, res: Response) => {
  const user = req.user!;

  const { budget, transactions } = await BudgetService.findByIdWithTransactions(
    user.basicBudgetId
  );

  if (!budget) throw new BudgetNotFoundError();

  return res.status(200).send({ budget, transactions });
};

export const updateCategoriesV3 = async (req: Request, res: Response) => {
  /* validate */
  if (!("isExpense" in req.body) && !("isIncome" in req.body))
    throw new FieldRequiredError("isExpense");
  if (!("categories" in req.body)) throw new FieldRequiredError("categories");

  const isExpense = "isExpense" in req.body ? req.body.isExpense : false;
  const isIncome = "isIncome" in req.body ? req.body.isIncome : false;
  if (isExpense === isIncome) {
    throw new FieldInvalidError("isExpense");
  }

  const user = req.user!;
  const { budget } = await BudgetService.findById(req.params._id);
  if (!budget) throw new BudgetNotFoundError();
  if (!BudgetService.checkBudgetUserIdMatch(budget, user._id)) {
    throw new NotPermittedError();
  }

  const { updated, excluded, included } = await BudgetCategoryService.updateAll(
    user,
    budget,
    isExpense,
    req.body.categories
  );
  await BudgetService.calculate(budget);

  return res.status(200).send({
    categories: budget.categories,
    updated,
    excluded,
    included,
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
    throw new FieldRequiredError("amountPlanned");

  const user = req.user!;

  const { budget } = await BudgetService.findById(req.params._id);
  if (!budget) throw new BudgetNotFoundError();
  if (!BudgetService.checkBudgetUserIdMatch(budget, user._id)) {
    throw new NotPermittedError();
  }

  const { category } = BudgetCategoryService.findById(
    budget,
    req.params.categoryId
  );
  if (!category) {
    throw new CategoryNotFoundError();
  }
  if (BudgetCategoryService.isDefaultCategory(category)) {
    throw new DefaultCategoryCannotBeUpdatedError();
  }

  await BudgetCategoryService.updateAmountPlanned(
    budget,
    category,
    req.body.amountPlanned
  );
  await BudgetService.calculate(budget);

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
  if (!budget) throw new BudgetNotFoundError();
  if (!BudgetService.checkBudgetUserIdMatch(budget, user._id)) {
    throw new NotPermittedError();
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

    if (!budget) throw new BudgetNotFoundError();
    if (!BudgetService.checkBudgetUserIdMatch(budget, user._id)) {
      if (!AuthService.isAdmin(user)) {
        throw new NotPermittedError();
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
    if (!AuthService.isAdmin(user)) {
      throw new NotPermittedError();
    }
    if (req.query.userId === "*") {
      const { budgets } = await BudgetService.findAll();
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
  if (!budget) throw new BudgetNotFoundError();

  if (!BudgetService.checkBudgetUserIdMatch(budget, user._id)) {
    if (!AuthService.isAdmin(user)) {
      throw new NotPermittedError();
    }
  }

  await BudgetService.remove(budget);
  return res.status(200).send();
};
