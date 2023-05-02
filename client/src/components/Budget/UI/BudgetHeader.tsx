import dayjs from 'dayjs';
import { useDispatch } from 'react-redux';
import { useLocation } from 'react-router';
import { useAppSelector } from '../../../hooks/redux-hook';
import { uiActions } from '../../../store/ui';
import { getNumericDotDateString } from '../../../util/date';
import NavButton from '../../UI/NavButton';
import classes from './BudgetHeader.module.css';
import BudgetNav from './BudgetNav';

function BudgetHeader(props: { budgetId: string; isDefault?: boolean }) {
  const dispatch = useDispatch();

  const { isDefault } = props;

  // get budget Data
  const { title, date } = useAppSelector((state) => state.budget.current);

  // get location
  const location = useLocation();
  const from = location.state?.from?.pathname;

  // for budget list
  const openBudgetList = () => {
    dispatch(uiActions.showBudgetList(true));
  };

  const closeBudgetList = () => {
    dispatch(uiActions.showBudgetList(false));
  };

  // set button
  const defaultButton = (
    <NavButton className={classes.back} to={from || '/user'} isNext={false} />
  );

  const calendarButton = (
    <button type="button" onClick={openBudgetList}>
      <i className="fa-regular fa-calendar"></i>
    </button>
  );

  // title
  const defaultHeader = <span>매월 반복</span>;
  const dateHeader = (
    <>
      <span>{getNumericDotDateString(date.start)}</span>
      <span> ~ </span>
      <span>{getNumericDotDateString(date.end)}</span>
    </>
  );

  const top = (
    <>
      {isDefault ? defaultButton : calendarButton}
      <div className={classes.date} onClick={openBudgetList}>
        {isDefault ? defaultHeader : dateHeader}
      </div>
      {/* TODO: Search 구현 */}
      <button type="button">
        <i className="fa-solid fa-magnifying-glass"></i>
      </button>
    </>
  );

  const prevDate = dayjs(date.start).add(-1, 'month');
  const nextDate = dayjs(date.start).add(1, 'month');

  const bottom = isDefault ? (
    <h1 onClick={openBudgetList}>{title}</h1>
  ) : (
    <BudgetNav
      title={title}
      start={{ year: prevDate.year(), month: prevDate.month() + 1 }}
      end={{ year: nextDate.year(), month: nextDate.month() + 1 }}
    />
  );

  return (
    <>
      <header className={classes.header}>
        <div className={classes.top}>{top}</div>
        <div className={classes.bottom}>{bottom}</div>
      </header>
    </>
  );
}

export default BudgetHeader;
