import { useState } from 'react';
import classes from './WeeklyStatus.module.css';
import Calendar from '../../UI/Calendar';
import IndexNav from '../../UI/IndexNav';
import IncomeExpenseGroupedChart from '../Chart/IncomeExpenseGroupedChart';
import { getWeekDays, getWeekIdx, getWeekNames } from '../../../util/date';

function WeeklyStatus(props: {
    title: string;
    date: { start: Date; end: Date };
    dailyAmountObj: any;
}) {
    const [weekIdx, setWeekIdx] = useState(0);

    const { title, date, dailyAmountObj } = props;

    const weekNames = getWeekNames(
        title,
        date.start,
        date.end,
        navigator.language
    );

    const dailyChart = (
        <div>
            <Calendar
                startDate={date.start}
                endDate={date.end}
                isMonthTop={true}
                weekIdx={weekIdx}
                locale={navigator.language}
            />
            <IncomeExpenseGroupedChart
                className={classes.weekDailyChart}
                amount={getDailyAmountArr(dailyAmountObj, weekIdx, date.start)}
                height="14vh"
                showZero={true}
            />
            <IndexNav idx={weekIdx} setIdx={setWeekIdx} data={weekNames} />
        </div>
    );

    const weeklyChart = (
        <IncomeExpenseGroupedChart
            className={classes.weeklyChart}
            height="12vh"
            barHeight="60%"
            amount={getWeeklyAmountArr(dailyAmountObj, weekNames.length, date)}
            label={weekNames.map((name: string) => name.split(' ')[1])}
            showZero={true}
            showEmpty={true}
        />
    );

    return (
        <>
            {dailyChart}
            {weeklyChart}
        </>
    );
}

export default WeeklyStatus;

const getDailyAmountArr = (
    dailyAmountObj: any,
    weekIdx: number,
    start: Date
) => {
    const weekDays = getWeekDays(weekIdx, start);

    const status = weekDays.map((date) => {
        if (dailyAmountObj[date]) {
            return dailyAmountObj[date];
        } else {
            // todo: null
            return {
                income: 0,
                expense: 0,
            };
        }
    });

    return status;
};

const getWeeklyAmountArr = (
    dailyAmountObj: any,
    weekLength: number,
    range: { start: Date; end: Date }
) => {
    const amounts = new Array(weekLength).fill(null).map(() => {
        return { income: 0, expense: 0 };
    });

    for (const date in dailyAmountObj) {
        const idx = getWeekIdx(new Date(date), range);
        const { expense, income } = dailyAmountObj[date];

        amounts[idx].expense += expense;
        amounts[idx].income += income;
    }

    return amounts;
};
