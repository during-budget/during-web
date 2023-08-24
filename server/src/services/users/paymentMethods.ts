import { IUser } from "src/models/User";
import { ITransaction } from "src/models/Transaction";
import { HydratedDocument, Types } from "mongoose";
import { findDocumentById } from "src/utils/document";

import { findById as findCardById } from "./cards";
import { execAsset } from "./assets";

export const findById = (
  userRecord: IUser,
  paymentMethodId: string | Types.ObjectId
) => {
  const { idx, value } = findDocumentById({
    arr: userRecord.paymentMethods,
    id: paymentMethodId,
  });
  return { idx, paymentMethod: value };
};

export const execPaymentMethod = async (
  userRecord: HydratedDocument<IUser>,
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
