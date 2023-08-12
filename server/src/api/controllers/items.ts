import { Request, Response } from "express";
import _ from "lodash";
import { Types } from "mongoose";

import { IPaymentMethod } from "@models/User";

import { logger } from "@logger";
import { FIELD_REQUIRED, NOT_FOUND, PM_CANNOT_BE_REMOVED } from "../message";
import { Item } from "@models/Item";
import { FIELD_INVALID } from "../message";

export const create = async (req: Request, res: Response) => {
  try {
    if (!("type" in req.body)) {
      return res.status(400).send({ message: FIELD_REQUIRED("type") });
    }
    if (req.body.type !== "chartSkin") {
      return res.status(400).send({ message: FIELD_INVALID("type") });
    }
    if (!("title" in req.body)) {
      return res.status(400).send({ message: FIELD_REQUIRED("title") });
    }
    if (!("price" in req.body)) {
      return res.status(400).send({ message: FIELD_REQUIRED("price") });
    }

    const item = await Item.create({
      type: req.body.type,
      title: req.body.title,
      price: req.body.price,
    });

    return res.status(200).send({
      item,
    });
  } catch (err: any) {
    logger.error(err.message);
    return res.status(500).send({ message: err.message });
  }
};

export const find = async (req: Request, res: Response) => {
  try {
    if (!("type" in req.query)) {
      return res.status(400).send({ message: FIELD_REQUIRED("type") });
    }

    const items = await Item.find({ type: req.query.type });
    return res.status(200).send({
      items,
    });
  } catch (err: any) {
    logger.error(err.message);
    return res.status(500).send({ message: err.message });
  }
};

export const update = async (req: Request, res: Response) => {
  try {
    if (!("title" in req.body)) {
      return res.status(400).send({ message: FIELD_REQUIRED("title") });
    }
    if (!("price" in req.body)) {
      return res.status(400).send({ message: FIELD_REQUIRED("price") });
    }

    const item = await Item.findByIdAndUpdate(
      req.params._id,
      {
        title: req.body.title,
        price: req.body.price,
      },
      { new: true }
    );

    if (!item) {
      return res.status(404).send({ message: NOT_FOUND("item") });
    }
    return res.status(200).send({
      item,
    });
  } catch (err: any) {
    logger.error(err.message);
    return res.status(500).send({ message: err.message });
  }
};

export const remove = async (req: Request, res: Response) => {
  try {
    const item = await Item.findByIdAndRemove(req.params._id, { new: true });

    if (!item) {
      return res.status(404).send({ message: NOT_FOUND("item") });
    }
    return res.status(200).send({});
  } catch (err: any) {
    logger.error(err.message);
    return res.status(500).send({ message: err.message });
  }
};
