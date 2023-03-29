import { useState } from 'react';
import Calendar from '../../UI/Calendar';
import RadioTab from '../../UI/RadioTab';
import IncomeExpenseAmount from '../Amount/IncomeExpenseAmount';

function MonthlyStatus(props: {
    date: { start: Date; end: Date };
    dailyAmountObj: any;
}) {
    const [isView, setIsView] = useState(true);

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

    return (
        <>
            <Calendar
                startDate={props.date.start}
                endDate={props.date.end}
                locale={navigator.language}
                data={getMonthlyStatus(props.dailyAmountObj)}
                blurAfterToday={true}
                cellHeight="4rem"
            />
            <RadioTab name="monthly-status-action" values={actionTabs} />
        </>
    );
}

const getMonthlyStatus = (dailyAmountObj: any) => {
    const status: any = {};

    for (const date in dailyAmountObj) {
        const amount = dailyAmountObj[date];
        const { income, expense } = amount;
        status[date] = (
            <IncomeExpenseAmount income={income} expense={expense} />
        );
    }

    return status;
};

export default MonthlyStatus;
