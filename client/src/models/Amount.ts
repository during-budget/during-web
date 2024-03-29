const locale: 'ko-KR' | 'en-US' = 'ko-KR'; //navigator.language === 'ko-KR' ? 'ko-KR' : 'en-US';
const amountUnit = {
  'en-US': {
    prefix: '$',
    suffix: '',
  },
  'ko-KR': {
    prefix: '',
    suffix: '원',
  },
};
const prefix = amountUnit[locale].prefix;
const suffix = amountUnit[locale].suffix;

const formatCurrent = (amount: number) => {
  return `${prefix}${amount === 0 || amount ? amount.toLocaleString() : ''}${suffix}`;
};

const formatScheduled = (amount: number) => {
  return `(${prefix}${amount === 0 || amount ? amount.toLocaleString() : ''}${suffix})`;
};

const formatPlanned = (amount: number) => {
  return `/${prefix}${amount === 0 || amount ? amount.toLocaleString() : ''}${suffix}`;
};

class Amount {
  private _current: number;
  private _scheduled: number;
  private _planned: number;
  private _state: {
    id: string;
    target: string;
    overTarget: string;
    isOver: boolean;
    amount: number;
  }[];
  private _overPlanned: boolean;
  private _allOverPlanned: boolean;

  constructor(current: number, scheduled: number, planned: number) {
    this._current = current;
    this._scheduled = scheduled;
    this._planned = planned;
    this._state = this.getState();
    this._overPlanned = this.getOverPlanned();
    this._allOverPlanned = this.getAllOverPlanned();
  }

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

  get overPlanned() {
    return this._overPlanned;
  }

  get allOverPlanned() {
    return this._allOverPlanned;
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

  getLeftScheduled = () => {
    return this._planned - (this._current + this._scheduled);
  };

  getLeftPlanned = () => {
    return this._planned - this._current;
  };

  getCurrentStr = () => {
    return formatCurrent(this.current);
  };

  getScheduledStr = (isLeft?: boolean) => {
    const scheduled = isLeft ? this.getLeftScheduled() : this._scheduled;
    return formatScheduled(scheduled);
  };

  getPlannedStr = (isLeft?: boolean) => {
    const planned = isLeft ? this.getLeftPlanned() : this._planned;
    return formatPlanned(planned);
  };

  getLeftScheduledStr = () => {
    return formatScheduled(this.getLeftScheduled());
  };

  getLeftPlannedStr = () => {
    return formatPlanned(this.getLeftPlanned());
  };

  getCurrentRatio = () => {
    if (this._planned === 0 || this._current === 0) {
      return 0;
    } else {
      return this._current / this._planned;
    }
  };

  getScheduledRatio = () => {
    if (this._planned === 0 || this._scheduled === 0) {
      return 0;
    } else {
      return this._scheduled / this._planned;
    }
  };

  addCurrent = (amount: number) => {
    this._current += amount;
  };

  addScheduled = (amount: number) => {
    this._scheduled += amount;
  };

  addPlanned = (amount: number) => {
    this._planned += amount;
  };

  static getAmountStr = (amount: number) => {
    return formatCurrent(amount);
  };

  private getState = () => {
    const currentOverAmount = this._planned - this._current;
    const currentIsOverPlan = currentOverAmount < 0;

    const scheduledOverAmount = this._planned - this._scheduled - this._current;
    const scheduledIsOver = (this._scheduled && scheduledOverAmount < 0) || false;

    return [
      {
        id: 'current',
        target: '현재내역',
        overTarget: '목표',
        isOver: currentIsOverPlan,
        amount: -currentOverAmount,
      },
      {
        id: 'scheduled',
        target: '예정내역',
        overTarget: '목표',
        isOver: scheduledIsOver,
        amount: currentIsOverPlan ? this._scheduled : -scheduledOverAmount,
      },
    ];
  };

  private getOverPlanned = () => {
    return this._planned - this._current < 0 || this._planned - this.scheduled < 0;
  };

  private getAllOverPlanned = () => {
    return (
      (this._scheduled && this._planned - this._current < 0) || false
    );
  };
}

export default Amount;
