import classes from './DateStatus.module.css';
import Transaction from '../../models/Transaction';
import Calendar from '../UI/Calendar';

function DateStatus(props: {
    date: { start: Date; end: Date };
    transactions: Transaction[];
}) {
    const getDateStatus = (date: Date) => {
        let expenseTotal = 0;
        let incomeTotal = 0;
        props.transactions.forEach((item) => {
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
            <div className={classes.status}>
                {expenseTotal ? (
                    <p className={classes.expense}>
                        {'-' + expenseTotal.toLocaleString()}
                    </p>
                ) : (
                    ''
                )}
                {incomeTotal ? (
                    <p className={classes.income}>
                        {'+' + incomeTotal.toLocaleString()}
                    </p>
                ) : (
                    ''
                )}
            </div>
        );
    };

    return (
        <>
            <Calendar
                startDate={props.date.start}
                endDate={props.date.end}
                getDateStatus={getDateStatus}
            />
        </>
    );
}

export default DateStatus;
