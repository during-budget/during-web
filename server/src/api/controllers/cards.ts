import { Request, Response } from "express";
import _ from "lodash";
import { Types } from "mongoose";

import { ICard } from "src/models/User";
import { Transaction } from "src/models/Transaction";

import { logger } from "src/api/middleware/loggers";
import { FIELD_REQUIRED, NOT_FOUND } from "../message";
import {
  AssetService,
  CardService,
  PaymentMethodService,
} from "src/services/users";

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
  try {
    if (!("year" in req.query)) {
      return res.status(400).send({ message: FIELD_REQUIRED("year") });
    }
    const user = req.user!;
    const transactions = await Transaction.find({
      userId: user._id,
      year: req.query.year,
      linkedPaymentMethodId: req.params._id,
    }).lean();
    return res.status(200).send({
      transactions,
    });
  } catch (err: any) {
    logger.error(err.message);
    return res.status(500).send({ message: err.message });
  }
};

export const createCardTransaction = async (req: Request, res: Response) => {
  try {
    for (let field of ["year", "month", "amount"])
      if (!(field in req.body))
        return res.status(400).send({ message: FIELD_REQUIRED(field) });
    const user = req.user!;

    const card = _.find(user.cards, {
      _id: new Types.ObjectId(req.params._id),
    });
    if (!card) return res.status(404).send({ message: NOT_FOUND("card") });

    const transaction = await Transaction.create({
      userId: user._id,
      isCurrent: true,
      isExpense: true,
      year: req.body.year,
      month: req.body.month,
      amount: req.body.amount,
      linkedPaymentMethodType: "card",
      linkedPaymentMethodId: card._id,
      linkedPaymentMethodTitle: card.title,
      linkedPaymentMethodIcon: card.icon,
      linkedPaymentMethodDetail: card.detail,
    });

    if (card.linkedAssetId) {
      const assetIdx = _.findIndex(user.assets, {
        _id: card.linkedAssetId,
      });
      if (assetIdx !== -1) {
        user.assets[assetIdx].amount -= transaction.amount;
        await user.saveReqUser();
      }
    }

    return res.status(200).send({
      transaction,
      assets: user.assets,
    });
  } catch (err: any) {
    logger.error(err.message);
    return res.status(500).send({ message: err.message });
  }
};

export const updateCardTransaction = async (req: Request, res: Response) => {
  try {
    for (let field of ["year", "month"]) {
      if (!(field in req.query)) {
        return res.status(400).send({ message: FIELD_REQUIRED(field) });
      }
    }
    for (let field of ["amount"])
      if (!(field in req.body))
        return res.status(400).send({ message: FIELD_REQUIRED(field) });
    const user = req.user!;

    const card = _.find(user.cards, {
      _id: new Types.ObjectId(req.params._id),
    });
    if (!card) return res.status(404).send({ message: NOT_FOUND("card") });

    const transaction = await Transaction.findOne({
      userId: user._id,
      year: req.query.year,
      month: req.query.month,
      linkedPaymentMethodId: card._id,
    });
    if (!transaction) {
      return res.status(404).send({ message: NOT_FOUND("transaction") });
    }
    const exAmount = transaction.amount;
    const newAmount = req.body.amount;

    if (card.linkedAssetId) {
      const assetIdx = _.findIndex(user.assets, {
        _id: card.linkedAssetId,
      });
      if (assetIdx !== -1) {
        user.assets[assetIdx].amount += exAmount - newAmount;
        await user.saveReqUser();
      }
    }
    transaction.amount = newAmount;
    await transaction.save();

    return res.status(200).send({
      transaction,
      assets: user.assets,
    });
  } catch (err: any) {
    logger.error(err.message);
    return res.status(500).send({ message: err.message });
  }
};

export const removeCardTransaction = async (req: Request, res: Response) => {
  try {
    for (let field of ["year", "month"]) {
      if (!(field in req.query)) {
        return res.status(400).send({ message: FIELD_REQUIRED(field) });
      }
    }

    const user = req.user!;

    const card = _.find(user.cards, {
      _id: new Types.ObjectId(req.params._id),
    });
    if (!card) return res.status(404).send({ message: NOT_FOUND("card") });

    const transaction = await Transaction.findOne({
      userId: user._id,
      year: req.query.year,
      month: req.query.month,
      linkedPaymentMethodId: card._id,
    });
    if (!transaction) {
      return res.status(404).send({ message: NOT_FOUND("transaction") });
    }

    if (card.linkedAssetId) {
      const assetIdx = _.findIndex(user.assets, {
        _id: card.linkedAssetId,
      });
      if (assetIdx !== -1) {
        user.assets[assetIdx].amount += transaction.amount;
        await user.saveReqUser();
      }
    }
    await transaction.remove();

    return res.status(200).send({
      assets: user.assets,
    });
  } catch (err: any) {
    logger.error(err.message);
    return res.status(500).send({ message: err.message });
  }
};
