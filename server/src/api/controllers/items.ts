import { Request, Response } from "express";
import _ from "lodash";

import { FIELD_REQUIRED, NOT_FOUND } from "../message";
import { FIELD_INVALID } from "../message";

import * as ItemService from "src/services/items";

export const create = async (req: Request, res: Response) => {
  if (!("type" in req.body)) {
    return res.status(400).send({ message: FIELD_REQUIRED("type") });
  }
  if (!("title" in req.body)) {
    return res.status(400).send({ message: FIELD_REQUIRED("title") });
  }
  if (!("price" in req.body)) {
    return res.status(400).send({ message: FIELD_REQUIRED("price") });
  }
  const type = req.body.type as string;
  const title = req.body.title as string;
  const price = parseInt(req.body.price);

  if (type !== "chartSkin") {
    return res.status(400).send({ message: FIELD_INVALID("type") });
  }

  const { item } = await ItemService.create(type, title, price);

  return res.status(200).send({
    item,
  });
};

export const find = async (req: Request, res: Response) => {
  if (!("type" in req.query)) {
    return res.status(400).send({ message: FIELD_REQUIRED("type") });
  }

  const type = req.query.type as string;
  const { items } = await ItemService.findByType(type);

  return res.status(200).send({
    items,
  });
};

export const update = async (req: Request, res: Response) => {
  if (!("title" in req.body)) {
    return res.status(400).send({ message: FIELD_REQUIRED("title") });
  }
  if (!("price" in req.body)) {
    return res.status(400).send({ message: FIELD_REQUIRED("price") });
  }

  const itemId = req.params._id as string;
  const title = req.body.title as string;
  const price = parseInt(req.body.price);

  const { item } = await ItemService.updateById(itemId, title, price);

  if (!item) {
    return res.status(404).send({ message: NOT_FOUND("item") });
  }

  return res.status(200).send({
    item,
  });
};

export const remove = async (req: Request, res: Response) => {
  const itemId = req.params._id as string;

  const { item } = await ItemService.removeById(itemId);

  if (!item) {
    return res.status(404).send({ message: NOT_FOUND("item") });
  }
  return res.status(200).send({});
};
