import { Fragment, useEffect, useState } from 'react';
import dayjs, { Dayjs, months } from 'dayjs';
import localeData from 'dayjs/plugin/localeData';
import 'dayjs/locale/ko';
import 'dayjs/locale/en';
import classes from './Calendar.module.css';
import { getMonthsOfWeek, isToday } from '../../util/date';

dayjs.extend(localeData);

function Calendar(props: {
    startDate: Date;
    endDate: Date;
    data?: any;
    isMonthTop?: boolean;
    weekIdx?: number;
    locale?: string;
    blurAfterToday?: boolean;
    cellHeight?: string;
}) {
    const { startDate, endDate, isMonthTop, weekIdx, locale } = props;
    const [dates, setDates] = useState<Dayjs[]>([]);
    const [weeks, setWeeks] = useState<(Dayjs | null)[][]>([]);
    const [monthState, setMonthState] = useState('');

    const propsCode = locale?.split('-')[0] || '';
    const code = ['ko', 'en'].includes(propsCode) ? propsCode : 'en';
    dayjs.locale(code);

    // date
    useEffect(() => {
        const start = dayjs(startDate);
        const end = dayjs(endDate);
        const diff = end.diff(start, 'days');

        const dates = [];
        for (let i = 0; i <= diff; i++) {
            const date = dayjs(startDate).add(i, 'days');
            dates.push(date);
        }

        setDates(dates);
    }, [startDate, endDate]);

    // weeks
    useEffect(() => {
        const weeks: (Dayjs | null)[][] = [];
        let week: (Dayjs | null)[] = [];

        if (dates.length === 0) {
            return;
        }

        dates.forEach((date) => {
            // to next week
            if (week.length > 0 && date.day() === 0) {
                weeks.push(week);
                week = [];
            }

            // set start point of first week
            if (weeks.length === 0 && week.length === 0) {
                for (let i = 0; i < date.day(); i++) {
                    week.push(null);
                }
            }

            // collect days for week
            week.push(date);
        });

        if (week.length > 0) {
            weeks.push(week);
        }

        setWeeks(weeks);
    }, [dates]);

    // month
    useEffect(() => {
        if (weeks.length === 0) {
            return;
        }

        if (weekIdx !== undefined) {
            const month = getMonthsOfWeek(weeks[weekIdx]);
            setMonthState(month);
        }
    }, [weeks, weekIdx]);

    // <tr>
    const getMonthTr = (week: (Dayjs | null)[], i: number) => {
        const tds = week.map((day, i) => {
            if (
                day?.get('date') === 1 ||
                day?.get('date') === startDate.getDate()
            ) {
                return (
                    <td key={i} className={classes.month}>
                        {day?.format('MMM')}
                    </td>
                );
            } else {
                return <td key={i} />;
            }
        });

        return <tr key={i + '-month'}>{tds}</tr>;
    };

    const getTdClass = (day: Dayjs | null) => {
        const target = dayjs(day?.format('YYYY-MM-DD'));
        const today = dayjs(dayjs().format('YYYY-MM-DD'));

        if (props.blurAfterToday && target && target > today) {
            return classes.after;
        } else {
            return '';
        }
    };

    const weekTr = weeks.map((week, i) => {
        return (
            <Fragment key={i}>
                {!isMonthTop && getMonthTr(week, i)}
                <tr key={i}>
                    {week.map((day, i) => (
                        <td
                            key={i}
                            className={`${classes.date} ${getTdClass(day)}`}
                            style={{ height: props.cellHeight || 'auto' }}
                        >
                            <span className={isToday(day) ? classes.today : ''}>
                                {day?.format('D')}
                            </span>
                            {day &&
                                props.data &&
                                props.data[day.format('YYYY-MM-DD')]}
                        </td>
                    ))}
                </tr>
            </Fragment>
        );
    });

    return (
        <div className={classes.container}>
            {isMonthTop && <h6>{monthState}</h6>}
            <table>
                <thead>
                    <tr>
                        {dayjs.weekdaysShort().map((day: string, i) => (
                            <th key={i} className={classes.day}>
                                {day?.toUpperCase()}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {weekIdx !== undefined ? weekTr[weekIdx] : weekTr}
                </tbody>
            </table>
        </div>
    );
}

export default Calendar;
