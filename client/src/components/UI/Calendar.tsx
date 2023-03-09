import classes from './Calendar.module.css';
import {
    getLongMonth,
    getNumericHypenDateString,
    getWeekDays,
} from '../../util/date';

function Calendar(props: {
    startDate: Date;
    endDate: Date;
    width?: string;
    getDateStatus?: (date: Date) => void;
    onClick?: (event: React.MouseEvent) => void;
}) {
    const { startDate, endDate } = props;
    const locale = navigator.language;

    const getMonthTr = (date: Date, currIdx: number) => {
        const month = [];

        // NOTE: set position to currIdx
        for (let i = 0; i < currIdx; i++) {
            month.push(<td key={i} />);
        }

        month.push(
            <td className={classes.month} key={`month-${date.getMonth()}`}>
                {getLongMonth(date, locale)}
            </td>
        );

        return month;
    };

    const getWeekTr = () => {
        const weeks = [];

        const date = new Date(startDate);
        let key = 0;

        while (date < endDate) {
            const weekTr = [];

            for (let i = 0; i < 7 && date < endDate; i++) {
                const currDay = date.getDate();
                const currDayOfWeek = date.getDay();

                // NOTE: 요일에 맞춰 날짜 표시하기 위한 if문
                if (currDayOfWeek === i) {
                    // monthTr
                    if (currDay === 1 || currDay === startDate.getDate()) {
                        const monthTr = (
                            <tr key={`month-${key}`}>{getMonthTr(date, i)}</tr>
                        );
                        weeks.push(monthTr);
                    }

                    // weekTr <- dayTd
                    const dayTd = (
                        <td
                            className={classes.date}
                            key={`date-${i}`}
                            data-date={getNumericHypenDateString(date)}
                        >
                            <div className={classes.center}>
                                <>
                                    <p>{currDay}</p>
                                    {props.getDateStatus &&
                                        props.getDateStatus(date)}
                                </>
                            </div>
                        </td>
                    );
                    weekTr.push(dayTd);

                    date.setDate(currDay + 1);
                } else {
                    weekTr.push(<td key={`date-${i}`}></td>);
                }
            }

            weeks.push(<tr key={`week-${key}`}>{[...weekTr]}</tr>);
            key++;
        }

        return weeks;
    };

    return (
        <table
            className={classes.container}
            style={props.width ? { width: props.width } : {}}
            onClick={props.onClick}
        >
            <thead>
                <tr>
                    {getWeekDays(locale).map((day) => (
                        <th className={classes.day} key={day}>
                            {day}
                        </th>
                    ))}
                </tr>
            </thead>
            <tbody>{getWeekTr()}</tbody>
        </table>
    );
}

export default Calendar;
