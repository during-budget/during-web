import { useAppSelector } from '../../../hooks/redux-hook';
import { getNumericDotDateString } from '../../../util/date';
import NavButton from '../../UI/NavButton';
import classes from './BudgetHeader.module.css';

function BudgetHeader(props: { budgetId: string }) {
  // get budget Data
  const budgets = useAppSelector((state) => state.budget);
  const { title, date } = budgets[props.budgetId];

  // TODO: BudgetList 구현
  // TODO: Search 구현
  const top = (
    <>
      <button type="button">
        <i className="fa-solid fa-bars"></i>
      </button>
      <div className={classes.date}>
        <span>{getNumericDotDateString(date.start)}</span>
        <span> ~ </span>
        <span>{getNumericDotDateString(date.end)}</span>
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
      <h1>{title}</h1>
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
