import { Schema, model, Model, Types, HydratedDocument } from "mongoose";
import _ from "lodash";

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
  incomeScheduled: number;
  incomeScheduledRemain: number;
  incomeCurrent: number;
  incomePlanned: number;
  categories: ICategory[];
  updatedAt?: Date;
  createdAt?: Date;
}

interface IBudgetProps {
  /* subdocument array */
  categories: Types.DocumentArray<ICategory>;
  /* methods */
  findCategory: (
    categoryId: string | Types.ObjectId
  ) => HydratedDocument<ICategory> | undefined;
  findCategoryIdx: (categoryId: string | Types.ObjectId) => number;
  findDefaultExpenseCategory: () => HydratedDocument<ICategory>;
  findDefaultIncomeCategory: () => HydratedDocument<ICategory>;
  pushCategory: (category: any) => void;
  increaseDefaultExpenseCategory: (
    field:
      | "amountPlanned"
      | "amountScheduled"
      | "amountScheduledRemain"
      | "amountCurrent",
    amount: number
  ) => void;
  increaseDefaultIncomeCategory: (
    field:
      | "amountPlanned"
      | "amountScheduled"
      | "amountScheduledRemain"
      | "amountCurrent",
    amount: number
  ) => void;
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

    categories: [categorySchema],
  },
  { timestamps: true }
);

budgetSchema.index({
  user: 1,
  startDate: -1,
});

budgetSchema.methods.findCategory = function (
  categoryId: string | Types.ObjectId
) {
  return _.find(this.categories, {
    categoryId: new Types.ObjectId(categoryId),
  })?.toObject();
};

budgetSchema.methods.findCategoryIdx = function (
  categoryId: string | Types.ObjectId
) {
  return _.findIndex(this.categories, {
    categoryId: new Types.ObjectId(categoryId),
  });
};

budgetSchema.methods.findDefaultExpenseCategory = function () {
  return this.categories[this.categories.length - 2].toObject();
};

budgetSchema.methods.findDefaultIncomeCategory = function () {
  return this.categories[this.categories.length - 1].toObject();
};

budgetSchema.methods.pushCategory = function (category: any) {
  this.categories.splice(this.categories.length - 2, 0, category);
  return;
};

budgetSchema.methods.increaseDefaultExpenseCategory = function (
  field:
    | "amountPlanned"
    | "amountScheduled"
    | "amountScheduledRemain"
    | "amountCurrent",
  amount: number
) {
  const idx = this.categories.length - 2;
  this.categories[idx][field] = (this.categories[idx][field] ?? 0) + amount;
  return;
};
budgetSchema.methods.increaseDefaultIncomeCategory = function (
  field:
    | "amountPlanned"
    | "amountScheduled"
    | "amountScheduledRemain"
    | "amountCurrent",
  amount: number
) {
  const idx = this.categories.length - 1;
  this.categories[idx][field] = (this.categories[idx][field] ?? 0) + amount;
  return;
};

const Budget = model<IBudget, BudgetModelType>("Budget", budgetSchema);
export { Budget, IBudget, IBudgetProps, BudgetModelType, ICategory };
