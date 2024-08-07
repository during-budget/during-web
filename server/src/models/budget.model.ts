import { Schema, model, Model, Types, HydratedDocument } from "mongoose";
import _ from "lodash";
import { TransactionModel } from "./transaction.model";

interface ICategory {
  categoryId: Types.ObjectId;
  isExpense?: boolean;
  isIncome?: boolean;
  isDefault?: boolean;
  title: string;
  icon: string;
  amountScheduled: number;
  amountScheduledRemain: number;
  amountCurrent: number;
  amountPlanned: number;
  autoPlanned: boolean;
}

const categorySchema = new Schema<ICategory>(
  {
    categoryId: Schema.Types.ObjectId,
    isExpense: { type: Boolean, default: false },
    isIncome: { type: Boolean, default: false },
    isDefault: { type: Boolean, default: false },
    title: String,
    icon: String,
    amountScheduled: {
      type: Number,
      default: 0,
    },
    amountScheduledRemain: {
      type: Number,
      default: 0,
    },
    amountCurrent: {
      type: Number,
      default: 0,
    },
    amountPlanned: {
      type: Number,
      default: 0,
    },
    autoPlanned: {
      type: Boolean,
      default: true,
    },
  },
  { _id: false }
);

interface IBudget {
  _id?: Types.ObjectId;
  userId: Types.ObjectId;
  startDate: Date;
  endDate: Date;
  year?: Number;
  month?: Number;
  title: string;
  expenseScheduled: number;
  expenseScheduledRemain: number;
  expenseCurrent: number;
  expensePlanned: number;
  expensePlannedRemain: number;
  incomeScheduled: number;
  incomeScheduledRemain: number;
  incomeCurrent: number;
  incomePlanned: number;
  incomePlannedRemain: number;
  categories: ICategory[];
  updatedAt?: Date;
  createdAt?: Date;
}

interface IBudgetProps {
  /* subdocument array */
  categories: Types.DocumentArray<ICategory>;
  /* methods */
  findCategoryIdx: (categoryId: string | Types.ObjectId) => number;
  calculate: () => Promise<void>;
}

interface BudgetModelType extends Model<IBudget, {}, IBudgetProps> {}

const budgetSchema = new Schema<IBudget, BudgetModelType, IBudgetProps>(
  {
    userId: Schema.Types.ObjectId,
    startDate: Date,
    endDate: Date,
    year: Number,
    month: Number,
    title: String,

    //예정 지출
    expenseScheduled: {
      type: Number,
      default: 0,
    },
    expenseScheduledRemain: {
      type: Number,
      default: 0,
    },

    //현재 지출
    expenseCurrent: {
      type: Number,
      default: 0,
    },

    //지출 예산 총액
    expensePlanned: {
      type: Number,
      default: 0,
    },
    expensePlannedRemain: {
      type: Number,
      default: 0,
    },

    //예정 수입
    incomeScheduled: {
      type: Number,
      default: 0,
    },
    incomeScheduledRemain: {
      type: Number,
      default: 0,
    },

    //현재 수입
    incomeCurrent: {
      type: Number,
      default: 0,
    },

    //수입 예산 총액

    incomePlanned: {
      type: Number,
      default: 0,
    },
    incomePlannedRemain: {
      type: Number,
      default: 0,
    },
    categories: [categorySchema],
  },
  { timestamps: true }
);

budgetSchema.index({
  user: 1,
  startDate: -1,
});

budgetSchema.methods.findCategoryIdx = function (
  categoryId: string | Types.ObjectId
) {
  return _.findIndex(this.categories, {
    categoryId: new Types.ObjectId(categoryId),
  });
};

budgetSchema.methods.calculate = async function () {
  /* init */
  /* expense */
  let sumExpensePlanned = 0;
  this.expenseScheduled = 0;
  this.expenseScheduledRemain = 0;
  this.expenseCurrent = 0;
  this.expensePlannedRemain = 0;
  /* income */
  let sumIncomePlanned = 0;
  this.incomeScheduled = 0;
  this.incomeScheduledRemain = 0;
  this.incomeCurrent = 0;
  this.incomePlannedRemain = 0;

  const categoryMap: Map<string, number> = new Map([]);

  for (let i = 0; i < this.categories.length; i++) {
    this.categories[i].amountScheduled = 0;
    this.categories[i].amountScheduledRemain = 0;
    this.categories[i].amountCurrent = 0;
    categoryMap.set(this.categories[i].categoryId.toString(), i);
  }

  /* calculate transactions */
  const transactions = await TransactionModel.find({ budgetId: this._id });
  for (let i = 0; i < transactions.length; i++) {
    const categoryIdx =
      categoryMap.get(transactions[i].category.categoryId.toString()) ?? -1;

    if (!transactions[i].isCurrent) {
      if (transactions[i].category.isExpense) {
        this.expenseScheduled += transactions[i].amount;
        if (!transactions[i].linkId) {
          this.expenseScheduledRemain += transactions[i].amount;
        }
      } else {
        this.incomeScheduled += transactions[i].amount;
        if (!transactions[i].linkId) {
          this.incomeScheduledRemain += transactions[i].amount;
        }
      }
      if (categoryIdx !== -1) {
        this.categories[categoryIdx].amountScheduled += transactions[i].amount;
        if (!transactions[i].linkId) {
          this.categories[categoryIdx].amountScheduledRemain +=
            transactions[i].amount;
        }
      }
    } else {
      if (transactions[i].category.isExpense) {
        this.expenseCurrent += transactions[i].amount;
      } else {
        this.incomeCurrent += transactions[i].amount;
      }
      if (categoryIdx !== -1) {
        this.categories[categoryIdx].amountCurrent += transactions[i].amount;
      }
    }
  }

  /* autoPlanned categories */
  for (let i = 0; i < this.categories.length; i++) {
    if (this.categories[i].autoPlanned || this.categories[i].isDefault) {
      this.categories[i].amountPlanned =
        this.categories[i].amountScheduledRemain +
        this.categories[i].amountCurrent;
    }
    if (this.categories[i].isExpense) {
      sumExpensePlanned += this.categories[i].amountPlanned;
    } else {
      sumIncomePlanned += this.categories[i].amountPlanned;
    }
  }

  this.expensePlannedRemain = this.expensePlanned - sumExpensePlanned;
  this.incomePlannedRemain = this.incomePlanned - sumIncomePlanned;

  return;
};

const BudgetModel = model<IBudget, BudgetModelType>("Budget", budgetSchema);
export { BudgetModel, IBudget, IBudgetProps, BudgetModelType, ICategory };
