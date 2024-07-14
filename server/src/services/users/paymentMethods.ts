import { IPaymentMethod, UserEntity } from "src/models/user.model";
import { ITransaction } from "src/models/transaction.model";
import { HydratedDocument, Types } from "mongoose";
import { findDocumentById } from "src/utils/document";

import { findById as findCardById } from "./cards";
import { cancelAsset, execAsset } from "./assets";

export const findById = (
  userRecord: UserEntity,
  paymentMethodId: string | Types.ObjectId
) => {
  const { idx, value } = findDocumentById({
    arr: userRecord.paymentMethods,
    id: paymentMethodId,
  });
  return { idx, paymentMethod: value as IPaymentMethod };
};

export const execPaymentMethod = async (
  userRecord: HydratedDocument<UserEntity>,
  transactionRecord: HydratedDocument<ITransaction>
) => {
  if (!transactionRecord.linkedPaymentMethodId) return;

  let assetId: Types.ObjectId | null = null;

  if (transactionRecord.linkedPaymentMethodType === "asset") {
    assetId = transactionRecord.linkedPaymentMethodId;
  } else if (transactionRecord.linkedPaymentMethodType === "card") {
    const { card } = findCardById(
      userRecord,
      transactionRecord.linkedPaymentMethodId
    );
    if (card && card.linkedAssetId) {
      assetId = card.linkedAssetId;
    }
  }

  if (assetId) {
    await execAsset(userRecord, assetId, transactionRecord);
  }
};

export const cancelPaymentMethod = async (
  userRecord: HydratedDocument<UserEntity>,
  transactionRecord: HydratedDocument<ITransaction>
) => {
  if (!transactionRecord.linkedPaymentMethodId) return;

  let assetId: Types.ObjectId | null = null;

  if (transactionRecord.linkedPaymentMethodType === "asset") {
    assetId = transactionRecord.linkedPaymentMethodId;
  } else if (transactionRecord.linkedPaymentMethodType === "card") {
    const { card } = findCardById(
      userRecord,
      transactionRecord.linkedPaymentMethodId
    );
    if (card && card.linkedAssetId) {
      assetId = card.linkedAssetId;
    }
  }

  if (assetId) {
    await cancelAsset(userRecord, assetId, transactionRecord);
  }
};

export const sort = async (userRecord: HydratedDocument<UserEntity>) => {
  const pmAsset = [];
  const pmCard = [];
  for (let pm of userRecord.paymentMethods) {
    if (pm.type === "asset") pmAsset.push(pm);
    else pmCard.push(pm);
  }
  userRecord.paymentMethods = new Types.DocumentArray([...pmCard, ...pmAsset]);
  await userRecord.save();
};
export const updatePaymentMethods = async (
  userRecord: HydratedDocument<UserEntity>,
  newPaymentMethods: any[]
) => {
  if (!userRecord.paymentMethods)
    userRecord.paymentMethods = new Types.DocumentArray([]);

  const pmDict: { [key: string]: IPaymentMethod } = Object.fromEntries(
    userRecord.paymentMethods.map((pm: any) => [pm._id, pm.toObject()])
  );

  const _paymentMethods: Types.DocumentArray<IPaymentMethod> =
    new Types.DocumentArray([]);

  for (let _pm of newPaymentMethods) {
    if (!("_id" in _pm) || !("isChecked" in _pm)) {
      continue;
    }
    const key = _pm._id;
    const isChecked = _pm.isChecked;

    /* update pm */
    const exPM = pmDict[key];
    if (exPM) {
      _paymentMethods.push({
        ...exPM,
        isChecked,
      });
      delete pmDict[key];
    }
  }

  /* block removing pm */
  if (Object.keys(pmDict).length > 0) {
    return;
  }

  userRecord.paymentMethods = _paymentMethods;
  await userRecord.save();
};
