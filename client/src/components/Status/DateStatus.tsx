import classes from './DateStatus.module.css';
import Transaction from '../../models/Transaction';
import Calendar from '../UI/Calendar';
import StatusHeader from './StatusHeader';
import { useState } from 'react';

function DateStatus(props: {
    date: { start: Date; end: Date };
    transactions: Transaction[];
}) {
    const [isMonthly, setIsMonthly] = useState(true);

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
            <div className={classes.content}>
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

    const headerTabs = [
        {
            label: '월간',
            value: 'monthly',
            onChange: () => {
                setIsMonthly(true);
            },
            defaultChecked: isMonthly,
        },
        {
            label: '주간',
            value: 'weekly',
            onChange: () => {
                setIsMonthly(false);
            },
            defaultChecked: !isMonthly,
        },
    ];

    return (
        <>
            <StatusHeader
                className={classes.header}
                id="date-status-type"
                title="날짜별 현황"
                values={headerTabs}
            />
            <Calendar
                startDate={props.date.start}
                endDate={props.date.end}
                getDateStatus={getDateStatus}
            />
        </>
    );
}

export default DateStatus;
