import { BudgetDataType } from '../util/api/budgetAPI';
import { v4 as uuid } from 'uuid';
import Amount from './Amount';
import dayjs from 'dayjs';

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
      year,
      month,
      expenseCurrent,
      expenseScheduledRemain,
      expensePlanned,
      incomeCurrent,
      incomeScheduledRemain,
      incomePlanned,
    } = budget;

    return new Budget({
      id,
      title,
      date: {
        start: new Date(startDate || new Date(year, month, 1)),
        end: new Date(
          endDate ||
            new Date(year, month, dayjs(new Date(year, month)).endOf('month').date())
        ),
      },
      total: {
        expense: new Amount(expenseCurrent, expenseScheduledRemain, expensePlanned),
        income: new Amount(incomeCurrent, incomeScheduledRemain, incomePlanned),
      },
    });
  };
}

export default Budget;
