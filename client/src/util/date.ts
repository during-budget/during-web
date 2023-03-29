import dayjs, { Dayjs } from 'dayjs';
import weekOfYear from 'dayjs/plugin/weekOfYear';

dayjs.extend(weekOfYear);

const WEEK_NAMES: any = {
    'ko-KR': ['첫째주', '둘째주', '셋째주', '넷째주', '다섯째주'],
    'en-US': [
        'First week',
        'Second week',
        'Thired week',
        'Fourth week',
        'Fifth week',
    ],
};

// yyyy. mm. dd.
export const getNumericDotDateString = (date: Date) => {
    return getLocaleNumericString(date, 'ko-KR');
};

// yyyy-mm-dd
export const getNumericHypenDateString = (date: Date) => {
    return getLocaleNumericString(date, 'sv-SE');
};

export const getLocaleNumericString = (date: Date, locale: string) => {
    return date.toLocaleString(locale, {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
    });
};

export const getLongMonth = (date: Date, locale: string) => {
    return date.toLocaleString(locale, { month: 'long' });
};

export const isToday = (day: Dayjs | Date | null) => {
    if (day === null) {
        return false;
    }

    let dayjsDay;
    if (day instanceof Date) {
        dayjsDay = dayjs(day);
    } else {
        dayjsDay = day;
    }

    return dayjsDay.format('YYYY-MM-DD') === dayjs().format('YYYY-MM-DD');
};

export const getMonthsOfWeek = (week: (Dayjs | null)[]) => {
    const weekDays = week?.filter((item) => item);
    const start = weekDays[0];
    const end = weekDays[weekDays.length - 1];
    return getMonthsBetweenDate(start, end);
};

export const getMonthsBetweenDate = (
    startDate: Dayjs | Date | null,
    endDate: Dayjs | Date | null
) => {
    if (!startDate || !endDate) {
        return '';
    }

    // set or transfrom start & end
    let start = startDate;
    let end = endDate;

    if (!dayjs.isDayjs(start)) {
        start = dayjs(start);
    }

    if (!dayjs.isDayjs(end)) {
        end = dayjs(end);
    }

    // get month
    if (start?.month() === end?.month()) {
        return start?.format('MMM') || '';
    } else {
        const startMonth = start?.format('MMM');
        const endMonth = end?.format('MMM');
        return `${startMonth}-${endMonth}`;
    }
};

export const getWeekNames = (
    title: string,
    startDate: Date,
    endDate: Date,
    locale: string
) => {
    const weekNumbers = getWeekNumbers(startDate, endDate, locale);
    const weekNames = weekNumbers.map((item: string) => title + ' ' + item);

    return weekNames;
};

export const getWeekNumbers = (
    startDate: Date,
    endDate: Date,
    locale: string
) => {
    const startWeek = dayjs(startDate).week();
    const endWeek = dayjs(endDate).week();
    const weekLength = endWeek - startWeek + 1; // NOTE: 단순 차이만 구하면 사이 기간만 포함됨. 1을 더하여 시작 주차도 포함

    const weekNames = WEEK_NAMES[locale] || WEEK_NAMES['en-US'];

    return weekNames.slice(0, weekLength);
};

// TODO: 2-3월 같이 걸친 기간에서도 제대로 동작하는지 확인 필요
export const getWeekIdx = (date: Date, range: { start: Date; end: Date }) => {
    const startOfWeekDate = dayjs(range.start).startOf('week');
    const diffWeeks = dayjs(date).diff(startOfWeekDate, 'week');

    return diffWeeks;
};

export const getWeekDays = (weekIdx: number, startDate: Date) => {
    const startOfWeek = dayjs(startDate).startOf('week');
    const startOfRequestedWeek = startOfWeek.add(weekIdx, 'week');
    const endOfRequestedWeek = startOfWeek
        .add(weekIdx + 1, 'week')
        .subtract(1, 'day');
    const dates = [];
    let date = startOfRequestedWeek;

    while (
        date.isBefore(endOfRequestedWeek) ||
        date.isSame(endOfRequestedWeek, 'day')
    ) {
        dates.push(date.format('YYYY-MM-DD'));
        date = date.add(1, 'day');
    }

    return dates;
};
