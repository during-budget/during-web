import { Request, Response } from "express";
import _ from "lodash";
import moment from "moment-timezone";

import { AuthService, PaymentMethodService } from "src/services/users";
import * as BudgetService from "src/services/budgets";
import * as TransactionService from "src/services/transactions";

import {
  PaymentMethodNotFoundError,
  TransactionNotFoundError,
} from "src/errors/NotFoundError";
import { FieldInvalidError, FieldRequiredError } from "src/errors/InvalidError";
import { NotPermittedError } from "src/errors/ForbiddenError";
import { InvalidError } from "src/errors/InvalidError";

// transaction controller

/**
 * Create transaction
 *
 * @body { budgetId, date, isCurrent, isExpense, isIncome, title: [String], amount: Number, categoryId, tags?, memo?, linkId?}
 * @return transaction
 */

const dateReg = new RegExp("[0-9]{4}[-][0-9]{2}[-][0-9]{2}");

export const create = async (req: Request, res: Response) => {
  const user = req.user!;

  for (let field of [
    "budgetId",
    "date",
    "isCurrent",
    "title",
    "amount",
    "categoryId",
  ])
    if (!(field in req.body)) throw new FieldRequiredError(field);

  const { transaction, budget } = await TransactionService.create(user, {
    budgetId: req.body.budgetId,
    categoryId: req.body.categoryId,
    date: req.body.date,
    isCurrent: req.body.isCurrent,
    icon: req.body.icon,
    title: req.body.title,
    amount: req.body.amount,
    tags: req.body.tags,
    memo: req.body.memo,
    updateAsset: req.body.updateAsset,
  });

  let transactionScheduled: any = null;

  //  linkedCurrentTransaction
  if (TransactionService.isCurrent(transaction) && req.body.linkId) {
    const { transaction: _transactionScheduled } =
      await TransactionService.findById(req.body.linkId);
    transactionScheduled = _transactionScheduled;

    if (!transactionScheduled) throw new TransactionNotFoundError();

    await TransactionService.linkTransaction(transaction, transactionScheduled);
  }

  if (req.body.linkedPaymentMethodId) {
    const { paymentMethod: paymentMethod } = PaymentMethodService.findById(
      req.user!,
      req.body.linkedPaymentMethodId
    );
    if (!paymentMethod) throw new PaymentMethodNotFoundError();

    await TransactionService.updatePaymentMethod(transaction, paymentMethod);
  }

  // if pm is used and asset needs to be updated
  if (TransactionService.hasToUpdateAsset(transaction)) {
    await PaymentMethodService.execPaymentMethod(user, transaction);
  }

  await BudgetService.calculate(budget);

  return res.status(200).send({
    transaction,
    transactionScheduled,
    budget,
    assets: TransactionService.hasToUpdateAsset(transaction)
      ? user.assets
      : undefined,
  });
};

export const updateV2 = async (req: Request, res: Response) => {
  const user = req.user!;

  for (let field of [
    "date",
    "icon",
    "title",
    "tags",
    "memo",
    "categoryId",
    "amount",
    "isCurrent",
    "updateAsset",
  ]) {
    if (!(field in req.body)) {
      throw new FieldRequiredError(field);
    }
  }

  const transactionId = req.params._id as string;
  const date = new Date(req.body.date);
  const icon = req.body.icon;
  const title = req.body.title;
  const tags = req.body.tags;
  const memo = req.body.memo;
  const categoryId = req.body.categoryId;
  const amount = parseInt(req.body.amount);
  const isCurrent = req.body.isCurrent as boolean;
  const updateAsset = req.body.updateAsset as boolean;
  const linkedPaymentMethodId = req.body.linkedPaymentMethodId as string;

  const { transaction } = await TransactionService.findById(transactionId);
  if (!transaction) throw new TransactionNotFoundError();

  if (!TransactionService.isUser(transaction, user))
    throw new NotPermittedError();

  const { transactionLinked, budget, assets } = await TransactionService.update(
    transaction,
    {
      date,
      icon,
      title,
      tags,
      memo,
      categoryId,
      amount,
      isCurrent,
      updateAsset,
      linkedPaymentMethodId,
    }
  );

  return res.status(200).send({
    transaction,
    transactionLinked,
    budget,
    assets,
  });
};

export const find = async (req: Request, res: Response) => {
  const user = req.user!;

  if (req.params._id) {
    const { transaction } = await TransactionService.findById(req.params._id);

    if (!transaction) {
      throw new TransactionNotFoundError();
    }

    if (
      !AuthService.isAdmin(user) &&
      !TransactionService.isUser(transaction, user)
    ) {
      throw new NotPermittedError();
    }

    return res.status(200).send({ transactions: transaction });
  }

  if ("userId" in req.query) {
    if (!AuthService.isAdmin(user)) {
      throw new NotPermittedError();
    }

    if (req.query.userId === "*") {
      const { transactions } = await TransactionService.findAll();
      return res.status(200).send({ transactions });
    }

    const { transactions } = await TransactionService.findByUser(user._id);
    return res.status(200).send({ transactions });
  }

  if ("linkedPaymentMethodId" in req.query) {
    for (let field of ["startDate", "endDate"]) {
      if (!(field in req.query)) throw new FieldRequiredError(field);
      if (!dateReg.test(`${req.query[field]}`))
        throw new FieldInvalidError(field);
    }

    const tz = user.settings.timeZone;
    const startMMT = moment.tz(req.query.startDate, tz);
    const endMMT = moment.tz(req.query.endDate, tz);

    const startDate = startMMT.toDate();
    const endDate = endMMT.toDate();
    const linkedPaymentMethodId = req.query.linkedPaymentMethodId as string;

    const { transactions } =
      await TransactionService.findByLinkedPaymentMethodIdBetweenDates(
        user,
        linkedPaymentMethodId,
        startDate,
        endDate
      );

    if (!AuthService.isAdmin(user)) {
      for (let transaction of transactions) {
        if (!TransactionService.isUser(transaction, user))
          throw new NotPermittedError();
      }
    }

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
    const tag = req.query.tag as string;

    const { transactions } = await TransactionService.findByTag(user, tag);

    if (!AuthService.isAdmin(user)) {
      for (let transaction of transactions) {
        if (!TransactionService.isUser(transaction, user))
          throw new NotPermittedError();
      }
    }

    return res.status(200).send({
      transactions,
    });
  }

  if ("budgetId" in req.query) {
    const budgetId = req.query.budgetId as string;

    const { transactions } = await TransactionService.findByBudgetId(budgetId);

    if (!AuthService.isAdmin(user)) {
      for (let transaction of transactions) {
        if (!TransactionService.isUser(transaction, user))
          throw new NotPermittedError();
      }
    }

    return res.status(200).send({ transactions });
  }

  throw new InvalidError();
};

/**
 * Remove transaction
 *
 * @param {_id: oid}
 */
export const remove = async (req: Request, res: Response) => {
  const user = req.user!;

  const transactionId = req.params._id as string;

  const { transaction } = await TransactionService.findById(transactionId);
  if (!transaction) throw new TransactionNotFoundError();

  if (!TransactionService.isUser(transaction, user)) {
    if (!AuthService.isAdmin(user)) {
      throw new NotPermittedError();
    }
  }

  const { transactionRemoved, transactionLinkedRemoved } =
    await TransactionService.remove(transaction);

  const { budget } = await BudgetService.findById(transaction.budgetId);
  if (budget) {
    await BudgetService.calculate(budget);
  }

  return res.status(200).send({
    transactionLinked: transactionLinkedRemoved,
    budget,
    assets: user.assets,
  });
};
