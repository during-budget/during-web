import Calendar from '../UI/Calendar';

function DateStatus(props: {
    startDate: Date;
    endDate: Date;
    onClick: (date: Date) => void;
}) {
    const clickHandler = (event: React.MouseEvent) => {
        const date = (event.target as HTMLTableDataCellElement).getAttribute(
            'data-date'
        );
        props.onClick(new Date(date!));
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
