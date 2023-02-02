class Transaction {
    private _id: string;
    private _budgetId: string;
    private _linkId: string | undefined;
    private _isCurrent: boolean;
    private _isExpense: boolean;
    private _icon: string;
    private _title: string[];
    private _date: Date;
    private _amount: number;
    private _categoryId: string;
    private _tags: string[];
    private _memo: string;

    get id() {
        return this._id;
    }

    get budgetId() {
        return this._budgetId;
    }

    get linkId() {
        return this._linkId;
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

    get categoryId() {
        return this._categoryId;
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

    set budgetId(budgetId: string) {
        this._budgetId = budgetId;
    }

    set linkId(linkId: string | undefined) {
        this._linkId = linkId;
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

    set categoryId(categoryId: string) {
        this._categoryId = categoryId;
    }

    set tags(tags: string[]) {
        this._tags = tags;
    }

    set memo(memo: string) {
        this._memo = memo;
    }

    static getTransaction = (item: any) => {
        const {
            _id: id,
            budgetId,
            linkId,
            isExpense,
            isCurrent,
            title,
            amount,
            date,
            category,
            icon,
            memo,
            tags,
        } = item;
        return new Transaction({
            id,
            budgetId,
            linkId,
            isCurrent,
            isExpense,
            title,
            date: new Date(date),
            amount,
            categoryId: category.categoryId,
            icon: icon ? icon : category.icon,
            tags,
            memo,
        });
    };

    constructor(transaction: {
        id: string;
        budgetId: string;
        linkId?: string;
        isCurrent: boolean;
        isExpense: boolean;
        title: string[];
        date: Date;
        amount: number;
        categoryId: string;
        tags?: string[];
        icon?: string;
        memo?: string;
    }) {
        const {
            id,
            budgetId,
            linkId,
            isCurrent,
            isExpense,
            icon,
            title,
            date,
            amount,
            categoryId,
            tags,
            memo,
        } = transaction;
        this._id = id;
        this._budgetId = budgetId;
        this._linkId = linkId;
        this._isCurrent = isCurrent;
        this._isExpense = isExpense;
        this._icon = icon || '';
        this._title = title;
        this._date = date;
        this._amount = amount;
        this._categoryId = categoryId;
        this._tags = tags || [];
        this._memo = memo || '';
    }
}

export default Transaction;
