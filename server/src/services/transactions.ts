import { IBudget, ICategory } from "@models/Budget";
import { IUser } from "@models/User";
import { HydratedDocument, Types } from "mongoose";
import {
  ITransaction,
  Transaction,
  Transaction as TransactionModel,
} from "src/models/Transaction";

export const create = async (
  userRecord: HydratedDocument<IUser>,
  budgetRecord: HydratedDocument<IBudget>,
  category: ICategory,
  fields: {
    date: string;
    isCurrent: boolean;
    icon?: string;
    title?: string;
    amount: number;
    tags?: string[];
    memo?: string;
    updateAsset?: boolean;
  }
) => {
  const transactionRecord = await TransactionModel.create({
    userId: userRecord._id,
    budgetId: budgetRecord._id,
    category,
    isExpense: category.isExpense,
    isIncome: category.isIncome,
    ...fields,
  });

  return { transaction: transactionRecord };
};

export const findByBudgetId = async (budgetId: Types.ObjectId | String) => {
  const transactionRecordList = await TransactionModel.find({ budgetId });

  return { transactions: transactionRecordList };
};

export const findByPaymentMethod = async (
  userRecord: HydratedDocument<IUser>,
  paymentMethodId: Types.ObjectId
) => {
  const transactionRecordList = await Transaction.find({
    userId: userRecord._id,
    linkedPaymentMethodId: paymentMethodId,
  });

  return { transactions: transactionRecordList };
};

export const updateCategory = async (
  userRecord: IUser,
  categoryId: Types.ObjectId,
  newCategory: { categoryId?: Types.ObjectId; _id?: Types.ObjectId }
) => {
  newCategory.categoryId = newCategory.categoryId ?? newCategory._id;

  const transactionRecordList = await TransactionModel.find({
    userId: userRecord._id,
    "category.categoryId": categoryId,
  });

  await Promise.all(
    transactionRecordList.map((transactionRecord) => {
      Object.assign(transactionRecord.category, newCategory);
      transactionRecord.markModified("category");
      transactionRecord.save();
    })
  );
};

export const replaceTransactionsCategory = async (
  budgetId: Types.ObjectId | String,
  exCategory: ICategory,
  newCategory: ICategory
) => {
  const transactionRecordList = await TransactionModel.updateMany(
    {
      budgetId,
      "category.categoryId": exCategory.categoryId,
    },
    { category: newCategory }
  );

  return { transactions: transactionRecordList };
};

export const linkTransaction = async (
  transactionRecord: HydratedDocument<ITransaction>,
  linkId: Types.ObjectId
) => {
  transactionRecord.linkId = linkId;
  await transactionRecord.save();
};

export const isCurrent = (transactionRecord: HydratedDocument<ITransaction>) =>
  transactionRecord.isCurrent;

export const isCurrentAndLinked = (
  transactionRecord: HydratedDocument<ITransaction>
) => transactionRecord.isCurrent && transactionRecord.linkId;

export const hasToUpdateAsset = (
  transactionRecord: HydratedDocument<ITransaction>
) => isCurrent(transactionRecord) && transactionRecord.updateAsset;

export const findLinkedTransaction = async (
  transactionRecord: HydratedDocument<ITransaction>
) => {
  const transactionRecordLinked = transactionRecord.linkId
    ? await TransactionModel.findById(transactionRecord.linkId)
    : null;

  return { transaction: transactionRecordLinked };
};

export const updateOverAmount = async (
  transactionModelCurrent: HydratedDocument<ITransaction>,
  transactionModelScheduled: HydratedDocument<ITransaction>
) => {
  transactionModelCurrent.overAmount =
    transactionModelCurrent.amount - transactionModelScheduled.amount;
  await transactionModelCurrent.save();
};

export const updatePaymentMethod = async (
  transactionRecord: HydratedDocument<ITransaction>,
  paymentMethod: {
    _id: Types.ObjectId;
    type: "asset" | "card";
    icon: string;
    title: string;
    detail: string;
  }
) => {
  transactionRecord.linkedPaymentMethodId = paymentMethod._id;
  transactionRecord.linkedPaymentMethodType = paymentMethod.type;
  transactionRecord.linkedPaymentMethodIcon = paymentMethod.icon;
  transactionRecord.linkedPaymentMethodTitle = paymentMethod.title;
  transactionRecord.linkedPaymentMethodDetail = paymentMethod.detail;
  await transactionRecord.save();
};

export const removeByUserId = async (userId: Types.ObjectId | string) => {
  return await TransactionModel.deleteMany({ userId });
};

export const removeByBudgetId = async (budgetId: Types.ObjectId) => {
  return await TransactionModel.deleteMany({ budgetId });
};
