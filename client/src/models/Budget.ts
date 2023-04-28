import { BudgetDataType } from '../util/api/budgetAPI';
import { v4 as uuid } from 'uuid';
import Amount from './Amount';

class Budget {
  private _id: string;
  private _title: string;
  private _date: {
    start: Date;
    end: Date;
  };
  private _total: {
    expense: Amount;
    income: Amount;
  };

  constructor(budget: {
    id: string;
    title: string;
    date: {
      start: Date;
      end: Date;
    };
    total: {
      expense: Amount;
      income: Amount;
    };
  }) {
    const { id, title, date, total } = budget;
    this._id = id;
    this._title = title;
    this._date = date;
    this._total = total;
  }

  get id() {
    return this._id;
  }

  get title() {
    return this._title;
  }

  get date() {
    return this._date;
  }

  get total() {
    return this._total;
  }

  static getEmptyBudget = () => {
    return new Budget({
      id: uuid(),
      title: '',
      date: {
        start: new Date(),
        end: new Date(),
      },
      total: {
        expense: new Amount(0, 0, 0),
        income: new Amount(0, 0, 0),
      },
    });
  };

  static getBudgetFromData = (budget: BudgetDataType) => {
    const {
      _id: id,
      title,
      startDate,
      endDate,
      expenseCurrent,
      expenseScheduled,
      expensePlanned,
      incomeCurrent,
      incomeScheduled,
      incomePlanned,
    } = budget;

    return new Budget({
      id,
      title,
      date: {
        start: new Date(startDate),
        end: new Date(endDate),
      },
      total: {
        expense: new Amount(expenseCurrent, expenseScheduled, expensePlanned),
        income: new Amount(incomeCurrent, incomeScheduled, incomePlanned),
      },
    });
  };
}

export default Budget;
