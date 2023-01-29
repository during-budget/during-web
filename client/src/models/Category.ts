import Amount from './Amount';

class Category {
    private _id: string;
    private _title: string;
    private _icon: string;
    private _amounts: { [key: string]: Amount };

    get id() {
        return this._id;
    }

    get title() {
        return this._title;
    }

    get icon() {
        return this._icon;
    }

    get amounts() {
        return this._amounts;
    }

    set title(title: string) {
        this._title = title;
    }

    set icon(icon: string) {
        this._icon = icon;
    }

    setPlan(budgetId: string, plannedAmount: number) {
        const amount = this._amounts[budgetId];
        if (amount) {
            this._amounts[budgetId].planned = plannedAmount;
        } else {
            this._amounts[budgetId] = new Amount(0, 0, plannedAmount);
        }
    }

    constructor(category: {
        id: string;
        title: string;
        icon: string;
        initialData?: { budgetId: string; budgetAmount: number };
        amounts?: { [key: string]: Amount };
    }) {
        const { id, title, icon, amounts, initialData } = category;
        this._id = id;
        this._title = title;
        this._icon = icon;

        if (initialData) {
            this._amounts = {};
            this.setPlan(initialData.budgetId, initialData.budgetAmount);
        } else if (amounts) {
            this._amounts = amounts;
        } else {
            this._amounts = {};
        }
    }
}

export default Category;
