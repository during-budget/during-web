const WEEK_DAYS = {
    'ko-KR': ['일', '월', '화', '수', '목', '금', '토'],
    'en-US': ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'],
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

export const getWeekDays = (locale: string) => {
    switch (locale) {
        case 'ko-KR':
            return WEEK_DAYS['ko-KR'];
        case 'en-US':
            return WEEK_DAYS['en-US'];
        default:
            return WEEK_DAYS['en-US'];
    }
};
