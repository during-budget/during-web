import { Types } from "mongoose";
import { ItemNotFoundError } from "src/errors/NotFoundError";
import { ItemModel } from "@models/item.model";
import * as PaymentService from "src/services/payments";
import { GoogleInAppHelper } from "src/lib/googleInAppHelper";

export const create = async (
  type: "chartSkin",
  title: string,
  price: number
) => {
  const itemRecord = await ItemModel.create({
    type,
    title,
    price,
  });

  return { item: itemRecord };
};

export const findByType = async (type: string) => {
  const itemRecordList = await ItemModel.find({
    type,
  });

  return { items: itemRecordList };
};

export const findByTitle = async (title: string) => {
  const itemRecord = await ItemModel.findOne({
    title,
  });

  return { item: itemRecord };
};

export const findByTypeAndTitle = async (title: string) => {
  const itemRecord = await ItemModel.findOne({
    title,
  });

  return { item: itemRecord };
};

export const isItemAvailable = async (
  userId: Types.ObjectId,
  title: string,
  isInAppProduct: boolean
): Promise<
  | { isAvailable: true }
  | {
      isAvailable: false;
      message: "PAIED_ALREADY" | "IN_APP_PRODUCT_NOT_ACTIVE";
    }
> => {
  const { item: itemRecord } = await findByTitle(title);

  if (!itemRecord) {
    throw new ItemNotFoundError();
  }

  if (isInAppProduct) {
    const helper = new GoogleInAppHelper();
    const isInAppProductActive = await helper.isInAppProductActive(
      itemRecord.title
    );

    if (!isInAppProductActive) {
      return { isAvailable: false, message: "IN_APP_PRODUCT_NOT_ACTIVE" };
    }
  }

  const { payment: exPayment } = await PaymentService.findPaymentPaidByTitle(
    { _id: userId },
    itemRecord.title
  );

  if (exPayment) {
    return { isAvailable: false, message: "PAIED_ALREADY" };
  }

  return { isAvailable: true };
};

export const updateById = async (
  itemId: string,
  title: string,
  price: number
) => {
  const itemRecord = await ItemModel.findByIdAndUpdate(
    itemId,
    {
      title,
      price,
    },
    { new: true }
  );

  return { item: itemRecord };
};

export const removeById = async (itemId: string) => {
  const itemRecord = await ItemModel.findByIdAndRemove(itemId, { new: true });

  return { item: itemRecord };
};
