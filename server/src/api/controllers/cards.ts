import { Request, Response } from "express";
import _ from "lodash";
import { Types } from "mongoose";

import {
  AssetService,
  CardService,
  PaymentMethodService,
} from "src/services/users";
import {
  AssetNotFoundError,
  CardNotFoundError,
  TransactionNotFoundError,
} from "errors/NotFoundError";
import { FieldRequiredError } from "errors/InvalidError";

export const create = async (req: Request, res: Response) => {
  if (!("title" in req.body)) {
    throw new FieldRequiredError("title");
  }

  const user = req.user!;

  const _card = {
    icon: req.body.icon,
    title: req.body.title,
    detail: req.body.detail,
    paymentDate: req.body.paymentDate,
    linkedAssetId: undefined,
    linkedAssetIcon: undefined,
    linkedAssetTitle: undefined,
  };

  if ("linkedAssetId" in req.body) {
    const { asset } = AssetService.findById(user, req.body.linkedAssetId);
    if (!asset) {
      throw new AssetNotFoundError();
    }
    _card.linkedAssetId = asset._id;
    _card.linkedAssetIcon = asset.icon;
    _card.linkedAssetTitle = asset.title;
  }

  await CardService.create(user, _card);

  return res.status(200).send({
    cards: user.cards,
    paymentMethods: user.paymentMethods,
  });
};

export const update = async (req: Request, res: Response) => {
  for (let field of ["icon", "title", "detail"]) {
    if (!(field in req.body)) {
      throw new FieldRequiredError(field);
    }
  }

  const user = req.user!;

  /* update card */
  const { idx, card } = CardService.findById(user, req.params._id);
  if (idx === -1) throw new CardNotFoundError();

  const newCard = {
    ...card,
    title: req.body.title,
    icon: req.body.icon,
    detail: req.body.detail,
  };
  const { isUpdatedPM } = await CardService.update(user, card, newCard);

  return res.status(200).send({
    cards: user.cards,
    paymentMethods: isUpdatedPM ? user.paymentMethods : undefined,
  });
};

export const updateAll = async (req: Request, res: Response) => {
  /* validate */
  if (!("cards" in req.body)) throw new FieldRequiredError("cards");
  for (let _card of req.body.cards) {
    if (!("_id" in _card) && !("title" in _card)) {
      throw new FieldRequiredError("title");
    }
  }
  const user = req.user!;

  const { isUpdatedPM } = await CardService.updateAll(user, req.body.cards);

  if (req.body?.resetOrder === true) {
    await PaymentMethodService.sort(user);
  }

  return res.status(200).send({
    cards: user.cards,
    paymentMethods: isUpdatedPM ? user.paymentMethods : undefined,
  });
};

export const find = async (req: Request, res: Response) => {
  const user = req.user!;

  if (req.params._id) {
    const cardId = req.params._id;
    const { card } = CardService.findById(user, cardId);
    if (!card) throw new CardNotFoundError();
    return res.status(200).send({ card });
  }
  return res.status(200).send({
    cards: user.cards,
  });
};

export const remove = async (req: Request, res: Response) => {
  const user = req.user!;

  const { card } = CardService.findById(
    user,
    new Types.ObjectId(req.params._id)
  );
  if (!card) throw new CardNotFoundError();

  await CardService.remove(user, card._id);

  return res.status(200).send({
    cards: user.cards,
    paymentMethods: user.paymentMethods,
  });
};

export const findCardTransactions = async (req: Request, res: Response) => {
  const user = req.user!;
  const linkedPaymentMethodId = req.params._id;

  if (!req.query.year) {
    throw new FieldRequiredError("year");
  }
  const year = parseInt(req.query.year as string);

  const { transactions } = await CardService.findPostPaidTransactionsByYear(
    user,
    linkedPaymentMethodId,
    year
  );

  return res.status(200).send({
    transactions,
  });
};

export const createCardTransaction = async (req: Request, res: Response) => {
  const user = req.user!;

  const cardId = req.params._id;

  for (let field of ["year", "month", "amount"])
    if (!(field in req.body)) throw new FieldRequiredError(field);
  const year = parseInt(req.body.year);
  const month = parseInt(req.body.month);
  const amount = parseInt(req.body.amount);

  const { card } = CardService.findById(user, cardId);
  if (!card) throw new CardNotFoundError();

  const { transaction } = await CardService.createPostPaidTransaction(
    user,
    card,
    year,
    month,
    amount
  );

  return res.status(200).send({
    transaction,
    assets: user.assets,
  });
};

export const updateCardTransaction = async (req: Request, res: Response) => {
  const user = req.user!;

  const cardId = req.params._id;

  for (let field of ["year", "month"]) {
    if (!(field in req.query)) {
      throw new FieldRequiredError(field);
    }
  }
  const year = parseInt(req.query.year as string);
  const month = parseInt(req.query.month as string);

  if (!("amount" in req.body)) throw new FieldRequiredError("amount");
  const amount = parseInt(req.body.amount);

  const { card } = CardService.findById(user, cardId);
  if (!card) throw new CardNotFoundError();

  const { transaction } = await CardService.updatePostPaidTransactionAmount(
    user,
    card,
    year,
    month,
    amount
  );
  if (!transaction) {
    throw new TransactionNotFoundError();
  }

  return res.status(200).send({
    transaction,
    assets: user.assets,
  });
};

export const removeCardTransaction = async (req: Request, res: Response) => {
  const user = req.user!;

  const cardId = req.params._id;

  for (let field of ["year", "month"]) {
    if (!(field in req.query)) {
      throw new FieldRequiredError(field);
    }
  }
  const year = parseInt(req.query.year as string);
  const month = parseInt(req.query.month as string);

  const { card } = CardService.findById(user, cardId);
  if (!card) throw new CardNotFoundError();

  const { transaction } = await CardService.removePostPaidTransaction(
    user,
    card,
    year,
    month
  );
  if (!transaction) {
    throw new TransactionNotFoundError();
  }

  return res.status(200).send({
    assets: user.assets,
  });
};
