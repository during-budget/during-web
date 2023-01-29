import { useDispatch } from 'react-redux';
import classes from './DateStatus.module.css';
import { uiActions } from '../../store/ui';
import Calendar from '../UI/Calendar';
import { Fragment, useState } from 'react';
import RadioTab from '../UI/RadioTab';

function DateStatus(props: {
    startDate: Date;
    endDate: Date;
    budgetId: string;
}) {
    const dispatch = useDispatch();
    const [isScroll, setIsScroll] = useState(false);

    const scrollHandler = (event: React.MouseEvent) => {
        const date = getDate(event);
        window.location.replace('#' + date);
    };

    const formHandler = (event: React.MouseEvent) => {
        const date = getDate(event);
        dispatch(
            uiActions.setTransactionForm({
                isExpand: true,
                input: { date: date! },
            })
        );
    };

    const getDate = (event: React.MouseEvent) => {
        let date: string | null;

        const eventTarget = event.target as HTMLElement;
        if (eventTarget.nodeName === 'P') {
            date = (
                eventTarget.parentNode as HTMLTableDataCellElement
            ).getAttribute('data-date');
        } else if (eventTarget.nodeName === 'TD') {
            date = (eventTarget as HTMLTableDataCellElement).getAttribute(
                'data-date'
            );
        }
        return date!;
    };

    return (
        <Fragment>
            <Calendar
                startDate={props.startDate}
                endDate={props.endDate}
                budgetId={props.budgetId}
                onClick={isScroll ? scrollHandler : formHandler}
            ></Calendar>

            <RadioTab
                className={classes.tab}
                name="calendar-action"
                values={[
                    {
                        label: '내역 조회',
                        value: 'scroll',
                        checked: isScroll,
                        onChange: () => setIsScroll(true),
                    },

                    {
                        label: '내역 추가',
                        value: 'add',
                        checked: !isScroll,
                        onChange: () => setIsScroll(false),
                    },
                ]}
            />
        </Fragment>
    );
}

export default DateStatus;
