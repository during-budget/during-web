import { ICard, UserEntity } from "src/models/user.model";
import { TransactionModel } from "src/models/transaction.model";

import { HydratedDocument, Types } from "mongoose";
import { findDocumentById } from "src/utils/document";
import { AssetService, PaymentMethodService } from ".";
import * as TransactionService from "src/services/transactions";

export const compareCardLinkedAsset = (card1: ICard, cared2: ICard) => {
  if (card1.linkedAssetId) {
    if (cared2.linkedAssetId) {
      if (card1.linkedAssetId.equals(cared2.linkedAssetId)) {
        return "keep";
      } else {
        return "updated";
      }
    } else {
      return "unset";
    }
  } else if (cared2.linkedAssetId) {
    return "updated";
  }
  return "keep";
};

export const findById = (
  userRecord: UserEntity,
  _id: Types.ObjectId | string
) => {
  const { idx, value } = findDocumentById({
    arr: userRecord.cards,
    id: _id,
  });
  return { idx, card: value };
};

export const create = async (
  userRecord: HydratedDocument<UserEntity>,
  _card: {
    icon?: string;
    title: string;
    detail?: string;
    paymentDate?: number;
    linkedAssetId?: Types.ObjectId;
    linkedAssetIcon?: string;
    linkedAssetTitle?: string;
  }
) => {
  const card = {
    _id: new Types.ObjectId(),
    icon: _card.icon ?? "",
    title: _card.title,
    detail: _card.detail ?? "",
    paymentDate: _card.paymentDate,
    linkedAssetId: _card.linkedAssetId,
    linkedAssetIcon: _card.linkedAssetIcon,
    linkedAssetTitle: _card.linkedAssetTitle,
  };

  userRecord.cards.push(card);
  userRecord.paymentMethods.push({
    type: "card",
    ...card,
    isChecked: true,
  });

  await userRecord.save();
};

export const update = async (
  userRecord: HydratedDocument<UserEntity>,
  card: ICard,
  newCard: ICard
) => {
  const isUpdatedIcon = card.icon !== newCard.icon;
  const isUpdatedTitle = card.title !== newCard.title;
  const isUpdatedDetail = card.detail !== newCard.detail;

  const status = compareCardLinkedAsset(card, newCard);

  switch (status) {
    case "keep":
      newCard.linkedAssetId = card.linkedAssetId;
      newCard.linkedAssetTitle = card.linkedAssetTitle;
      newCard.linkedAssetIcon = card.linkedAssetIcon;
      break;
    case "updated":
      const { asset } = AssetService.findById(
        userRecord,
        newCard.linkedAssetId!
      );
      if (asset) {
        newCard.linkedAssetId = asset._id;
        newCard.linkedAssetIcon = asset.icon;
        newCard.linkedAssetTitle = asset.title;
      }
      break;
    case "unset":
      newCard.linkedAssetId = undefined;
      newCard.linkedAssetIcon = undefined;
      newCard.linkedAssetTitle = undefined;
      break;
  }

  let isUpdatedPM = false;

  if (isUpdatedIcon || isUpdatedTitle || isUpdatedDetail) {
    const { paymentMethod } = PaymentMethodService.findById(
      userRecord,
      card._id
    );

    if (paymentMethod) {
      paymentMethod.icon = newCard.icon;
      paymentMethod.title = newCard.title;
      paymentMethod.detail = newCard.detail;
      isUpdatedPM = true;

      /* update transactions */

      const { transactions: transactionRecordList } =
        await TransactionService.findByPaymentMethod(userRecord, card._id);
      await Promise.all(
        transactionRecordList.map((transactionRecord) => {
          TransactionService.updatePaymentMethod(transactionRecord, {
            _id: newCard._id,
            type: "card",
            icon: newCard.icon,
            title: newCard.title,
            detail: newCard.detail,
          });
        })
      );
    }
  }
  card.icon = newCard.icon;
  card.title = newCard.title;
  card.detail = newCard.detail;

  await userRecord.save();
  return { isUpdatedPM };
};

export const updateAll = async (
  userRecord: HydratedDocument<UserEntity>,
  newCards: any[]
) => {
  const cardDict: { [key: string]: ICard } = Object.fromEntries(
    userRecord.cards.map((card: any) => [card._id, card.toObject()])
  );

  const _cards: Types.DocumentArray<ICard> = new Types.DocumentArray([]);

  const added: Types.DocumentArray<ICard> = new Types.DocumentArray([]);
  const updated: Types.DocumentArray<ICard> = new Types.DocumentArray([]);
  const removed: Types.DocumentArray<ICard> = new Types.DocumentArray([]);

  let isUpdatedPM = false;

  for (let _card of newCards) {
    /* create card */
    if (!("_id" in _card)) {
      if ("linkedAssetId" in _card) {
        const { asset } = AssetService.findById(
          userRecord,
          _card.linkedAssetId
        );
        if (!asset) continue;
        _card.linkedAssetIcon = asset.icon;
        _card.linkedAssetTitle = asset.title;
      }
      _card._id = new Types.ObjectId();
      _cards.push(_card);
      added.push(_card);
    } else {
      /* update card */
      const key = _card._id;
      const exCard = cardDict[key];
      if (exCard) {
        const card = {
          _id: exCard._id,
          icon: _card.icon ?? exCard.icon,
          title: _card.title ?? exCard.title,
          detail: _card.detail ?? exCard.detail,
          paymentDate: _card.paymentDate,
        } as ICard;

        const status = compareCardLinkedAsset(exCard, _card);

        switch (status) {
          case "keep":
            card.linkedAssetId = exCard.linkedAssetId;
            card.linkedAssetTitle = exCard.linkedAssetTitle;
            card.linkedAssetIcon = exCard.linkedAssetIcon;
            break;
          case "updated":
            const { asset } = AssetService.findById(
              userRecord,
              _card.linkedAssetId
            );
            if (asset) {
              card.linkedAssetId = asset._id;
              card.linkedAssetIcon = asset.icon;
              card.linkedAssetTitle = asset.title;
            }
            break;
          case "unset":
            card.linkedAssetId = undefined;
            card.linkedAssetIcon = undefined;
            card.linkedAssetTitle = undefined;
            break;
        }

        _cards.push(card);

        if (
          exCard.icon !== card.icon ||
          exCard.title !== card.title ||
          exCard.detail !== card.detail
        ) {
          updated.push(card);
        }
      }

      delete cardDict[key];
    }
  }
  /* remove category */
  for (const card of Object.values(cardDict)) {
    removed.push(card);
  }

  isUpdatedPM = added.length > 0 || updated.length > 0 || removed.length > 0;
  userRecord.cards = _cards;

  for (const card of added) {
    const key = card._id;
    userRecord.paymentMethods.push({
      _id: key,
      type: "card",
      icon: card.icon,
      title: card.title,
      detail: card.detail,
      isChecked: true,
    });
  }

  for (const card of updated) {
    const key = card._id;
    const { paymentMethod } = PaymentMethodService.findById(
      userRecord,
      card._id
    );
    if (paymentMethod) {
      paymentMethod.icon = card.icon;
      paymentMethod.title = card.title;
      paymentMethod.detail = card.detail;
      isUpdatedPM = true;

      /* update transactions */

      const { transactions: transactionRecordList } =
        await TransactionService.findByPaymentMethod(userRecord, card._id);
      await Promise.all(
        transactionRecordList.map((transactionRecord) => {
          TransactionService.updatePaymentMethod(transactionRecord, {
            _id: card._id,
            type: "card",
            icon: card.icon,
            title: card.title,
            detail: card.detail,
          });
        })
      );
    }
  }

  for (const card of removed) {
    const { idx } = PaymentMethodService.findById(userRecord, card._id);
    if (idx !== -1) {
      userRecord.paymentMethods.splice(idx, 1);
    }
  }

  await userRecord.save();
  return { isUpdatedPM };
};

export const remove = async (
  userRecord: HydratedDocument<UserEntity>,
  cardId: Types.ObjectId
) => {
  const { idx, card } = findById(userRecord, cardId);

  if (card) {
    const { idx: paymentMethodIdx } = PaymentMethodService.findById(
      userRecord,
      card._id
    );
    if (paymentMethodIdx !== -1) {
      userRecord.paymentMethods.splice(paymentMethodIdx, 1);
    }
    userRecord.cards.splice(idx, 1);
    await userRecord.save();
  }
};

export const createPostPaidTransaction = async (
  userRecord: HydratedDocument<UserEntity>,
  card: ICard,
  year: number,
  month: number,
  amount: number
) => {
  const transactionRecord = await TransactionModel.create({
    userId: userRecord._id,
    linkedPaymentMethodType: "card",
    linkedPaymentMethodId: card._id,
    linkedPaymentMethodTitle: card.title,
    linkedPaymentMethodIcon: card.icon,
    linkedPaymentMethodDetail: card.detail,
    isCurrent: true,
    isExpense: true,
    year,
    month,
    amount,
  });

  if (card.linkedAssetId) {
    const { asset } = AssetService.findById(userRecord, card.linkedAssetId);
    if (asset) {
      asset.amount -= transactionRecord.amount;
      await userRecord.save();
    }
  }

  return { transaction: transactionRecord };
};

export const findPostPaidTransactionsByYear = async (
  userRecord: HydratedDocument<UserEntity>,
  paymentMethodId: Types.ObjectId | string,
  year: number
) => {
  const transactionRecordList = await TransactionModel.find({
    userId: userRecord._id,
    linkedPaymentMethodId: new Types.ObjectId(paymentMethodId),
    year,
  });

  return { transactions: transactionRecordList };
};

export const findPostPaidTransaction = async (
  userRecord: HydratedDocument<UserEntity>,
  cardRecord: ICard,
  year: number,
  month: number
) => {
  const transactionRecord = await TransactionModel.findOne({
    userId: userRecord._id,
    linkedPaymentMethodId: cardRecord._id,
    year,
    month,
  });

  return { transaction: transactionRecord };
};

export const updatePostPaidTransactionAmount = async (
  userRecord: HydratedDocument<UserEntity>,
  card: ICard,
  year: number,
  month: number,
  amount: number
) => {
  const { transaction: transactionRecord } = await findPostPaidTransaction(
    userRecord,
    card,
    year,
    month
  );
  if (!transactionRecord) return { transaction: null };

  const exAmount = transactionRecord.amount;
  const newAmount = amount;

  if (card.linkedAssetId) {
    const { asset } = AssetService.findById(userRecord, card.linkedAssetId);
    if (asset) {
      asset.amount += exAmount - newAmount;
      await userRecord.save();
    }
  }
  transactionRecord.amount = newAmount;
  await transactionRecord.save();
  return { transaction: transactionRecord };
};

export const removePostPaidTransaction = async (
  userRecord: HydratedDocument<UserEntity>,
  card: ICard,
  year: number,
  month: number
) => {
  const { transaction: transactionRecord } = await findPostPaidTransaction(
    userRecord,
    card,
    year,
    month
  );
  if (!transactionRecord) {
    return { transaction: null };
  }

  if (card.linkedAssetId) {
    const { asset } = AssetService.findById(userRecord, card.linkedAssetId);
    if (asset) {
      asset.amount += transactionRecord.amount;
      await userRecord.save();
    }
  }
  await transactionRecord.remove();
  return { transaction: transactionRecord };
};
