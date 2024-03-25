import { useState } from 'react';
import { getWeekDays, getWeekIdx, getWeekNames } from '../../../util/date';
import IndexNav from '../../UI/nav/IndexNav';
import Calendar from '../../UI/widget/Calendar';
import IncomeExpenseGroupedChart from '../Chart/IncomeExpenseGroupedChart';

function WeeklyStatus(props: {
  title: string;
  date: { start: Date; end: Date };
  dailyAmountObj: any;
}) {
  const [weekIdx, setWeekIdx] = useState(0);

  const { title, date, dailyAmountObj } = props;

  const weekNames = getWeekNames(title, date.start, date.end, 'ko-KR');

  const dailyChart = (
    <div>
      <Calendar
        startDate={date.start}
        endDate={date.end}
        isMonthTop={true}
        weekIdx={weekIdx}
        locale={'ko-KR'}
      />
      <IncomeExpenseGroupedChart
        className="w-100 mt-0.5 j-around"
        amount={getDailyAmountArr(dailyAmountObj, weekIdx, date.start)}
        height="14vh"
        showZero={true}
      />
      <IndexNav idx={weekIdx} setIdx={setWeekIdx} data={weekNames} />
    </div>
  );

  const weeklyChart = (
    <IncomeExpenseGroupedChart
      className="w-80 mt-1.5 j-between"
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

const getDailyAmountArr = (dailyAmountObj: any, weekIdx: number, start: Date) => {
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

    if (amounts[idx]) {
      amounts[idx].expense += expense;
      amounts[idx].income += income;
    }
  }

  return amounts;
};
