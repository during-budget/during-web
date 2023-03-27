import { useState } from 'react';
import classes from './DateStatus.module.css';
import Transaction from '../../../models/Transaction';
import { getWeekNames, getWeekNumbers } from '../../../util/date';
import Calendar from '../../UI/Calendar';
import IndexNav from '../../UI/IndexNav';
import RadioTab from '../../UI/RadioTab';
import StatusHeader from './StatusHeader';

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

export default DateStatus;
