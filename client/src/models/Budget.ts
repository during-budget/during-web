import { BudgetDataType } from '../util/api/budgetAPI';

class Budget {
  private _id: string;
  private _title: string;
  private _date: {
    start: Date;
    end: Date;
  };

  constructor(budget: {
    id: string;
    title: string;
    date: {
      start: Date;
      end: Date;
    };
  }) {
    const { id, title, date } = budget;
    this._id = id;
    this._title = title;
    this._date = date;
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

  static getBudgetFromData = (budget: BudgetDataType) => {
    const { _id: id, title, startDate, endDate } = budget;

    return new Budget({
      id,
      title,
      date: {
        start: new Date(startDate),
        end: new Date(endDate),
      },
    });
  };
}

export default Budget;
