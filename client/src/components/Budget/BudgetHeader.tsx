import classes from './BudgetHeader.module.css';

const getDateString = (date: Date) => {
    return date
        .toLocaleString('ko-KR', {
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',
        })
        .split(' ')
        .join('');
};

function BudgetHeader(props: {
    startDate: Date;
    endDate: Date;
    title: string;
}) {
    return (
        <header className={classes.header}>
            <div className={classes.date}>
                <span>{getDateString(props.startDate)}</span>
                <span> ~ </span>
                <span>{getDateString(props.endDate)}</span>
            </div>
            <h1 className={classes.title}>{props.title}</h1>
        </header>
    );
}

export default BudgetHeader;
