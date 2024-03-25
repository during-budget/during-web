import { IBudget, ICategory } from "@models/Budget";
import { UserEntity } from "@models/User";
import { HydratedDocument, Types } from "mongoose";
import {
  ITransaction,
  Transaction,
  Transaction as TransactionModel,
} from "src/models/Transaction";
import * as BudgetService from "./budgets";
import { CategoryService as BudgetCategoryService } from "src/services/budgets";
import * as UserService from "./users";
import { PaymentMethodService } from "./users";
import {
  BudgetNotFoundError,
  CategoryNotFoundError,
  PaymentMethodNotFoundError,
  UserNotFoundError,
} from "src/errors/NotFoundError";
import { IsCurrentCannotBeUpdatedError } from "src/errors/ConfilicError";

export const create = async (
  userRecord: HydratedDocument<UserEntity>,
  to: {
    budgetId: Types.ObjectId | string;
    categoryId: Types.ObjectId | string;
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
  const { budget: budgetRecord } = await BudgetService.findById(to.budgetId);
  if (!budgetRecord) throw new BudgetNotFoundError();

  const { category } = BudgetCategoryService.findById(
    budgetRecord,
    to.categoryId
  );
  if (!category) throw new CategoryNotFoundError();

  const transactionRecord = await TransactionModel.create({
    userId: userRecord._id,
    budgetId: budgetRecord._id,
    category,
    isExpense: category.isExpense,
    isIncome: category.isIncome,
    date: to.date,
    isCurrent: to.isCurrent,
    icon: to.icon,
    title: to.title,
    amount: to.amount,
    tags: to.tags,
    memo: to.memo,
    updateAsset: to.updateAsset,
  });

  return { transaction: transactionRecord, budget: budgetRecord };
};

export const isUser = (
  transactionRecord: ITransaction,
  userRecord: UserEntity
) => transactionRecord.userId.equals(userRecord._id);

export const findAll = async () => {
  const transactionRecords = await TransactionModel.find({});

  return { transactions: transactionRecords };
};

export const findByUser = async (userId: Types.ObjectId | String) => {
  const transactionRecords = await TransactionModel.find({ userId });

  return { transactions: transactionRecords };
};

export const findByLinkedPaymentMethodIdBetweenDates = async (
  userRecord: HydratedDocument<UserEntity>,
  linkedPaymentMethodId: Types.ObjectId | string,
  startDate: Date,
  endDate: Date
) => {
  const transactionRecords = await TransactionModel.find({
    userId: userRecord._id,
    budgetId: { $exists: true, $ne: userRecord.basicBudgetId },
    linkedPaymentMethodId,
    date: { $gte: startDate, $lt: endDate },
  });

  return { transactions: transactionRecords };
};

export const findByTag = async (
  userRecord: HydratedDocument<UserEntity>,
  tag: string
) => {
  const transactionRecords = await TransactionModel.find({
    userId: userRecord._id,
    budgetId: { $exists: true, $ne: userRecord.basicBudgetId },
    tags: { $elemMatch: { $eq: tag } },
  });

  return { transactions: transactionRecords };
};

export const findById = async (transactionId: Types.ObjectId | String) => {
  const transactionRecord = await TransactionModel.findById(transactionId);

  return { transaction: transactionRecord };
};

export const findByBudgetId = async (budgetId: Types.ObjectId | String) => {
  const transactionRecordList = await TransactionModel.find({ budgetId });

  return { transactions: transactionRecordList };
};

export const findByPaymentMethod = async (
  userRecord: HydratedDocument<UserEntity>,
  paymentMethodId: Types.ObjectId
) => {
  const transactionRecordList = await Transaction.find({
    userId: userRecord._id,
    linkedPaymentMethodId: paymentMethodId,
  });

  return { transactions: transactionRecordList };
};

export const updateCategory = async (
  userRecord: UserEntity,
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
  transactionRecord1: HydratedDocument<ITransaction>,
  transactionRecord2: HydratedDocument<ITransaction>
) => {
  transactionRecord1.linkId = transactionRecord2._id;
  transactionRecord2.linkId = transactionRecord1._id;
  if (transactionRecord1.isCurrent && !transactionRecord2.isCurrent) {
    transactionRecord1.overAmount =
      transactionRecord1.amount - transactionRecord2.amount;
  } else if (!transactionRecord1.isCurrent && transactionRecord2.isCurrent) {
    transactionRecord2.overAmount =
      transactionRecord2.amount - transactionRecord1.amount;
  }
  await transactionRecord1.save();
  await transactionRecord2.save();
};

export const isCurrent = (transactionRecord: HydratedDocument<ITransaction>) =>
  transactionRecord.isCurrent;

export const isCurrentAndLinked = (
  transactionRecord: HydratedDocument<ITransaction>
) => transactionRecord.isCurrent && transactionRecord.linkId;

export const hasToUpdateAsset = (
  transactionRecord: HydratedDocument<ITransaction>
) => isCurrent(transactionRecord) && transactionRecord.updateAsset;

export const hasLinkedPaymentMethod = (
  transactionRecord: HydratedDocument<ITransaction>
) => transactionRecord.linkedPaymentMethodId;

export const findLinkedTransaction = async (
  transactionRecord: HydratedDocument<ITransaction>
) => {
  const transactionRecordLinked = transactionRecord.linkId
    ? await TransactionModel.findById(transactionRecord.linkId)
    : null;

  return { transaction: transactionRecordLinked };
};

export const update = async (
  transactionRecord: HydratedDocument<ITransaction>,
  to: {
    date: Date;
    icon: string;
    title: [string];
    tags: [string];
    memo: string;
    categoryId: Types.ObjectId | string;
    amount: number;
    updateAsset: boolean;
    isCurrent: boolean;
    linkedPaymentMethodId?: Types.ObjectId | string;
  }
) => {
  const { transaction: transactionRecordLinked } = await findLinkedTransaction(
    transactionRecord
  );

  const { user: userRecord } = await UserService.findById(
    transactionRecord.userId
  );
  if (!userRecord) throw new UserNotFoundError();

  const { budget: budgetRecord } = await BudgetService.findById(
    transactionRecord.budgetId
  );
  if (!budgetRecord) throw new BudgetNotFoundError();

  const { category } = BudgetCategoryService.findById(
    budgetRecord,
    to.categoryId
  );
  if (!category) throw new CategoryNotFoundError();

  /* update date, icon, title, tags, memo */
  transactionRecord.date = to.date;
  transactionRecord.icon = to.icon;
  transactionRecord.title = to.title;
  transactionRecord.tags = to.tags;
  transactionRecord.memo = to.memo;

  /* update category */
  let isUpdatedCategory = !transactionRecord.category.categoryId.equals(
    category.categoryId
  );
  if (isUpdatedCategory) {
    transactionRecord.isExpense = category.isExpense;
    transactionRecord.isIncome = category.isIncome;
    transactionRecord.category = {
      ...category,
    };
    if (transactionRecordLinked) {
      transactionRecordLinked.isExpense = category.isExpense;
      transactionRecordLinked.isIncome = category.isIncome;
      transactionRecordLinked.category = {
        ...category,
      };
    }
  }

  /* update amount */
  const isUpdatedAmount = transactionRecord.amount !== to.amount;
  if (isUpdatedAmount) {
    // 1. scheduled transaction
    if (!transactionRecord.isCurrent) {
      if (transactionRecordLinked) {
        const overAmount = transactionRecordLinked.amount - to.amount;
        transactionRecordLinked.overAmount = overAmount;
      }
    }
    // 2. current transaction
    else {
      if (transactionRecordLinked) {
        const overAmount = to.amount - transactionRecordLinked.amount;
        transactionRecord.overAmount = overAmount;
      }

      if (
        transactionRecord.linkedPaymentMethodId &&
        transactionRecord.updateAsset
      ) {
        userRecord.cancelPM({
          linkedPaymentMethodId: transactionRecord.linkedPaymentMethodId,
          linkedPaymentMethodType: transactionRecord.linkedPaymentMethodType!,
          amount: transactionRecord.amount,
          isExpense: transactionRecord.isExpense!,
        });
        userRecord.execPM({
          linkedPaymentMethodId: transactionRecord.linkedPaymentMethodId,
          linkedPaymentMethodType: transactionRecord.linkedPaymentMethodType!,
          amount: to.amount,
          isExpense: transactionRecord.isExpense!,
        });
      }
    }
    transactionRecord.amount = to.amount;
  }

  /* update isCurrent */
  const isUpdatedIsCurrent = transactionRecord.isCurrent !== to.isCurrent;
  if (isUpdatedIsCurrent) {
    if (transactionRecordLinked) {
      throw new IsCurrentCannotBeUpdatedError();
    }
    if (
      transactionRecord.linkedPaymentMethodId &&
      transactionRecord.updateAsset
    ) {
      // 1. current -> scheduled
      if (transactionRecord.isCurrent && !to.isCurrent) {
        userRecord.cancelPM({
          linkedPaymentMethodId: transactionRecord.linkedPaymentMethodId,
          linkedPaymentMethodType: transactionRecord.linkedPaymentMethodType!,
          amount: transactionRecord.amount,
          isExpense: transactionRecord.isExpense!,
        });
      }
      // 2. scheduled -> current
      else if (!transactionRecord.isCurrent && to.isCurrent) {
        userRecord.execPM({
          linkedPaymentMethodId: transactionRecord.linkedPaymentMethodId,
          linkedPaymentMethodType: transactionRecord.linkedPaymentMethodType!,
          amount: transactionRecord.amount,
          isExpense: transactionRecord.isExpense!,
        });
      }
    }
    transactionRecord.isCurrent = to.isCurrent;
  }

  const isUpdatedLinkedPaymentMethodId =
    transactionRecord.linkedPaymentMethodId?.toString() !==
    to.linkedPaymentMethodId?.toString();
  if (isUpdatedLinkedPaymentMethodId) {
    // cancel ex paymentMethod
    if (
      transactionRecord.isCurrent &&
      transactionRecord.linkedPaymentMethodId &&
      transactionRecord.updateAsset
    ) {
      userRecord.cancelPM({
        linkedPaymentMethodId: transactionRecord.linkedPaymentMethodId,
        linkedPaymentMethodType: transactionRecord.linkedPaymentMethodType!,
        amount: transactionRecord.amount,
        isExpense: transactionRecord.isExpense!,
      });
    }

    // => id1
    if (to.linkedPaymentMethodId) {
      const { paymentMethod } = UserService.PaymentMethodService.findById(
        userRecord,
        to.linkedPaymentMethodId
      );
      if (!paymentMethod) {
        throw new PaymentMethodNotFoundError();
      }
      transactionRecord.linkedPaymentMethodId = paymentMethod._id;
      transactionRecord.linkedPaymentMethodType = paymentMethod.type;
      transactionRecord.linkedPaymentMethodIcon = paymentMethod.icon;
      transactionRecord.linkedPaymentMethodTitle = paymentMethod.title;
      transactionRecord.linkedPaymentMethodDetail = paymentMethod.detail;

      if (transactionRecord.isCurrent && transactionRecord.updateAsset) {
        userRecord.execPM({
          linkedPaymentMethodId: transactionRecord.linkedPaymentMethodId,
          linkedPaymentMethodType: transactionRecord.linkedPaymentMethodType,
          amount: transactionRecord.amount,
          isExpense: transactionRecord.isExpense!,
        });
      }
    }
    // => undefined
    else {
      transactionRecord.linkedPaymentMethodId = undefined;
      transactionRecord.linkedPaymentMethodType = undefined;
      transactionRecord.linkedPaymentMethodIcon = undefined;
      transactionRecord.linkedPaymentMethodTitle = undefined;
    }
  }

  const isUpdatedUpdateAsset = transactionRecord.updateAsset !== to.updateAsset;
  if (isUpdatedUpdateAsset) {
    const isNotUpdatedAmount = !isUpdatedAmount;
    const isNotUpdatedIsCurrentAndIsCurrent =
      !isUpdatedIsCurrent && transactionRecord.isCurrent;
    const isNotUpdatedLinkedPaymentMethodIdAndHasOne =
      !isUpdatedLinkedPaymentMethodId &&
      transactionRecord.linkedPaymentMethodId;
    const isOnlyUpdatedUpdateAssetOnly =
      isNotUpdatedAmount &&
      isNotUpdatedIsCurrentAndIsCurrent &&
      isNotUpdatedLinkedPaymentMethodIdAndHasOne;

    if (isOnlyUpdatedUpdateAssetOnly) {
      // false -> true
      if (to.updateAsset) {
        userRecord.execPM({
          linkedPaymentMethodId: transactionRecord.linkedPaymentMethodId!,
          linkedPaymentMethodType: transactionRecord.linkedPaymentMethodType!,
          amount: transactionRecord.amount,
          isExpense: transactionRecord.isExpense!,
        });
      }
      // true -> false
      else {
        userRecord.cancelPM({
          linkedPaymentMethodId: transactionRecord.linkedPaymentMethodId!,
          linkedPaymentMethodType: transactionRecord.linkedPaymentMethodType!,
          amount: transactionRecord.amount,
          isExpense: transactionRecord.isExpense!,
        });
      }
    }
    transactionRecord.updateAsset = to.updateAsset;
  }

  await userRecord.save();
  await transactionRecord.save();
  if (transactionRecordLinked) {
    await transactionRecordLinked.save();
  }
  await BudgetService.calculate(budgetRecord);
  return {
    assets: userRecord.assets,
    transaction: transactionRecord,
    transactionLinked: transactionRecordLinked,
    budget: budgetRecord,
  };
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

export const remove = async (
  transactionRecord: HydratedDocument<ITransaction>
) => {
  if (
    hasToUpdateAsset(transactionRecord) &&
    hasLinkedPaymentMethod(transactionRecord)
  ) {
    const { user: userRecord } = await UserService.findById(
      transactionRecord.userId
    );
    if (!userRecord) {
      throw new UserNotFoundError();
    }
    await PaymentMethodService.cancelPaymentMethod(
      userRecord,
      transactionRecord
    );
  }

  const { transaction: transactionRecordLinked } = await findLinkedTransaction(
    transactionRecord
  );
  if (transactionRecordLinked) {
    transactionRecordLinked.linkId = undefined;
    transactionRecordLinked.overAmount = undefined;
    await transactionRecordLinked.save();
  }

  await transactionRecord.remove();

  return {
    transactionRemoved: transactionRecord,
    transactionLinkedRemoved: transactionRecordLinked,
  };
};

export const removeByUserId = async (userId: Types.ObjectId | string) => {
  return await TransactionModel.deleteMany({ userId });
};

export const removeByBudgetId = async (budgetId: Types.ObjectId) => {
  return await TransactionModel.deleteMany({ budgetId });
};
