import { ICategory } from "@models/Budget";
import { Types } from "mongoose";
import { Transaction as TransactionModel } from "src/models/Transaction";

export const findByBudgetId = async (budgetId: Types.ObjectId | String) => {
  const transactionRecordList = await TransactionModel.find({ budgetId });

  return { transactions: transactionRecordList };
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

export const removeByUserId = async (userId: Types.ObjectId | string) => {
  return await TransactionModel.deleteMany({ userId });
};
