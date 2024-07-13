import { HydratedDocument, Types } from "mongoose";

import { BudgetModel, IBudget } from "src/models/budget.model";
import { ITransaction } from "src/models/transaction.model";
import { basicTimeZone } from "src/models/_basicSettings";

import moment from "moment-timezone";

import * as TransactionService from "src/services/transactions";

import * as CategoryService from "./categories";

export { CategoryService };

export const createBasicBudget = async (user: {
  _id: Types.ObjectId;
  categories: any[];
}) => {
  const budgetRecord = await BudgetModel.create({
    userId: user._id,
    title: "기본 예산",
    categories: user.categories.map((category) => {
      return {
        ...category,
        categoryId: category._id,
        amountPlanned: 0,
      };
    }),
  });
  return { budget: budgetRecord };
};

export const createWithBasicBudget = async (
  user: { basicBudgetId: Types.ObjectId; settings?: { timeZone?: string } },
  basicBudgetRecord: HydratedDocument<IBudget>,
  year: number,
  month: number,
  title?: string
) => {
  const { transactions: transactionRecordList } =
    await TransactionService.findByBudgetId(basicBudgetRecord._id);

  const budgetRecord = basicBudgetRecord;
  budgetRecord.isNew = true;
  budgetRecord._id = new Types.ObjectId();
  budgetRecord.title = title ?? budgetRecord.title;
  budgetRecord.year = year;
  budgetRecord.month = month;
  budgetRecord.createdAt = undefined;
  budgetRecord.updatedAt = undefined;

  const save: Promise<any>[] = [budgetRecord.save()];

  const tz = user.settings?.timeZone ?? basicTimeZone;
  const lastDayOfTheMonth = new Date(year, month, 0).getDate();

  for (let transactionRecord of transactionRecordList) {
    const date = moment.tz(transactionRecord.date, tz).toDate();
    const mmt = moment.tz(
      [
        year,
        month - 1,
        Math.min(date.getDate(), lastDayOfTheMonth),
        date.getHours(),
        date.getMinutes(),
      ],
      tz
    );

    transactionRecord.isNew = true;
    transactionRecord._id = new Types.ObjectId();
    transactionRecord.budgetId = budgetRecord._id;
    transactionRecord.date = mmt.toDate();
    transactionRecord.createdAt = undefined;
    transactionRecord.updatedAt = undefined;
    save.push(transactionRecord.save());
  }

  await Promise.all(save);
  await calculate(budgetRecord, transactionRecordList);

  return { budget: budgetRecord, transactions: transactionRecordList };
};

export const findAll = async () => {
  const budgetRecordList = await BudgetModel.find();
  await Promise.all(
    budgetRecordList.map((budgetRecord) => calculate(budgetRecord))
  );
  return { budgets: budgetRecordList };
};

export const findById = async (budgetId: Types.ObjectId | string) => {
  const budgetRecord = await BudgetModel.findById(budgetId);

  return { budget: budgetRecord };
};

export const findByIdWithTransactions = async (
  budgetId: Types.ObjectId | string
) => {
  const budgetRecord = await BudgetModel.findById(budgetId);
  const { transactions: transactionRecordList } =
    await TransactionService.findByBudgetId(budgetId);
  if (budgetRecord) {
    await calculate(budgetRecord, transactionRecordList);
  }
  return { budget: budgetRecord, transactions: transactionRecordList };
};

export const findByYearAndMonth = async (
  userId: Types.ObjectId,
  year: number,
  month: number
) => {
  const budgetRecord = await BudgetModel.findOne({
    userId,
    year,
    month,
  });
  if (budgetRecord) {
    await calculate(budgetRecord);
  }
  return { budget: budgetRecord };
};

export const findByYear = async (userId: Types.ObjectId, year: number) => {
  const budgetRecordList = await BudgetModel.find({
    userId,
    year,
  });
  await Promise.all(
    budgetRecordList.map((budgetRecord) => calculate(budgetRecord))
  );
  return { budgets: budgetRecordList };
};

export const findByUserId = async (userId: Types.ObjectId | string) => {
  const budgetRecordList = await BudgetModel.find({
    userId,
  });
  await Promise.all(
    budgetRecordList.map((budgetRecord) => calculate(budgetRecord))
  );
  return { budgets: budgetRecordList };
};

export const calculate = async (
  budgetRecord: HydratedDocument<IBudget>,
  transactionRecordListGiven?: ITransaction[]
) => {
  let transactionRecordList: ITransaction[];
  if (transactionRecordListGiven) {
    transactionRecordList = transactionRecordListGiven;
  } else {
    const { transactions: transactionRecordListFound } =
      await TransactionService.findByBudgetId(budgetRecord._id!);
    transactionRecordList = transactionRecordListFound;
  }

  /* init */

  /* expense */
  let sumExpensePlanned = 0;
  budgetRecord.expenseScheduled = 0;
  budgetRecord.expenseScheduledRemain = 0;
  budgetRecord.expenseCurrent = 0;
  budgetRecord.expensePlannedRemain = 0;
  /* income */
  let sumIncomePlanned = 0;
  budgetRecord.incomeScheduled = 0;
  budgetRecord.incomeScheduledRemain = 0;
  budgetRecord.incomeCurrent = 0;
  budgetRecord.incomePlannedRemain = 0;

  const categoryMap: Map<string, number> = new Map([]);

  for (let i = 0; i < budgetRecord.categories.length; i++) {
    budgetRecord.categories[i].amountScheduled = 0;
    budgetRecord.categories[i].amountScheduledRemain = 0;
    budgetRecord.categories[i].amountCurrent = 0;
    categoryMap.set(budgetRecord.categories[i].categoryId.toString(), i);
  }

  /* calculate transactions */
  for (let i = 0; i < transactionRecordList.length; i++) {
    const categoryIdx =
      categoryMap.get(
        transactionRecordList[i].category.categoryId.toString()
      ) ?? -1;

    if (!transactionRecordList[i].isCurrent) {
      if (transactionRecordList[i].category.isExpense) {
        budgetRecord.expenseScheduled += transactionRecordList[i].amount;
        if (!transactionRecordList[i].linkId) {
          budgetRecord.expenseScheduledRemain +=
            transactionRecordList[i].amount;
        }
      } else {
        budgetRecord.incomeScheduled += transactionRecordList[i].amount;
        if (!transactionRecordList[i].linkId) {
          budgetRecord.incomeScheduledRemain += transactionRecordList[i].amount;
        }
      }
      if (categoryIdx !== -1) {
        budgetRecord.categories[categoryIdx].amountScheduled +=
          transactionRecordList[i].amount;
        if (!transactionRecordList[i].linkId) {
          budgetRecord.categories[categoryIdx].amountScheduledRemain +=
            transactionRecordList[i].amount;
        }
      }
    } else {
      if (transactionRecordList[i].category.isExpense) {
        budgetRecord.expenseCurrent += transactionRecordList[i].amount;
      } else {
        budgetRecord.incomeCurrent += transactionRecordList[i].amount;
      }
      if (categoryIdx !== -1) {
        budgetRecord.categories[categoryIdx].amountCurrent +=
          transactionRecordList[i].amount;
      }
    }
  }

  /* autoPlanned categories */
  for (let i = 0; i < budgetRecord.categories.length; i++) {
    if (
      budgetRecord.categories[i].autoPlanned ||
      budgetRecord.categories[i].isDefault
    ) {
      budgetRecord.categories[i].amountPlanned =
        budgetRecord.categories[i].amountScheduledRemain +
        budgetRecord.categories[i].amountCurrent;
    }
    if (budgetRecord.categories[i].isExpense) {
      sumExpensePlanned += budgetRecord.categories[i].amountPlanned;
    } else {
      sumIncomePlanned += budgetRecord.categories[i].amountPlanned;
    }
  }

  budgetRecord.expensePlannedRemain =
    budgetRecord.expensePlanned - sumExpensePlanned;
  budgetRecord.incomePlannedRemain =
    budgetRecord.incomePlanned - sumIncomePlanned;
  return { budget: budgetRecord };
};

export const checkBudgetUserIdMatch = (
  budgetRecord: HydratedDocument<IBudget>,
  userId: Types.ObjectId
) => budgetRecord.userId.equals(userId);

export const updateFields = async (
  budgetRecord: HydratedDocument<IBudget>,
  fields: {
    startDate?: string;
    endDate?: string;
    title?: string;
    expensePlanned: number;
    incomePlanned: number;
  }
) => {
  if ("startDate" in fields) {
    budgetRecord.startDate = new Date(fields.startDate!);
  }
  if ("endDate" in fields) {
    budgetRecord.endDate = new Date(fields.endDate!);
  }
  if ("title" in fields) {
    budgetRecord.title = fields.title!;
  }

  if ("expensePlanned" in fields) {
    budgetRecord.expensePlanned = fields.expensePlanned;
  }
  if ("incomePlanned" in fields) {
    budgetRecord.incomePlanned = fields.incomePlanned;
  }
  await budgetRecord.save();
  await calculate(budgetRecord);
};

export const removeByUserId = async (userId: Types.ObjectId | string) => {
  return await BudgetModel.deleteMany({ userId });
};

export const remove = async (budgetRecord: HydratedDocument<IBudget>) => {
  await Promise.all([
    TransactionService.removeByBudgetId(budgetRecord._id),
    budgetRecord.remove(),
  ]);
};
