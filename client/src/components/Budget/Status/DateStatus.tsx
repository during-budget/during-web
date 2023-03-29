import { useEffect, useState } from 'react';
import classes from './DateStatus.module.css';
import Transaction from '../../../models/Transaction';
import { getNumericHypenDateString } from '../../../util/date';
import StatusHeader from './StatusHeader';
import MonthlyStatus from '../Date/MonthlyStatus';
import WeeklyStatus from '../Date/WeeklyStatus';

function DateStatus(props: {
    title: string;
    date: { start: Date; end: Date };
    transactions: Transaction[];
}) {
    const { title, date, transactions } = props;

    const [isMonthly, setIsMonthly] = useState(true);
    const [dailyAmountObj, setDailyAmountObj] = useState({});

    // Daily
    useEffect(() => {
        setDailyAmountObj(getDailyAmountObj(transactions));
    }, [transactions]);

    // Monthly
    const monthlyStatus = (
        <MonthlyStatus date={date} dailyAmountObj={dailyAmountObj} />
    );

    // Weekly
    const weeklyStatus = (
        <WeeklyStatus
            title={title}
            date={date}
            dailyAmountObj={dailyAmountObj}
        />
    );

    // Tabs
    const headerTabs = [
        {
            label: '월간',
            value: 'monthly',
            onChange: () => {
                setIsMonthly(true);
            },
            checked: isMonthly,
        },
        {
            label: '주간',
            value: 'weekly',
            onChange: () => {
                setIsMonthly(false);
            },
            checked: !isMonthly,
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
            {dailyAmountObj && (isMonthly ? monthlyStatus : weeklyStatus)}
        </>
    );
}

const getDailyAmountObj = (transactions: Transaction[]) => {
    const amounts: any = {};

    transactions.forEach((item) => {
        const { date, isExpense, amount } = item;
        const dateStr = getNumericHypenDateString(date);
        const key = isExpense ? 'expense' : 'income';

        if (isExcept(item)) {
            return;
        }

        if (!amounts[dateStr]) {
            amounts[dateStr] = {
                income: 0,
                expense: 0,
            };
        }

        amounts[dateStr][key] += amount;
    });

    return amounts;
};

export default DateStatus;

// 합산 제외
const isExcept = (transaction: Transaction) => {
    const { date, isCurrent, linkId } = transaction;
    const now = new Date();

    const beforeToday = date <= now && !isCurrent; // 오늘 이전 날짜의 예정내역
    const isDone = !isCurrent && linkId; // 완료된 예정 내역

    if (beforeToday || isDone) {
        return true;
    } else {
        return false;
    }
};
