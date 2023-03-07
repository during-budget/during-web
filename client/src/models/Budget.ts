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
    private _categories: Category;

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
        categories: Category;
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
                    amount,
                });
            }),
        });
    };
}

export default Budget;
