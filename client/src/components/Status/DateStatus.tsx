import { useDispatch } from 'react-redux';
import classes from './DateStatus.module.css';
import { uiActions } from '../../store/ui';
import Calendar from '../UI/Calendar';
import { Fragment, useState } from 'react';

function DateStatus(props: {
    startDate: Date;
    endDate: Date;
    budgetId: string;
}) {
    const dispatch = useDispatch();
    const [isScroll, setIsScroll] = useState(true);

    const scrollHandler = (event: React.MouseEvent) => {
        const date = (event.target as HTMLTableDataCellElement).getAttribute(
            'data-date'
        );
        window.location.replace('#' + date);
    };

    const formHandler = (event: React.MouseEvent) => {
        const date = (event.target as HTMLTableDataCellElement).getAttribute(
            'data-date'
        );
        dispatch(
            uiActions.setTransactionForm({
                isExpand: true,
                input: { date: date },
            })
        );
    };

    return (
        <Fragment>
            <Calendar
                startDate={props.startDate}
                endDate={props.endDate}
                budgetId={props.budgetId}
                onClick={isScroll ? scrollHandler : formHandler}
            ></Calendar>
            <div className={`nav-tab ${classes.tab}`}>
                <input
                    id="calendar-action-scroll"
                    type="radio"
                    name="calendar-action"
                    checked={isScroll}
                    onChange={() => setIsScroll(true)}
                ></input>
                <label htmlFor="calendar-action-scroll">내역 조회</label>
                <input
                    id="calendar-action-form"
                    type="radio"
                    name="calendar-action"
                    checked={!isScroll}
                    onChange={() => {
                        setIsScroll(false);
                    }}
                ></input>
                <label htmlFor="calendar-action-form">내역 추가</label>
            </div>
        </Fragment>
    );
}

export default DateStatus;
