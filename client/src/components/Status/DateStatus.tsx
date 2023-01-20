import { useDispatch } from 'react-redux';
import { uiActions } from '../../store/ui';
import Calendar from '../UI/Calendar';

function DateStatus(props: { startDate: Date; endDate: Date }) {
    const dispatch = useDispatch();

    const clickHandler = (event: React.MouseEvent) => {
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
        <Calendar
            startDate={props.startDate}
            endDate={props.endDate}
            onClick={clickHandler}
        ></Calendar>
    );
}

export default DateStatus;
