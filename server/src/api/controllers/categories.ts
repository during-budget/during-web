import { Request, Response } from "express";

import { FIELD_INVALID, FIELD_REQUIRED, NOT_FOUND } from "../message";

import * as UserService from "src/services/user";
import * as BudgetService from "src/services/budget";
import * as TransactionService from "src/services/transaction";

export const create = async (req: Request, res: Response) => {
  /* validate */
  const isExpense = "isExpense" in req.body ? req.body.isExpense : false;
  const isIncome = "isIncome" in req.body ? req.body.isIncome : false;
  if (isExpense === isIncome) {
    return res.status(400).send({ message: FIELD_INVALID("isExpense") });
  }
  if (!("title" in req.body))
    return res.status(400).send({ message: FIELD_REQUIRED("title") });
  if (!("icon" in req.body))
    return res.status(400).send({ message: FIELD_REQUIRED("icon") });

  const { title, icon } = req.body;
  const user = req.user!;

  const { category } = await UserService.createCategory(user, {
    isExpense,
    isIncome,
    title,
    icon,
  });

  return res.status(200).send({
    category,
  });
};

export const update = async (req: Request, res: Response) => {
  if (!("title" in req.body))
    return res.status(400).send({ message: FIELD_REQUIRED("title") });
  if (!("icon" in req.body))
    return res.status(400).send({ message: FIELD_REQUIRED("icon") });

  const user = req.user!;

  const { category } = UserService.findCategory(user, req.params._id);
  if (!category) {
    return res.status(404).send({ message: NOT_FOUND("category") });
  }

  const { title, icon } = req.body;

  await UserService.updateCategory(user, category, {
    title,
    icon,
  });

  await Promise.all([
    BudgetService.updateCategory(user, category._id, category),
    TransactionService.updateCategory(user, category._id, category),
  ]);

  return res.status(200).send({
    category,
  });
};

export const updateAll = async (req: Request, res: Response) => {
  /* validate */
  if (!("categories" in req.body))
    return res.status(400).send({ message: FIELD_REQUIRED("categories") });
  for (let _category of req.body.categories) {
    for (let field of ["title", "icon"]) {
      if (!(field in _category)) {
        return res.status(400).send({ message: FIELD_REQUIRED(field) });
      }
    }
  }

  const user = req.user!;

  const { added, updated, removed } = await UserService.updateCategoriesAll(
    user,
    req.body.categories
  );

  const { category: defaultExpenseCategory } =
    UserService.findDefaultExpenseCategory(user);
  const { category: defaultIncomeCategory } =
    UserService.findDefaultIncomeCategory(user);

  await Promise.all([
    ...updated.map((category) => {
      BudgetService.updateCategory(user, category._id, category);
      TransactionService.updateCategory(user, category._id, category);
    }),
    ...removed.map((category) => {
      BudgetService.removeCategory(user, category._id);
      TransactionService.updateCategory(
        user,
        category._id,
        category.isExpense ? defaultExpenseCategory : defaultIncomeCategory
      );
    }),
  ]);

  return res.status(200).send({
    categories: user.categories,
    added,
    updated,
    removed,
  });
};

export const updatePartially = async (req: Request, res: Response) => {
  /* validate */
  if (!("isExpense" in req.body) && !("isIncome" in req.body))
    return res.status(400).send({ message: FIELD_REQUIRED("isExpense") });

  if (!("categories" in req.body))
    return res.status(400).send({ message: FIELD_REQUIRED("cateogires") });

  const isExpense = "isExpense" in req.body ? req.body.isExpense : false;
  const isIncome = "isIncome" in req.body ? req.body.isIncome : false;
  if (isExpense === isIncome) {
    return res.status(400).send({ message: FIELD_INVALID("isExpense") });
  }

  for (let _category of req.body.categories) {
    for (let field of ["title", "icon"]) {
      if (!(field in _category)) {
        return res.status(400).send({ message: FIELD_REQUIRED(field) });
      }
    }
  }

  const user = req.user!;

  const { added, updated, removed } =
    await UserService.updateCategoriesPartially(
      user,
      isExpense,
      isIncome,
      req.body.categories
    );

  const defaultCategory = isExpense
    ? UserService.findDefaultExpenseCategory(user).category
    : UserService.findDefaultIncomeCategory(user).category;

  await Promise.all([
    ...updated.map((category) => {
      BudgetService.updateCategory(user, category._id, category);
      TransactionService.updateCategory(user, category._id, category);
    }),
    ...removed.map((category) => {
      BudgetService.removeCategory(user, category._id);
      TransactionService.updateCategory(user, category._id, defaultCategory);
    }),
  ]);

  return res.status(200).send({
    categories: user.categories,
    added,
    updated,
    removed,
  });
};

/**
 * Read user's category settings
 *
 * @return categories
 */
export const find = async (req: Request, res: Response) => {
  const user = req.user!;

  const { categories } = UserService.getCategories(user);

  return res.status(200).send({
    categories,
  });
};

export const findOne = async (req: Request, res: Response) => {
  const user = req.user!;

  const { category } = UserService.findCategory(user, req.params._id);

  if (!category) {
    return res.status(404).send({ message: NOT_FOUND("category") });
  }

  return res.status(200).send({
    category,
  });
};

export const remove = async (req: Request, res: Response) => {
  const user = req.user!;

  const { idx, category } = UserService.findCategory(user, req.params._id);
  if (idx === -1) {
    return res
      .status(404)
      .send({ message: NOT_FOUND("category"), categories: user.categories });
  }

  const defaultCategory = category.isExpense
    ? UserService.findDefaultExpenseCategory(user).category
    : UserService.findDefaultIncomeCategory(user).category;

  await Promise.all([
    UserService.removeCategoryByIdx(user, idx),
    BudgetService.removeCategory(user, category._id),
    TransactionService.updateCategory(user, category._id, defaultCategory),
  ]);

  return res.status(200).send({
    categories: user.categories,
  });
};
