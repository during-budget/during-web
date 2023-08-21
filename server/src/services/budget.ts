import { HydratedDocument, Types } from "mongoose";
import {
  CATEGORY_CANOT_BE_UPDATED,
  FIELD_REQUIRED,
  INVALID_CATEGORY,
  NOT_FOUND,
} from "src/api/message";
import { CustomError } from "src/api/middleware/error";
import { Budget as BudgetModel, IBudget, ICategory } from "src/models/Budget";
import * as TransactionService from "./transaction";
import { basicTimeZone } from "@models/_basicSettings";
import moment from "moment-timezone";
import { ITransaction } from "@models/Transaction";
import * as UserService from "./user";
import { IUser } from "@models/User";

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

export const findCategory = (
  budgetRecord: HydratedDocument<IBudget>,
  _categoryId: string | Types.ObjectId
) => {
  const categoryId = new Types.ObjectId(_categoryId);
  for (let i = 0; i < budgetRecord.categories.length; i++) {
    if (budgetRecord.categories[i].categoryId.equals(categoryId)) {
      return { idx: i, category: budgetRecord.categories[i] };
    }
  }
  return { idx: -1, category: undefined };
};

const findDefaultExpenseCategory = (budgetRecord: IBudget) => {
  return {
    category: budgetRecord.categories[budgetRecord.categories.length - 2],
  };
};

const findDefaultIncomeCategory = (budgetRecord: IBudget) => {
  return {
    category: budgetRecord.categories[budgetRecord.categories.length - 1],
  };
};

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
  user: { basicBudgetId: Types.ObjectId; settings: { timeZone?: string } },
  year: number,
  month: number,
  title?: string
) => {
  const basicBudgetRecord = await BudgetModel.findById(user.basicBudgetId);
  if (!basicBudgetRecord) {
    throw new CustomError(404, NOT_FOUND("budget"));
  }

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

  const tz = user.settings.timeZone ?? basicTimeZone;
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

export const findAllBudgets = async () => {
  const budgetRecordList = await BudgetModel.find();
  await Promise.all(
    budgetRecordList.map((budgetRecord) => calculate(budgetRecord))
  );
  return { budgets: budgetRecordList };
};

export const checkBudgetUserIdMatch = (
  budgetRecord: HydratedDocument<IBudget>,
  userId: Types.ObjectId
) => budgetRecord.userId.equals(userId);

export const updateCategories = async (
  userRecord: IUser,
  budgetRecord: HydratedDocument<IBudget>,
  isExpense: boolean,
  categories: any[]
) => {
  const categoryDict: { [key: string]: ICategory } = Object.fromEntries(
    budgetRecord.categories.map((category) => [category.categoryId, category])
  );

  const _categories: Types.DocumentArray<ICategory> = new Types.DocumentArray(
    []
  );
  const included: Types.DocumentArray<ICategory> = new Types.DocumentArray([]);
  const updated: Types.DocumentArray<ICategory> = new Types.DocumentArray([]);
  const excluded: Types.DocumentArray<ICategory> = new Types.DocumentArray([]);

  for (let _category of categories) {
    if (!("amountPlanned" in _category))
      throw new CustomError(400, FIELD_REQUIRED("amountPlanned"));
    if (!("categoryId" in _category))
      throw new CustomError(400, FIELD_REQUIRED("categoryId"));

    /* include category */
    if (!categoryDict[_category.categoryId]) {
      const { category } = UserService.findCategory(
        userRecord,
        _category.categoryId
      );
      if (!category) throw new CustomError(404, NOT_FOUND("category"));

      if (category.isDefault)
        throw new CustomError(409, CATEGORY_CANOT_BE_UPDATED);

      if (category.isExpense !== isExpense)
        throw new CustomError(409, INVALID_CATEGORY);

      const newCategory = {
        ...category,
        categoryId: category._id,
        amountPlanned: _category.amountPlanned,
      };
      _categories.push(newCategory);
      included.push(newCategory);
    } /* update category */ else {
      const key = _category.categoryId;
      const exCategory = categoryDict[key];
      if (!exCategory)
        throw new CustomError(404, "category not found in budget.categories");
      if (exCategory.isDefault)
        throw new CustomError(409, CATEGORY_CANOT_BE_UPDATED);
      if (exCategory.isExpense !== isExpense)
        throw new CustomError(409, INVALID_CATEGORY);

      const category = {
        ...exCategory,
        amountPlanned: _category.amountPlanned,
        autoPlanned: _category.autoPlanned,
      };
      _categories.push(category);
      delete categoryDict[key];

      if (category.amountPlanned !== exCategory.amountPlanned) {
        updated.push(category);
      }
    }
  }
  /* exclude category */
  for (const category of Object.values(categoryDict)) {
    if (!category.isDefault) {
      if (category.isExpense === isExpense) {
        excluded.push(category);
      } else {
        _categories.push(category);
      }
    }
  }

  const { category: defaultExpenseCategory } =
    findDefaultExpenseCategory(budgetRecord);
  const { category: defaultIncomeCategory } =
    findDefaultIncomeCategory(budgetRecord);
  _categories.push(defaultExpenseCategory);
  _categories.push(defaultIncomeCategory);
  budgetRecord.categories = _categories;

  for (const category of excluded) {
    if (isExpense) {
      await TransactionService.replaceTransactionsCategory(
        budgetRecord._id,
        category,
        defaultExpenseCategory
      );
    } else {
      await TransactionService.replaceTransactionsCategory(
        budgetRecord._id,
        category,
        defaultIncomeCategory
      );
    }
  }

  await budgetRecord.save();
  await calculate(budgetRecord);
};

export const updateCategoryAmountPlanned = async (
  budgetRecord: HydratedDocument<IBudget>,
  categoryId: Types.ObjectId | string,
  amountPlanned: number
) => {
  const { idx, category } = findCategory(budgetRecord, categoryId);
  if (!category) throw new CustomError(404, NOT_FOUND("category"));
  if (category.isDefault) throw new CustomError(409, CATEGORY_CANOT_BE_UPDATED);

  budgetRecord.categories[idx].amountPlanned = amountPlanned;
  budgetRecord.categories[idx].autoPlanned = false;
  await budgetRecord.save();
  await calculate(budgetRecord);
};

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
  await TransactionService.removeByBudgetId(budgetRecord._id),
    await budgetRecord.remove();
};
