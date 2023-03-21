import classes from './DateStatus.module.css';
import Transaction from '../../../models/Transaction';
import Calendar from '../../UI/Calendar';
import StatusHeader from './StatusHeader';
import { useState } from 'react';
import RadioTab from '../../UI/RadioTab';
import { useDispatch } from 'react-redux';
import { uiActions } from '../../../store/ui';
import { transactionActions } from '../../../store/transaction';

function DateStatus(props: {
    date: { start: Date; end: Date };
    transactions: Transaction[];
}) {
    const dispatch = useDispatch();

    const [isMonthly, setIsMonthly] = useState(true);
    const [isView, setIsView] = useState(true);

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
                    default: { date },
                })
            );
        }
    };

    const getDate = (event: React.MouseEvent) => {
        let date: string | null;

        const eventTarget = event.target as HTMLElement;
        if (eventTarget.nodeName === 'P') {
            date = (
                eventTarget.parentNode?.parentNode
                    ?.parentNode as HTMLTableDataCellElement
            ).getAttribute('data-date');
        } else if (eventTarget.nodeName === 'SPAN') {
            date = (
                eventTarget.parentNode?.parentNode as HTMLTableDataCellElement
            ).getAttribute('data-date');
        } else if (eventTarget.nodeName === 'TD') {
            date = (eventTarget as HTMLTableDataCellElement).getAttribute(
                'data-date'
            );
        }
        return date!;
    };

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
                onClick={clickHandler}
            />
            <RadioTab name="date-status-action" values={actionTabs} />
        </>
    );
}

export default DateStatus;
