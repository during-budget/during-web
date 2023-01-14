import Category from './Category';

class Transaction {
    private _id: string;
    private _isCurrent: boolean;
    private _isExpense: boolean;
    private _icon: string;
    private _title: string[];
    private _date: Date;
    private _amount: number;
    private _category: Category;
    private _tags: string[];
    private _memo: string;

    get id() {
        return this._id;
    }

    get isCurrent() {
        return this._isCurrent;
    }

    get isExpense() {
        return this._isExpense;
    }

    get icon() {
        return this._icon;
    }

    get title() {
        return this._title;
    }

    get date() {
        return this._date;
    }

    get amount() {
        return this._amount;
    }

    get category() {
        return this._category;
    }

    get tags() {
        return this._tags;
    }

    get memo() {
        return this._memo;
    }

    set id(id: string) {
        this._id = id;
    }

    set isCurrent(isCurrent: boolean) {
        this._isCurrent = isCurrent;
    }

    set isExpense(isExpense: boolean) {
        this._isExpense = isExpense;
    }

    set icon(icon: string) {
        this._icon = icon;
    }

    set title(title: string[]) {
        this._title = title;
    }

    set date(date: Date) {
        this._date = date;
    }

    set amount(amount: number) {
        this._amount = amount;
    }

    set category(category: Category) {
        this._category = category;
    }

    set tags(tags: string[]) {
        this._tags = tags;
    }

    set memo(memo: string) {
        this._memo = memo;
    }

    constructor(transaction: {
        id: string;
        isCurrent: boolean;
        isExpense: boolean;
        title: string[];
        date: Date;
        amount: number;
        category: Category;
        tags?: string[];
        icon?: string;
        memo?: string;
    }) {
        const {
            id,
            isCurrent,
            isExpense,
            icon,
            title,
            date,
            amount,
            category,
            tags,
            memo,
        } = transaction;
        this._id = id;
        this._isCurrent = isCurrent;
        this._isExpense = isExpense;
        this._icon = icon || category.icon;
        this._title = title;
        this._date = date;
        this._amount = amount;
        this._category = category;
        this._tags = tags || [];
        this._memo = memo || '';
    }
}

export default Transaction;
