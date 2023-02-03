import Amount from './Amount';

class Category {
    private _id: string;
    private _title: string;
    private _icon: string;
    private _isExpense: boolean;
    private _isIncome: boolean;
    private _amount: Amount | undefined;

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

    get amount() {
        return this._amount;
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

    static getCategoryUpdatedPlan(
        prevCategory: Category | any,
        plannedAmount: number
    ) {
        const { id, title, icon, isExpense, isIncome, amount } = prevCategory;
        return new Category({
            id,
            title,
            icon,
            isExpense,
            isIncome,
            amount: new Amount(
                amount?.current || 0,
                amount?.scheduled || 0,
                plannedAmount
            ),
        });
    }

    constructor(category: {
        id: string;
        title: string;
        icon: string;
        isExpense: boolean;
        isIncome: boolean;
        amount?: Amount;
    }) {
        const { id, title, icon, isExpense, isIncome, amount } = category;
        this._id = id;
        this._title = title;
        this._icon = icon;
        this._isExpense = isExpense;
        this._isIncome = isIncome;
        this._amount = amount ? amount : undefined;
    }
}

export default Category;
