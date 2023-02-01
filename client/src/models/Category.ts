import Amount from './Amount';

class Category {
    private _id: string;
    private _title: string;
    private _icon: string;
    private _isExpense: boolean;
    private _isIncome: boolean;

    get id() {
        return this._id;
    }

    get title() {
        return this._title;
    }

    get icon() {
        return this._icon;
    }

    get isExpense() {
        return this._isExpense;
    }

    get isIncome() {
        return this._isIncome;
    }

    set title(title: string) {
        this._title = title;
    }

    set icon(icon: string) {
        this._icon = icon;
    }

    set isExpense(isExpense: boolean) {
        this._isExpense = isExpense;
    }

    set isIncome(isIncome: boolean) {
        this._isIncome = isIncome;
    }

    constructor(category: {
        id: string;
        title: string;
        icon: string;
        isExpense: boolean;
        isIncome: boolean;
        amounts?: { [key: string]: Amount };
    }) {
        const { id, title, icon, isExpense, isIncome } = category;
        this._id = id;
        this._title = title;
        this._icon = icon;
        this._isExpense = isExpense;
        this._isIncome = isIncome;
    }
}

export default Category;
