import dayjs from 'dayjs';
import { v4 as uuid } from 'uuid';
import { BudgetDataType } from '../util/api/budgetAPI';
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
  private _remain: {
    expense: number;
    income: number;
  }

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
    remain: {
      expense: number;
      income: number;
    }
  }) {
    const { id, title, date, total, remain } = budget;
    this._id = id;
    this._title = title;
    this._date = date;
    this._total = total;
    this._remain = remain;
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

  get remain() {
    return this._remain;
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
      remain: {
        expense: 0,
        income: 0,
      }
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
      expensePlannedRemain,
      incomeCurrent,
      incomeScheduledRemain,
      incomePlanned,
      incomePlannedRemain
    } = budget;

    return new Budget({
      id,
      title,
      date: {
        start: new Date(startDate || new Date(year, month - 1, 1)),
        end: new Date(
          endDate ||
            new Date(
              year,
              month - 1,
              dayjs(new Date(year, month - 1))
                .endOf('month')
                .date()
            )
        ),
      },
      total: {
        expense: new Amount(expenseCurrent, expenseScheduledRemain, expensePlanned),
        income: new Amount(incomeCurrent, incomeScheduledRemain, incomePlanned),
      },
      remain: {
        expense: expensePlannedRemain,
        income: incomePlannedRemain
      }
    });
  };
}

export default Budget;
