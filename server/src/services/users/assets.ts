import { HydratedDocument, Types } from "mongoose";

import { IAsset, IUser } from "src/models/User";
import { ITransaction } from "src/models/Transaction";

import { findDocumentById } from "src/utils/document";

import { findById as findPaymentMethodById } from "./paymentMethods";
import * as TransactionService from "src/services/transactions";

export const findById = (userRecord: IUser, _id: Types.ObjectId | string) => {
  const { idx, value } = findDocumentById({
    arr: userRecord.assets,
    id: _id,
  });
  return { idx, asset: value };
};

export const create = async (
  userRecord: HydratedDocument<IUser>,
  _asset: {
    icon?: string;
    title: string;
    amount?: number;
    detail?: string;
  }
) => {
  const asset = {
    _id: new Types.ObjectId(),
    icon: _asset.icon ?? "",
    title: _asset.title,
    amount: _asset.amount ?? 0,
    detail: _asset.detail ?? "",
  };

  userRecord.assets.push(asset);
  userRecord.paymentMethods.push({
    type: "asset",
    ...asset,
    isChecked: true,
  });

  await userRecord.save();
};

export const update = async (
  userRecord: HydratedDocument<IUser>,
  asset: IAsset,
  newAsset: {
    icon: string;
    title: string;
    amount: number;
    detail: string;
  }
) => {
  const isUpdatedIcon = asset.icon !== newAsset.icon;
  const isUpdatedTitle = asset.title !== newAsset.title;
  const isUpdatedDetail = asset.detail !== newAsset.detail;

  asset.icon = newAsset.icon;
  asset.title = newAsset.title;
  asset.amount = newAsset.amount;
  asset.detail = newAsset.detail;

  let isUpdatedCards = false;
  let isUpdatedPM = false;

  if (isUpdatedIcon || isUpdatedTitle) {
    for (let i = 0; i < userRecord.cards.length; i++) {
      if (userRecord.cards[i].linkedAssetId?.equals(asset._id)) {
        userRecord.cards[i].linkedAssetIcon = asset.icon;
        userRecord.cards[i].linkedAssetTitle = asset.title;
        isUpdatedCards = true;
      }
    }

    if (isUpdatedDetail) {
      const { idx: paymentMethodIdx } = findPaymentMethodById(
        userRecord,
        asset._id
      );

      if (paymentMethodIdx !== -1) {
        userRecord.paymentMethods[paymentMethodIdx].icon = asset.icon;
        userRecord.paymentMethods[paymentMethodIdx].title = asset.title;
        userRecord.paymentMethods[paymentMethodIdx].detail = asset.detail;
        isUpdatedPM = true;

        /* update transactions */

        const { transactions: transactionRecordList } =
          await TransactionService.findByPaymentMethod(userRecord, asset._id);
        await Promise.all(
          transactionRecordList.map((transactionRecord) => {
            TransactionService.updatePaymentMethod(transactionRecord, {
              _id: asset._id,
              type: "asset",
              icon: asset.icon,
              title: asset.title,
              detail: asset.detail,
            });
          })
        );
      }
    }
  }

  await userRecord.save();
  return { isUpdatedCards, isUpdatedPM };
};

export const updateAll = async (
  userRecord: HydratedDocument<IUser>,
  newAssets: any[]
) => {
  const assetDict: { [key: string]: IAsset } = Object.fromEntries(
    userRecord.assets.map((asset: any) => [asset._id, asset.toObject()])
  );

  const _assets: Types.DocumentArray<IAsset> = new Types.DocumentArray([]);

  const added: Types.DocumentArray<IAsset> = new Types.DocumentArray([]);
  const updated: Types.DocumentArray<IAsset> = new Types.DocumentArray([]);
  const removed: Types.DocumentArray<IAsset> = new Types.DocumentArray([]);

  let isUpdatedCards = false;
  let isUpdatedPM = false;

  for (let _asset of newAssets) {
    /* create asset */
    if (!("_id" in _asset)) {
      _asset._id = new Types.ObjectId();
      _assets.push(_asset);
      added.push(_asset);
    } else {
      /* update asset */
      const key = _asset._id;
      const exAsset = assetDict[key];
      if (exAsset) {
        const asset = {
          _id: exAsset._id,
          icon: _asset.icon ?? exAsset.icon,
          title: _asset.title ?? exAsset.title,
          amount: _asset.amount ?? 0,
          detail: _asset.detail ?? exAsset.detail,
        };
        _assets.push(asset);

        if (
          exAsset.icon !== asset.icon ||
          exAsset.title !== asset.title ||
          exAsset.detail !== asset.detail
        ) {
          updated.push(asset);
        }
      }

      delete assetDict[key];
    }
  }
  /* remove category */
  for (const asset of Object.values(assetDict)) {
    removed.push(asset);
  }

  isUpdatedPM = added.length > 0 || updated.length > 0 || removed.length > 0;
  userRecord.assets = _assets;
  await userRecord.save();

  for (const asset of added) {
    const key = asset._id;
    userRecord.paymentMethods.push({
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
    for (let i = 0; i < userRecord.cards.length; i++) {
      if (userRecord.cards[i].linkedAssetId?.equals(key)) {
        userRecord.cards[i].linkedAssetIcon = asset.icon;
        userRecord.cards[i].linkedAssetTitle = asset.title;
        isUpdatedCards = true;
      }
    }
    const { idx: paymentMethodIdx } = findPaymentMethodById(
      userRecord,
      asset._id
    );
    if (paymentMethodIdx !== -1) {
      userRecord.paymentMethods[paymentMethodIdx].icon = asset.icon;
      userRecord.paymentMethods[paymentMethodIdx].title = asset.title;
      userRecord.paymentMethods[paymentMethodIdx].detail = asset.detail;

      /* update transactions */
      const { transactions: transactionRecordList } =
        await TransactionService.findByPaymentMethod(userRecord, asset._id);
      await Promise.all(
        transactionRecordList.map((transactionRecord) => {
          TransactionService.updatePaymentMethod(transactionRecord, {
            _id: asset._id,
            type: "asset",
            icon: asset.icon,
            title: asset.title,
            detail: asset.detail,
          });
        })
      );
    }
  }

  for (const asset of removed) {
    const key = asset._id;
    for (let i = 0; i < userRecord.cards.length; i++) {
      if (userRecord.cards[i].linkedAssetId?.equals(key)) {
        userRecord.cards[i].linkedAssetId = undefined;
        userRecord.cards[i].linkedAssetIcon = undefined;
        userRecord.cards[i].linkedAssetTitle = undefined;
      }
    }

    const { idx: paymentMethodIdx } = findPaymentMethodById(
      userRecord,
      asset._id
    );
    if (paymentMethodIdx !== -1) {
      userRecord.paymentMethods.splice(paymentMethodIdx, 1);
    }
  }
  await userRecord.save();
  return { isUpdatedCards, isUpdatedPM };
};

export const execAsset = async (
  userRecord: HydratedDocument<IUser>,
  assetId: Types.ObjectId,
  transactionRecord: HydratedDocument<ITransaction>
) => {
  const { asset } = findById(userRecord, assetId);
  if (asset) {
    if (transactionRecord.isExpense) asset.amount -= transactionRecord.amount;
    else asset.amount += transactionRecord.amount;
    await userRecord.save();
  }
};

export const cancelAsset = async (
  userRecord: HydratedDocument<IUser>,
  assetId: Types.ObjectId,
  transactionRecord: HydratedDocument<ITransaction>
) => {
  const { asset } = findById(userRecord, assetId);
  if (asset) {
    if (transactionRecord.isExpense) asset.amount += transactionRecord.amount;
    else asset.amount -= transactionRecord.amount;
    await userRecord.save();
  }
};

export const remove = async (
  userRecord: HydratedDocument<IUser>,
  cardId: Types.ObjectId
) => {
  let isUpdatedCards = false;

  const { idx, asset } = findById(userRecord, cardId);

  if (asset) {
    for (let i = 0; i < userRecord.cards.length; i++) {
      if (userRecord.cards[i].linkedAssetId?.equals(asset._id)) {
        userRecord.cards[i].linkedAssetId = undefined;
        userRecord.cards[i].linkedAssetIcon = undefined;
        userRecord.cards[i].linkedAssetTitle = undefined;
        isUpdatedCards = true;
      }
    }

    const { idx: paymentMethodIdx } = findPaymentMethodById(
      userRecord,
      userRecord.assets[idx]._id
    );
    if (paymentMethodIdx !== -1) {
      userRecord.paymentMethods.splice(paymentMethodIdx, 1);
    }
    userRecord.assets.splice(idx, 1);
    await userRecord.save();
  }
  return { isUpdatedCards };
};
