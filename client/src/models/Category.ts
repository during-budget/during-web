import Amount from './Amount';

class Category {
    private _id: string;
    private _title: string;
    private _icon: string;
    private _isExpense: boolean;
    private _isDefault: boolean;
    private _amount: Amount | undefined;

    constructor(category: {
        id: string;
        title: string;
        icon: string;
        isExpense: boolean;
        isDefault: boolean;
        amount?: Amount;
    }) {
        const { id, title, icon, isExpense, isDefault, amount } = category;
        this._id = id;
        this._title = title;
        this._icon = icon;
        this._isExpense = isExpense;
        this._isDefault = isDefault;
        this._amount = amount ? amount : undefined;
    }

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

    get isDefault() {
        return this._isDefault;
    }

    get amount() {
        return this._amount;
    }
}

export default Category;
