import { Request, Response } from "express";
import _ from "lodash";
import { Types } from "mongoose";
import { FIELD_REQUIRED, NOT_FOUND } from "../message";
import {
  AssetService,
  CardService,
  PaymentMethodService,
} from "src/services/users";
import { CardNotFoundError } from "errors/NotFoundError";

export const create = async (req: Request, res: Response) => {
  if (!("title" in req.body)) {
    return res.status(400).send({ message: FIELD_REQUIRED("title") });
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
      return res.status(404).send({ message: NOT_FOUND("asset") });
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
      return res.status(400).send({
        message: FIELD_REQUIRED(field),
      });
    }
  }

  const user = req.user!;

  /* update card */
  const { idx, card } = CardService.findById(user, req.params._id);
  if (idx === -1) return res.status(404).send({ message: NOT_FOUND("card") });

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
  if (!("cards" in req.body))
    return res.status(400).send({ message: FIELD_REQUIRED("cards") });
  for (let _card of req.body.cards) {
    if (!("_id" in _card) && !("title" in _card)) {
      return res.status(400).send({ message: FIELD_REQUIRED("title") });
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
  if (!card) return res.status(404).send({ message: NOT_FOUND("card") });

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
    return res.status(400).send({ message: FIELD_REQUIRED("year") });
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
    if (!(field in req.body))
      return res.status(400).send({ message: FIELD_REQUIRED(field) });
  const year = parseInt(req.body.year);
  const month = parseInt(req.body.month);
  const amount = parseInt(req.body.amount);

  const { card } = CardService.findById(user, cardId);
  if (!card) return res.status(404).send({ message: NOT_FOUND("card") });

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
      return res.status(400).send({ message: FIELD_REQUIRED(field) });
    }
  }
  const year = parseInt(req.query.year as string);
  const month = parseInt(req.query.month as string);

  if (!("amount" in req.body))
    return res.status(400).send({ message: FIELD_REQUIRED("amount") });
  const amount = parseInt(req.body.amount);

  const { card } = CardService.findById(user, cardId);
  if (!card) return res.status(404).send({ message: NOT_FOUND("card") });

  const { transaction } = await CardService.updatePostPaidTransactionAmount(
    user,
    card,
    year,
    month,
    amount
  );
  if (!transaction) {
    return res.status(404).send({ message: NOT_FOUND("transaction") });
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
      return res.status(400).send({ message: FIELD_REQUIRED(field) });
    }
  }
  const year = parseInt(req.query.year as string);
  const month = parseInt(req.query.month as string);

  const { card } = CardService.findById(user, cardId);
  if (!card) return res.status(404).send({ message: NOT_FOUND("card") });

  const { transaction } = await CardService.removePostPaidTransaction(
    user,
    card,
    year,
    month
  );
  if (!transaction) {
    return res.status(404).send({ message: NOT_FOUND("transaction") });
  }

  return res.status(200).send({
    assets: user.assets,
  });
};
