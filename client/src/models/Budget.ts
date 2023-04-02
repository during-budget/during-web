import Amount from './Amount';
import Category from './Category';

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
    private _categories: Category[];

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
        categories: Category[];
    }) {
        const { id, title, date, total, categories } = budget;
        this._id = id;
        this._title = title;
        this._date = date;
        this._total = total;
        this._categories = categories;
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

    get categories() {
        return this._categories;
    }

    static getBudgetFromData = (budget: any) => {
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
            categories,
        } = budget;
        return new Budget({
            id,
            title,
            date: {
                start: new Date(startDate),
                end: new Date(endDate),
            },
            total: {
                expense: new Amount(
                    expenseCurrent,
                    expenseScheduled,
                    expensePlanned
                ),
                income: new Amount(
                    incomeCurrent,
                    incomeScheduled,
                    incomePlanned
                ),
            },
            categories: categories.map((category: any) => {
                const {
                    categoryId: id,
                    icon,
                    isExpense,
                    isDefault,
                    title,
                    amountCurrent,
                    amountPlanned,
                    amountScheduled,
                } = category;
                const amount = new Amount(
                    amountCurrent,
                    amountScheduled,
                    amountPlanned
                );
                return new Category({
                    id,
                    title,
                    icon,
                    isExpense,
                    isDefault,
                    amount,
                });
            }),
        });
    };

    static getBudgetUpdatedTotalAmount = (
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

        const { id, title, date, categories } = prevBudget;
        return new Budget({ id, title, date, total, categories });
    };

    static getBudgetUpdatedCategoryAmount = (
        prevBudget: Budget | any,
        categoryId: string,
        isCurrent: boolean,
        addingAmount: number
    ) => {
        const { id, title, date, total, categories } = prevBudget;
        const idx = categories.findIndex((item: any) => item.id === categoryId);
        if (categories[idx]) {
            if (isCurrent) {
                categories[idx].amount.addCurrent(addingAmount);
            } else {
                categories[idx].amount.addScheduled(addingAmount);
            }
        }
        return new Budget({ id, title, date, total, categories });
    };

    static getBudgetUpdatedCategory = (
        prevBudget: Budget,
        categories: Category[]
    ) => {
        const { id, title, date, total } = prevBudget;
        return new Budget({ id, title, date, total, categories });
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

        const { id, title, date, categories } = prevBudget;
        return new Budget({ id, title, date, total, categories });
    };

    static getBudgetUpdatedCategoryPlan(
        prevBudget: Budget | any,
        categoryId: string,
        amount: number
    ) {
        const { id, title, date, total, categories } = prevBudget;
        const idx = categories.findIndex((item: any) => item.id === categoryId);
        if (categories[idx]) {
            categories[idx].amount.planned = amount;
        }
        return new Budget({ id, title, date, total, categories });
    }
}

export default Budget;
