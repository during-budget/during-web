import { useState } from 'react';
import classes from './DateStatus.module.css';
import Transaction from '../../../models/Transaction';
import { getNumericHypenDateString, getWeekNames, getWeekNumbers } from '../../../util/date';
import Calendar from '../../UI/Calendar';
import IndexNav from '../../UI/IndexNav';
import RadioTab from '../../UI/RadioTab';
import StatusHeader from './StatusHeader';
import IncomeExpenseAmount from '../Amount/IncomeExpenseAmount';

function DateStatus(props: {
    title: string;
    date: { start: Date; end: Date };
    transactions: Transaction[];
}) {
    const { title, date, transactions } = props;

    const [isMonthly, setIsMonthly] = useState(true);
    const [weekNum, setWeekNum] = useState(0);
    const [isView, setIsView] = useState(true);

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

    const actionTabs = [
        {
            label: '내역 조회',
            value: 'view',
            onChange: () => setIsView(true),
            checked: isView,
        },

        {
            label: '내역 추가',
            value: 'add',
            onChange: () => setIsView(false),
            checked: !isView,
        },
    ];

    // Monthly
    const monthlyStatus = (
        <>
            <Calendar
                startDate={date.start}
                endDate={date.end}
                locale={navigator.language}
                data={getMonthlyStatus(transactions)}
                blurAfterToday={true}
            />
            <RadioTab name="date-status-action" values={actionTabs} />
        </>
    );

    // Weekly
    const weekNames = getWeekNames(
        title,
        date.start,
        date.end,
        navigator.language
    );
    const weeklyStatus = (
        <>
            <Calendar
                startDate={date.start}
                endDate={date.end}
                isMonthTop={true}
                weekIdx={weekNum}
                locale={navigator.language}
                blurAfterToday={true}
            />
            <IndexNav idx={weekNum} setIdx={setWeekNum} data={weekNames} />
            <ul>
                {getWeekNumbers(date.start, date.end, navigator.language).map(
                    (item: string, i: number) => (
                        <li key={i}>{item}</li>
                    )
                )}
            </ul>
        </>
    );

    return (
        <>
            <StatusHeader
                className={classes.header}
                id="date-status-type"
                title="날짜별 현황"
                values={headerTabs}
            />
            {isMonthly ? monthlyStatus : weeklyStatus}
        </>
    );
}

const getMonthlyStatus = (transactions: Transaction[]) => {
    const dailyAmount = getDailyAmount(transactions);
    const status: any = {};

    for (const date in dailyAmount) {
        const amount = dailyAmount[date];
        const { income, expense } = amount;
        status[date] = (
            <IncomeExpenseAmount income={income} expense={expense} />
        );
    }

    return status;
};

const getWeeklyStatus = (dailyAmount: any) => {};

const getDailyAmount = (transactions: Transaction[]) => {
    const amounts: any = {};

    transactions.forEach((item) => {
        const { date, isCurrent, isExpense, amount, linkId } = item;
        const dateStr = getNumericHypenDateString(date);

        const key = isExpense ? 'expense' : 'income';
        const now = new Date();

        // NOTE: 합산 제외
        const beforeToday = date < now && !isCurrent; // 오늘 이전 날짜의 예정내역
        const isDone = !isCurrent && linkId; // 완료된 예정 내역
        if (beforeToday || isDone) {
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
