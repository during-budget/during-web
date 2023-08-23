import { Request, Response } from "express";

import { FIELD_REQUIRED, NOT_FOUND } from "../message";

import * as UserService from "src/services/user";

export const create = async (req: Request, res: Response) => {
  if (!("title" in req.body)) {
    return res.status(400).send({ message: FIELD_REQUIRED("title") });
  }

  const user = req.user!;

  await UserService.createAsset(user, req.body);

  return res.status(200).send({
    assets: user.assets,
    paymentMethods: user.paymentMethods,
  });
};

export const update = async (req: Request, res: Response) => {
  for (let field of ["icon", "title", "amount", "detail"]) {
    if (!(field in req.body)) {
      return res.status(400).send({
        message: FIELD_REQUIRED(field),
      });
    }
  }

  const user = req.user!;

  /* update asset */
  const { idx, asset } = UserService.findAsset(user, req.params._id);
  if (idx === -1) return res.status(404).send({ message: NOT_FOUND("asset") });

  const { isUpdatedCards, isUpdatedPM } = await UserService.updateAsset(
    user,
    asset,
    req.body
  );

  return res.status(200).send({
    assets: user.assets,
    cards: isUpdatedCards ? user.cards : undefined,
    paymentMethods: isUpdatedPM ? user.paymentMethods : undefined,
  });
};

export const updateAll = async (req: Request, res: Response) => {
  /* validate */
  if (!("assets" in req.body))
    return res.status(400).send({ message: FIELD_REQUIRED("assets") });
  for (let _asset of req.body.assets) {
    if (!("_id" in _asset) && !("title" in _asset)) {
      return res.status(400).send({ message: FIELD_REQUIRED("title") });
    }
  }

  const user = req.user!;

  const { isUpdatedCards, isUpdatedPM } = await UserService.updateAssetAll(
    user,
    req.body.assets
  );

  return res.status(200).send({
    assets: user.assets,
    cards: isUpdatedCards ? user.cards : undefined,
    paymentMethods: isUpdatedPM ? user.paymentMethods : undefined,
  });
};

export const find = async (req: Request, res: Response) => {
  const user = req.user!;

  return res.status(200).send({
    assets: user.assets,
  });
};

export const remove = async (req: Request, res: Response) => {
  const user = req.user!;

  const { idx } = UserService.findAsset(user, req.params._id);
  if (idx === -1) return res.status(404).send({ message: NOT_FOUND("asset") });

  const { isUpdatedCards } = await UserService.removeAssetByIdx(user, idx);

  return res.status(200).send({
    assets: user.assets,
    cards: isUpdatedCards ? user.cards : undefined,
    paymentMethods: user.paymentMethods,
  });
};
