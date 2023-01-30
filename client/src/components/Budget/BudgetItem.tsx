import { Link } from 'react-router-dom';
import classes from './BudgetItem.module.css';
import Amount from '../../models/Amount';
import Budget from '../../models/Budget';
import budget from '../../store/budget';
import AmountRing from '../Amount/AmountRing';

function BudgetItem(props: {
    startDate: Date;
    endDate: Date;
    budget?: Budget;
    onClick?: () => void;
}) {
    const { startDate, endDate, budget, onClick } = props;

    const getMonthName = (date: Date) => {
        // TODO: LOCALE 상수 찾아서 넣기, 유틸로 빼기
        return date.toLocaleString('ko-KR', { month: 'long' });
    };

    // date
    const start = startDate.toLocaleDateString('ko-KR', {
        month: '2-digit',
        day: '2-digit',
    });
    const end = endDate.toLocaleDateString('ko-KR', {
        month: '2-digit',
        day: '2-digit',
    });

    // title
    const startMonth = getMonthName(startDate);
    const endMonth = getMonthName(endDate);
    const defaultTitle =
        startMonth === endMonth ? startMonth : `${startMonth} - ${endMonth}`;
    const title = budget ? budget.title : defaultTitle;

    const dateInfo = (
        <div className={classes.info}>
            <p>{`${start} ~ ${end}`}</p>
            <h5>{title}</h5>
        </div>
    );

    const amountRing = budget && (
        <>
            <Link to={budget.id}>
                <AmountRing
                    isExpense={true}
                    amount={budget.total.expense}
                    size="5rem"
                    dash={151}
                    width="0.96rem"
                    blur={2.6}
                />{' '}
                {dateInfo}
            </Link>
        </>
    );

    const addButton = (
        <>
            <button onClick={onClick} className={classes.button}>
                <div className={classes.add} />
                {dateInfo}
            </button>
        </>
    );

    return <li className={classes.item}>{budget ? amountRing : addButton}</li>;
}

export default BudgetItem;
