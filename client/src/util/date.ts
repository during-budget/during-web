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
