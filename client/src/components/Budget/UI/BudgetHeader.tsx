import { useLocation } from 'react-router';
import { useAppSelector } from '../../../hooks/redux-hook';
import { getNumericDotDateString } from '../../../util/date';
import NavButton from '../../UI/NavButton';
import classes from './BudgetHeader.module.css';

function BudgetHeader(props: { budgetId: string; isDefault?: boolean }) {
  const { budgetId, isDefault } = props;

  // get budget Data
  const budgets = useAppSelector((state) => state.budget);
  const { title, date } = budgets[budgetId];

  // get location
  const location = useLocation();
  const from = location.state?.from?.pathname;

  // set button
  const defaultButton = (
    <NavButton className={classes.back} to={from || '/user'} isNext={false} />
  );

  // TODO: BudgetList 구현
  const hamburgerButton = (
    <button type="button">
      <i className="fa-solid fa-bars"></i>
    </button>
  );

  // title
  const defaultHeader = <span>매월 반복</span>;
  const dateHeader = (
    <>
      <span>{getNumericDotDateString(date.start)}</span>
      <span>{getNumericDotDateString(date.end)}</span>
      <span> ~ </span>
    </>
  );

  const top = (
    <>
      {isDefault ? defaultButton : hamburgerButton}
      <div className={classes.date}>{isDefault ? defaultHeader : dateHeader}</div>
      {/* TODO: Search 구현 */}
      <button type="button">
        <i className="fa-solid fa-magnifying-glass"></i>
      </button>
    </>
  );

  // TODO: 이전/이후 budget id 가져오기 - 이동 구현
  const bottom = isDefault ? (
    <h1>{title}</h1>
  ) : (
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
