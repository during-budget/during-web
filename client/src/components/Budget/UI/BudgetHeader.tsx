import classes from './BudgetHeader.module.css';
import { getNumericDotDateString } from '../../../util/date';
import NavButton from '../../UI/NavButton';

function BudgetHeader(props: {
    startDate: Date;
    endDate: Date;
    title: string;
}) {
    // TODO: BudgetList 구현
    // TODO: Search 구현
    const top = (
        <>
            <button type="button">
                <i className="fa-solid fa-bars"></i>
            </button>
            <div className={classes.date}>
                <span>{getNumericDotDateString(props.startDate)}</span>
                <span> ~ </span>
                <span>{getNumericDotDateString(props.endDate)}</span>
            </div>
            <button type="button">
                <i className="fa-solid fa-magnifying-glass"></i>
            </button>
        </>
    );

    // TODO: 이전/이후 budget id 가져오기 - 이동 구현
    const bottom = (
        <>
            <NavButton to="/budget" isNext={false} />
            <h1>{props.title}</h1>
            <NavButton to="/budget" isNext={true} />
        </>
    );

    return (
        <header className={classes.header}>
            <div className={classes.top}>{top}</div>
            <div className={classes.bottom}>{bottom}</div>
        </header>
    );
}

export default BudgetHeader;
