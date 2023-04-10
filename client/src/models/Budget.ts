import { BudgetDataType } from '../util/api/budgetAPI';
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
    private _categories: { [id: string]: Category };

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
        categories: { [id: string]: Category };
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
            categories: categoryData,
        } = budget;

        const categories: { [id: string]: Category } = {};
        categoryData.forEach((data) => {
            const category = Category.getCategoryFromData(data);
            categories[category.id] = category;
        });

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
            categories,
        });
    };

    static getBudgetUpdatedTotalAmount = (
        prevBudget: Budget,
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
        prevBudget: Budget,
        categoryId: string,
        isCurrent: boolean,
        addingAmount: number
    ) => {
        const { id, title, date, total, categories } = prevBudget;

        if (categories[categoryId]) {
            if (isCurrent) {
                categories[categoryId].amount.addCurrent(addingAmount);
            } else {
                categories[categoryId].amount.addScheduled(addingAmount);
            }
        }
        return new Budget({ id, title, date, total, categories });
    };

    static getBudgetUpdatedCategory = (
        prevBudget: Budget,
        updatedCategories: Category[]
    ) => {
        const { id, title, date, total } = prevBudget;

        const categories: { [id: string]: Category } = {};
        updatedCategories.forEach((category) => {
            categories[category.id] = category;
        });

        return new Budget({ id, title, date, total, categories });
    };

    static getBudgetUpdatedPlan = (
        prevBudget: Budget,
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
        prevBudget: Budget,
        categoryId: string,
        amount: number
    ) {
        const { id, title, date, total, categories } = prevBudget;
        if (categories[categoryId]) {
            categories[categoryId].amount.planned = amount;
        }
        return new Budget({ id, title, date, total, categories });
    }
}

export default Budget;
