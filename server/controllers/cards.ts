import { Request, Response } from "express";
import _ from "lodash";
import { Types } from "mongoose";

import { ICard } from "../models/User";
import { Transaction } from "../models/Transaction";

export const update = async (req: Request, res: Response) => {
  try {
    /* validate */
    if (!("cards" in req.body))
      return res.status(409).send({ message: "field 'cards' is required" });

    const user = req.user!;
    if (!user.cards) user.cards = [];

    const cardDict: { [key: string]: ICard } = Object.fromEntries(
      user.cards.map((card: any) => [card._id, card.toObject()])
    );

    const _cards: Types.DocumentArray<ICard> = new Types.DocumentArray([]);

    const added: Types.DocumentArray<ICard> = new Types.DocumentArray([]);
    const updated: Types.DocumentArray<ICard> = new Types.DocumentArray([]);
    const removed: Types.DocumentArray<ICard> = new Types.DocumentArray([]);

    for (let _card of req.body.cards) {
      /* create card */
      if (!("_id" in _card)) {
        if (!("title" in _card)) {
          return res.status(400).send({ message: "title is required" });
        }
        if ("linkedAssetId" in _card) {
          const asset = _.find(user.assets, {
            _id: new Types.ObjectId(_card.linkedAssetId),
          });

          if (!asset) {
            return res.status(404).send({ message: "linked asset not found" });
          }
          _card.linkedAssetIcon = asset.icon;
          _card.linkedAssetTitle = asset.title;
        }
        _card._id = new Types.ObjectId();
        _cards.push(_card);
        added.push(_card);
      } else {
        /* update card */
        const key = _card._id;
        const exCard = cardDict[key];
        if (!exCard) return res.status(404).send({ message: "card not found" });

        const card = {
          _id: exCard._id,
          icon: _card.icon ?? exCard.icon,
          title: _card.title ?? exCard.title,
        } as ICard;
        if (exCard.linkedAssetId === _card.linkedAssetId) {
          card.linkedAssetId = exCard.linkedAssetId;
          card.linkedAssetIcon = exCard.linkedAssetIcon;
          card.linkedAssetTitle = exCard.linkedAssetTitle;
        } else if (_card.linkedAssetId) {
          const asset = _.find(user.assets, {
            _id: new Types.ObjectId(_card.linkedAssetId),
          });
          if (!asset)
            return res.status(404).send({ message: "linked asset not found" });
          card.linkedAssetId = asset._id;
          card.linkedAssetIcon = asset.icon;
          card.linkedAssetTitle = asset.title;
        }

        _cards.push(card);
        delete cardDict[key];
        if (exCard.icon !== card.icon || exCard.title !== card.title) {
          updated.push(card);
        }
      }
    }
    /* remove card */
    for (const card of Object.values(cardDict)) {
      removed.push(card);
    }

    user.cards = _cards;

    for (const card of added) {
      const key = card._id;
      user.paymentMethods.push({
        _id: key,
        type: "card",
        icon: card.icon,
        title: card.title,
      });
    }

    for (const card of updated) {
      const key = card._id;

      const paymentMethodIdx = _.findIndex(user.paymentMethods, {
        _id: card._id,
      });
      if (paymentMethodIdx !== -1) {
        user.paymentMethods[paymentMethodIdx].icon = card.icon;
        user.paymentMethods[paymentMethodIdx].title = card.title;

        /* update transactions */
        await Transaction.updateMany(
          { linkedPaymentMethodId: card._id },
          {
            linkedPaymentMethodIcon: card.icon,
            linkedPaymentMethodTitle: card.title,
          }
        );
      }
    }

    for (const card of removed) {
      const key = card._id;
      const paymentMethodIdx = _.findIndex(user.paymentMethods, {
        _id: new Types.ObjectId(card._id),
      });
      if (paymentMethodIdx !== -1) {
        user.paymentMethods.splice(paymentMethodIdx, 1);
      }
    }

    if (req.body?.resetOrder === true) {
      const pmAsset = [];
      const pmCard = [];
      for (let pm of user.paymentMethods) {
        if (pm.type === "asset") pmAsset.push(pm);
        else pmCard.push(pm);
      }
      user.paymentMethods = [...pmCard, ...pmAsset];
    }
    await user.saveReqUser();
    return res.status(200).send({ cards: user.cards });
  } catch (err: any) {
    return res.status(500).send({ message: err.message });
  }
};

export const find = async (req: Request, res: Response) => {
  try {
    const user = req.user!;

    return res.status(200).send({
      cards: user.cards,
    });
  } catch (err: any) {
    return res.status(500).send({ message: err.message });
  }
};
