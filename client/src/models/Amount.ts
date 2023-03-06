class Amount {
    private _current: number;
    private _scheduled: number;
    private _planned: number;
    private _state: {
        target: string;
        over: string;
        isOver: boolean;
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

    private getEachState = (
        target: string,
        over: string,
        overAmount: number
    ) => {
        const isOver = overAmount < 0;
        return {
            target,
            over,
            isOver,
            amount: isOver ? -overAmount : 0,
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

    constructor(current: number, scheduled: number, planned: number) {
        this._current = current;
        this._scheduled = scheduled;
        this._planned = planned;
        this._state = this.getState();
    }
}

export default Amount;
