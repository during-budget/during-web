import Amount from './Amount';
import Category from './Category';

class Budget {
    private _id: string;
    private _title: string;
    private _startDate: Date;
    private _endDate: Date;
    private _total: {
        expense: Amount;
        income: Amount;
    };
    private _categories: Category[];

    get id() {
        return this._id;
    }

    get title() {
        return this._title;
    }

    get startDate() {
        return this._startDate;
    }

    get endDate() {
        return this._endDate;
    }

    get total() {
        return this._total;
    }

    get categories() {
        return this._categories;
    }

    set title(title: string) {
        this._title = title;
    }

    static getBudgetUpdatedTotal = (
        prevBudget: Budget | any,
        isExpense: boolean,
        isCurrent: boolean,
        amount: number
    ) => {
        const key = isExpense ? 'expense' : 'income';
        const total = prevBudget.total;

        if (isCurrent) {
            total[key].addCurrent(amount);
        } else {
            total[key].addScheduled(amount);
        }

        const { id, title, startDate, endDate, categories } = prevBudget;
        return new Budget({ id, title, startDate, endDate, total, categories });
    };

    static getBudgetUpdatedPlan = (
        prevBudget: Budget | any,
        isExpense: boolean,
        amount: number
    ) => {
        const key = isExpense ? 'expense' : 'income';
        const total = prevBudget.total;
        total[key] = new Amount(
            total[key].current,
            total[key].scheduled,
            amount
        );

        const { id, title, startDate, endDate, categories } = prevBudget;
        return new Budget({ id, title, startDate, endDate, total, categories });
    };

    static getBudgetUpdatedCateogryTotal(
        prevBudget: Budget | any,
        categoryId: string,
        amount: number
    ) {
        const { id, title, startDate, total, endDate, categories } = prevBudget;
        const idx = categories.findIndex((item: any) => item.id === categoryId);
        if (categories[idx]) {
            categories[idx].amount.planned = amount;
        }
        return new Budget({ id, title, startDate, endDate, total, categories });
    }

    static getBudgetUpdatedCategoryAmount = (
        prevBudget: Budget | any,
        categoryId: string,
        isCurrent: boolean,
        addingAmount: number
    ) => {
        const { id, title, startDate, total, endDate, categories } = prevBudget;
        const idx = categories.findIndex((item: any) => item.id === categoryId);
        if (categories[idx]) {
            if (isCurrent) {
                categories[idx].amount.addCurrent(addingAmount);
            } else {
                categories[idx].amount.addScheduled(addingAmount);
            }
        }
        return new Budget({ id, title, startDate, endDate, total, categories });
    };

    constructor(budget: {
        id: string;
        title: string;
        startDate: Date;
        endDate: Date;
        total: {
            expense: Amount;
            income: Amount;
        };
        categories: Category[];
    }) {
        const { id, title, startDate, endDate, total, categories } = budget;
        this._id = id;
        this._title = title;
        this._startDate = startDate;
        this._endDate = endDate;
        this._total = total;
        this._categories = categories;
    }
}

export default Budget;
