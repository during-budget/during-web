// TODO: locale 따라 처리
const amountUnit = '원';

const formatCurrent = (amount: number) => {
    return `${amount.toLocaleString()}${amountUnit}`;
};

const formatScheduled = (amount: number) => {
    return `(${amount.toLocaleString()}${amountUnit})`;
};

const formatPlanned = (amount: number) => {
    return `/${amount.toLocaleString()}${amountUnit}`;
};

class Amount {
    private _current: number;
    private _scheduled: number;
    private _planned: number;
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

    get planned() {
        return this._planned;
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

    set planned(amount: number) {
        this._planned = amount;
    }

    getCurrentStr = () => {
        return formatCurrent(this.current);
    };

    getScheduledStr = () => {
        return formatScheduled(this.scheduled);
    };

    getPlannedStr = () => {
        return formatPlanned(this.planned);
    };

    getCurrentRatio = () => {
        if (this._planned === 0) {
            return 0;
        } else {
            return this._current / this._planned;
        }
    };

    getScheduledRatio = () => {
        if (this._planned === 0) {
            return 0;
        } else {
            return this._scheduled / this._planned;
        }
    };

    getLeftScheduled = () => {
        return this._scheduled - this._current;
    };

    getLeftPlanned = () => {
        const bigger =
            this._scheduled > this._current ? this._scheduled : this._current;
        return this.planned - bigger;
    };

    getLeftScheduledStr = () => {
        return formatScheduled(this.getLeftScheduled());
    };

    getLeftPlannedStr = () => {
        return formatPlanned(this.getLeftPlanned());
    };

    addCurrent = (amount: number) => {
        this._current += amount;
        this._state = this.getState();
    };

    addScheduled = (amount: number) => {
        this._scheduled += amount;
        this._state = this.getState();
    };

    getAmountArr = () => {
        return [this._current, this._scheduled, this._planned];
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
            '예정',
            this._scheduled - this._current
        );
        const currentOverPlanned = this.getEachState(
            '현재 내역',
            '목표',
            this._planned - this._current
        );
        const scheduledOverplanned = this.getEachState(
            '예정 내역',
            '목표',
            this._planned - this.scheduled
        );

        return [currentOverSchedule, currentOverPlanned, scheduledOverplanned];
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
            prevAmount.planned
        );

        if (isCurrent) {
            nextAmount.addCurrent(amount);
        } else {
            nextAmount.addScheduled(amount);
        }

        return nextAmount;
    };

    constructor(current: number, scheduled: number, planned: number) {
        this._current = current;
        this._scheduled = scheduled;
        this._planned = planned;
        this._state = this.getState();
    }
}

export default Amount;
