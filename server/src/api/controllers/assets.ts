import { Request, Response } from "express";

import { AssetService } from "src/services/users";
import { AssetNotFoundError } from "src/errors/NotFoundError";
import { FieldRequiredError } from "src/errors/InvalidError";

export const create = async (req: Request, res: Response) => {
  if (!("title" in req.body)) {
    throw new FieldRequiredError("title");
  }

  const user = req.user!;

  await AssetService.create(user, req.body);

  return res.status(200).send({
    assets: user.assets,
    paymentMethods: user.paymentMethods,
  });
};

export const update = async (req: Request, res: Response) => {
  for (let field of ["icon", "title", "amount", "detail"]) {
    if (!(field in req.body)) {
      throw new FieldRequiredError(field);
    }
  }

  const user = req.user!;

  /* update asset */
  const { idx, asset } = AssetService.findById(user, req.params._id);
  if (idx === -1) throw new AssetNotFoundError();

  const { isUpdatedCards, isUpdatedPM } = await AssetService.update(
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
  if (!("assets" in req.body)) throw new FieldRequiredError("assets");
  for (let _asset of req.body.assets) {
    if (!("_id" in _asset) && !("title" in _asset)) {
      throw new FieldRequiredError("title");
    }
  }

  const user = req.user!;

  const { isUpdatedCards, isUpdatedPM } = await AssetService.updateAll(
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

  if (req.params._id) {
    const assetId = req.params._id;
    const { asset } = AssetService.findById(user, assetId);
    if (!asset) throw new AssetNotFoundError();
    return res.status(200).send({ asset });
  }
  return res.status(200).send({
    assets: user.assets,
  });
};

export const remove = async (req: Request, res: Response) => {
  const user = req.user!;

  const { asset } = AssetService.findById(user, req.params._id);
  if (!asset) throw new AssetNotFoundError();

  const { isUpdatedCards } = await AssetService.remove(user, asset._id);

  return res.status(200).send({
    assets: user.assets,
    cards: isUpdatedCards ? user.cards : undefined,
    paymentMethods: user.paymentMethods,
  });
};
