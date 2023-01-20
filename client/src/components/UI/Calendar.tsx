import classes from './Calendar.module.css';
import { WEEK_DAYS } from '../../constants/date';
import { useSelector } from 'react-redux';
import Transaction from '../../models/Transaction';

function Calendar(props: {
    startDate: Date;
    endDate: Date;
    budgetId?: string;
    onClick?: (event: React.MouseEvent) => void;
}) {
    const { startDate, endDate } = props;
    const totalTransacitons = useSelector((state: any) => state.transactions);

    let transactions: Transaction[];
    if (props.budgetId) {
        transactions = totalTransacitons.filter(
            (item: any) => item.budgetId === props.budgetId
        );
    }

    const getDateStatus = (date: Date) => {
        let expenseTotal = 0;
        let incomeTotal = 0;
        transactions.forEach((item) => {
            if (
                item.isCurrent &&
                item.date.toLocaleDateString() === date.toLocaleDateString()
            ) {
                if (item.isExpense) {
                    expenseTotal += item.amount;
                } else {
                    incomeTotal += item.amount;
                }
            }
        });

        return (
            <>
                {expenseTotal ? (
                    <p className={classes.expense}>{'-' + expenseTotal}</p>
                ) : (
                    ''
                )}
                {incomeTotal ? (
                    <p className={classes.income}>{'+' + incomeTotal}</p>
                ) : (
                    ''
                )}
            </>
        );
    };

    const getMonthTr = (date: Date) => {
        const month = [];
        for (let i = 0; i < date.getDay(); i++) {
            month.push(<td key={i} />);
        }
        month.push(
            <td className={classes.month} key={`month-${date.getMonth()}`}>
                {date.toLocaleString('ko-KR', { month: 'long' })}
            </td>
        );
        return month;
    };

    const getWeekTr = () => {
        const weeks = [];

        for (const date = new Date(startDate); date < endDate; ) {
            const key = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
            const week = WEEK_DAYS.map((_, i) => {
                if (date > endDate) {
                    return;
                }

                const currDate = date.getDate();

                if (date.getDay() === i) {
                    // month
                    if (currDate === 1 || currDate === startDate.getDate()) {
                        weeks.push(
                            <tr key={`month-${key}`}>{getMonthTr(date)}</tr>
                        );
                    }

                    // date
                    const dateData = new Date(date);
                    date.setDate(currDate + 1);
                    return (
                        <td
                            className={classes.date}
                            key={`date-${i}`}
                            data-date={dateData.toLocaleDateString('sv-SE')} // yyyy-mm-dd
                        >
                            <p>{currDate}</p>
                            {transactions ? getDateStatus(dateData) : ''}
                        </td>
                    );
                } else {
                    return <td key={`date-${i}`}></td>;
                }
            });

            weeks.push(<tr key={`week-${key}`}>{[...week]}</tr>);
        }

        return weeks;
    };

    return (
        <table className={classes.calendar} onClick={props.onClick}>
            <thead>
                <tr>
                    {WEEK_DAYS.map((day) => (
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
