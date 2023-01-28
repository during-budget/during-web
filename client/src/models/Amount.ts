// TODO: locale 따라 처리
const amountUnit = '원';

const formatCurrent = (amount: number) => {
    return `${amount.toLocaleString()}${amountUnit}`;
};

const formatScheduled = (amount: number) => {
    return `(${amount.toLocaleString()}${amountUnit})`;
};

const formatBudget = (amount: number) => {
    return `/${amount.toLocaleString()}${amountUnit}`;
};

class Amount {
    private _current: number;
    private _scheduled: number;
    private _budget: number;
    private _state: {
        target: string;
        over: string;
        isTrue: boolean;
        amount: number;
    }[];

    get current() {
        return this._current;
    }

    get scheduled() {
        return this._scheduled;
    }

    get budget() {
        return this._budget;
    }

    get state() {
        return this._state;
    }

    set current(amount: number) {
        this._current = amount;
    }

    set scheduled(amount: number) {
        this._scheduled = amount;
    }

    set budget(amount: number) {
        this._budget = amount;
    }

    getCurrentStr = () => {
        return formatCurrent(this.current);
    };

    getScheduledStr = () => {
        return formatScheduled(this.scheduled);
    };

    getBudgetStr = () => {
        return formatBudget(this.budget);
    };

    getCurrentRatio = () => {
        if (this._budget === 0) {
            return 0;
        } else {
            return this._current / this._budget;
        }
    };

    getScheduledRatio = () => {
        if (this._budget === 0) {
            return 0;
        } else {
            return this._scheduled / this._budget;
        }
    };

    getLeftScheduled = () => {
        return this._scheduled - this._current;
    };

    getLeftBudget = () => {
        const bigger =
            this._scheduled > this._current ? this._scheduled : this._current;
        return this.budget - bigger;
    };

    getLeftScheduledStr = () => {
        return formatScheduled(this.getLeftScheduled());
    };

    getLeftBudgetStr = () => {
        return formatBudget(this.getLeftBudget());
    };

    addCurrent = (amount: number) => {
        this._current += amount;
    };

    addScheduled = (amount: number) => {
        this._scheduled += amount;
    };

    getAmountArr = () => {
        return [this._current, this._scheduled, this._budget];
    };

    private getEachState = (
        target: string,
        over: string,
        overAmount: number
    ) => {
        const isTrue = overAmount < 0;
        return {
            target,
            over,
            isTrue,
            amount: isTrue ? -overAmount : 0,
        };
    };

    private getState = () => {
        const currentOverSchedule = this.getEachState(
            '현재 내역',
            '예정 내역',
            this._scheduled - this._current
        );
        const currentOverBudget = this.getEachState(
            '현재 내역',
            '목표',
            this._budget - this._current
        );
        const scheduledOverBudget = this.getEachState(
            '예정 내역',
            '목표',
            this._budget - this.scheduled
        );

        return [currentOverSchedule, currentOverBudget, scheduledOverBudget];
    };

    static getAmountString = (amount: number) => {
        return amount.toLocaleString() + amountUnit;
    };

    static getUpdatedAmount = (
        prevAmount: Amount | any,
        isCurrent: boolean,
        amount: number
    ) => {
        const nextAmount = new Amount(
            prevAmount.current,
            prevAmount.scheduled,
            prevAmount.budget
        );

        if (isCurrent) {
            nextAmount.addCurrent(amount);
        } else {
            nextAmount.addScheduled(amount);
        }

        return nextAmount;
    };

    constructor(current: number, scheduled: number, budget: number) {
        this._current = current;
        this._scheduled = scheduled;
        this._budget = budget;
        this._state = this.getState();
    }
}

export default Amount;
