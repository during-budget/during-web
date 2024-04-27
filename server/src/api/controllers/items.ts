import { Request, Response } from "express";
import _ from "lodash";

import * as ItemService from "src/services/items";
import { FieldInvalidError, FieldRequiredError } from "src/errors/InvalidError";
import { ItemNotFoundError } from "src/errors/NotFoundError";

export const create = async (req: Request, res: Response) => {
  if (!("type" in req.body)) throw new FieldRequiredError("type");
  if (!("title" in req.body)) throw new FieldRequiredError("title");
  if (!("price" in req.body)) throw new FieldRequiredError("price");
  const type = req.body.type as string;
  const title = req.body.title as string;
  const price = parseInt(req.body.price);

  if (type !== "chartSkin") throw new FieldInvalidError("type");

  const { item } = await ItemService.create(type, title, price);

  return res.status(200).send({
    item,
  });
};

export const find = async (req: Request, res: Response) => {
  if (!("type" in req.query)) throw new FieldRequiredError("type");

  const type = req.query.type as string;
  const { items } = await ItemService.findByType(type);

  return res.status(200).send({
    items,
  });
};

export const isItemAvailable = async (req: Request, res: Response) => {
  const userId = req.user!.id;

  if (!("title" in req.query) || !req.query.title)
    throw new FieldRequiredError("title");

  const title = req.query.title.toString();

  const isInAppProduct =
    "is-mobile" in req.query || !req.query["is-mobile"]
      ? req.query["is-mobile"] === "true"
      : false;

  const result = await ItemService.isItemAvailable(
    userId,
    title,
    isInAppProduct
  );

  return res.status(200).send(result);
};

export const update = async (req: Request, res: Response) => {
  if (!("title" in req.body)) throw new FieldRequiredError("title");
  if (!("price" in req.body)) throw new FieldRequiredError("price");

  const itemId = req.params._id as string;
  const title = req.body.title as string;
  const price = parseInt(req.body.price);

  const { item } = await ItemService.updateById(itemId, title, price);

  if (!item) throw new ItemNotFoundError();

  return res.status(200).send({
    item,
  });
};

export const remove = async (req: Request, res: Response) => {
  const itemId = req.params._id as string;

  const { item } = await ItemService.removeById(itemId);

  if (!item) throw new ItemNotFoundError();
  return res.status(200).send({});
};
