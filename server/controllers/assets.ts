import { Request, Response } from "express";
import _ from "lodash";
import { Types } from "mongoose";

import { IAsset } from "../models/User";
import { Transaction } from "../models/Transaction";

import { logger } from "../log/logger";

export const create = async (req: Request, res: Response) => {
  try {
    const user = req.user!;

    if (!("title" in req.body)) {
      return res.status(400).send({ message: "field 'title' is required" });
    }

    const asset = {
      _id: new Types.ObjectId(),
      icon: req.body.icon ?? "",
      title: req.body.title,
      amount: req.body.amount ?? 0,
      detail: req.body.detail ?? "",
    };

    user.assets.push(asset);
    user.paymentMethods.push({
      type: "asset",
      ...asset,
      isChecked: true,
    });

    await user.saveReqUser();
    return res.status(200).send({
      assets: user.assets,
      paymentMethods: user.paymentMethods,
    });
  } catch (err: any) {
    logger.error(err.message);
    return res.status(500).send({ message: err.message });
  }
};

export const updateAll = async (req: Request, res: Response) => {
  try {
    /* validate */
    if (!("assets" in req.body))
      return res.status(409).send({ message: "field 'assets' is required" });

    const user = req.user!;
    if (!user.assets) user.assets = new Types.DocumentArray([]);

    const assetDict: { [key: string]: IAsset } = Object.fromEntries(
      user.assets.map((asset: any) => [asset._id, asset.toObject()])
    );

    const _assets: Types.DocumentArray<IAsset> = new Types.DocumentArray([]);

    const added: Types.DocumentArray<IAsset> = new Types.DocumentArray([]);
    const updated: Types.DocumentArray<IAsset> = new Types.DocumentArray([]);
    const removed: Types.DocumentArray<IAsset> = new Types.DocumentArray([]);

    let isUpdatedCards = false;
    let isUpdatedPM = false;

    for (let _asset of req.body.assets) {
      /* create asset */
      if (!("_id" in _asset)) {
        if (!("title" in _asset)) {
          return res.status(400).send({ message: "title is required" });
        }
        _asset._id = new Types.ObjectId();
        _assets.push(_asset);
        added.push(_asset);
      } else {
        /* update asset */
        const key = _asset._id;
        const exAsset = assetDict[key];
        if (!exAsset)
          return res.status(404).send({ message: "asset not found" });

        const asset = {
          _id: exAsset._id,
          icon: _asset.icon ?? exAsset.icon,
          title: _asset.title ?? exAsset.title,
          amount: _asset.amount ?? 0,
          detail: _asset.detail ?? exAsset.detail,
        };
        _assets.push(asset);

        delete assetDict[key];

        if (
          exAsset.icon !== asset.icon ||
          exAsset.title !== asset.title ||
          exAsset.detail !== asset.detail
        ) {
          updated.push(asset);
        }
      }
    }
    /* remove category */
    for (const asset of Object.values(assetDict)) {
      removed.push(asset);
    }

    isUpdatedPM = added.length > 0 || updated.length > 0 || removed.length > 0;
    user.assets = _assets;

    for (const asset of added) {
      const key = asset._id;
      user.paymentMethods.push({
        _id: key,
        type: "asset",
        icon: asset.icon,
        title: asset.title,
        detail: asset.detail,
        isChecked: true,
      });
    }

    for (const asset of updated) {
      const key = asset._id;
      for (let i = 0; i < user.cards.length; i++) {
        if (user.cards[i].linkedAssetId?.equals(key)) {
          user.cards[i].linkedAssetIcon = asset.icon;
          user.cards[i].linkedAssetTitle = asset.title;
          isUpdatedCards = true;
        }
      }
      const paymentMethodIdx = _.findIndex(user.paymentMethods, {
        _id: asset._id,
      });
      if (paymentMethodIdx !== -1) {
        user.paymentMethods[paymentMethodIdx].icon = asset.icon;
        user.paymentMethods[paymentMethodIdx].title = asset.title;
        user.paymentMethods[paymentMethodIdx].detail = asset.detail;

        /* update transactions */
        await Transaction.updateMany(
          { linkedPaymentMethodId: asset._id },
          {
            linkedPaymentMethodIcon: asset.icon,
            linkedPaymentMethodTitle: asset.title,
            linkedPaymentMethodDetail: asset.detail,
          }
        );
      }
    }

    for (const asset of removed) {
      const key = asset._id;
      for (let i = 0; i < user.cards.length; i++) {
        if (user.cards[i].linkedAssetId?.equals(key)) {
          user.cards[i].linkedAssetId = undefined;
          user.cards[i].linkedAssetIcon = undefined;
          user.cards[i].linkedAssetTitle = undefined;
        }
      }
      const paymentMethodIdx = _.findIndex(user.paymentMethods, {
        _id: new Types.ObjectId(asset._id),
      });
      if (paymentMethodIdx !== -1) {
        user.paymentMethods.splice(paymentMethodIdx, 1);
      }
    }
    await user.saveReqUser();
    return res.status(200).send({
      assets: user.assets,
      cards: isUpdatedCards ? user.cards : undefined,
      paymentMethods: isUpdatedPM ? user.paymentMethods : undefined,
    });
  } catch (err: any) {
    logger.error(err.message);
    return res.status(500).send({ message: err.message });
  }
};

export const find = async (req: Request, res: Response) => {
  try {
    const user = req.user!;

    return res.status(200).send({
      assets: user.assets,
    });
  } catch (err: any) {
    logger.error(err.message);
    return res.status(500).send({ message: err.message });
  }
};
