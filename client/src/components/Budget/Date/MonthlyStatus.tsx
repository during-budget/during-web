import { useState } from 'react';
import { transactionActions } from '../../../store/transaction';
import { uiActions } from '../../../store/ui';
import Calendar from '../../UI/Calendar';
import RadioTab from '../../UI/RadioTab';
import IncomeExpenseAmount from '../Amount/IncomeExpenseAmount';
import { useAppDispatch } from '../../../hooks/redux-hook';

function MonthlyStatus(props: {
    date: { start: Date; end: Date };
    dailyAmountObj: any;
}) {
    const dispatch = useAppDispatch();
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

    const clickHandler = async (event: React.MouseEvent) => {
        const date = getDate(event);

        if (isView) {
            await dispatch(uiActions.setIsCurrent(true));
            const dateList = document.getElementById(date);
            dateList?.scrollIntoView({ behavior: 'smooth' });
        } else {
            dispatch(
                transactionActions.setForm({
                    mode: { isExpand: true },
                    default: { date: new Date(date) },
                })
            );
        }
    };

    const getDate = (event: React.MouseEvent) => {
        let date: string | null;
        const eventTarget = event.currentTarget as HTMLElement;

        date = (eventTarget as HTMLTableDataCellElement).getAttribute(
            'data-date'
        );

        return date!;
    };

    return (
        <>
            <Calendar
                startDate={props.date.start}
                endDate={props.date.end}
                locale={navigator.language}
                data={getMonthlyStatus(props.dailyAmountObj)}
                onDateClick={clickHandler}
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
