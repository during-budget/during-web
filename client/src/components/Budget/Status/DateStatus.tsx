import { useEffect, useState } from 'react';
import { useAppSelector } from '../../../hooks/redux-hook';
import { TransactionType } from '../../../util/api/transactionAPI';
import { getNumericHypenDateString } from '../../../util/date';
import MonthlyStatus from '../Date/MonthlyStatus';
import WeeklyStatus from '../Date/WeeklyStatus';
import classes from './DateStatus.module.css';
import StatusHeader from './StatusHeader';

function DateStatus(props: { budgetId: string }) {
  // get budget Data
  const { title, date } = useAppSelector((state) => state.budget.current);

  const transactions = useAppSelector((state) => state.transaction.data);

  const [isMonthly, setIsMonthly] = useState(true);
  const [dailyAmountObj, setDailyAmountObj] = useState({});

  // Daily
  useEffect(() => {
    setDailyAmountObj(getDailyAmountObj(transactions));
  }, [transactions]);

  // Monthly
  const monthlyStatus = <MonthlyStatus date={date} dailyAmountObj={dailyAmountObj} />;

  // Weekly
  const weeklyStatus = (
    <WeeklyStatus title={title} date={date} dailyAmountObj={dailyAmountObj} />
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

const getDailyAmountObj = (transactions: TransactionType[]) => {
  const amounts: any = {};

  transactions.forEach((item) => {
    const { date, isExpense, amount } = item;
    const dateStr = date ? getNumericHypenDateString(date) : '';
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
const isExcept = (transaction: TransactionType) => {
  const { date, isCurrent, linkId } = transaction;
  const now = new Date();

  // 날짜 미정일 경우
  if (!date) {
    return true;
  }

  // 오늘 이전 날짜의 예정내역일 경우
  if (date <= now && !isCurrent) {
    return true;
  }

  // 완료된 예정 내역일 경우
  if (!isCurrent && linkId) {
    return true;
  }

  return false;
};
