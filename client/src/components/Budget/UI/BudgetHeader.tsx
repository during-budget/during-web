import dayjs from 'dayjs';
import { useDispatch } from 'react-redux';
import { useLocation } from 'react-router';
import { useAppSelector } from '../../../hooks/redux-hook';
import { uiActions } from '../../../store/ui';
import { getMonthName, getNumericDotDateString } from '../../../util/date';
import NavButton from '../../UI/NavButton';
import classes from './BudgetHeader.module.css';
import BudgetNav from './BudgetNav';

interface BudgetHeaderProps {
  newDate?: { start: Date; end: Date };
  isDefault?: boolean;
}

function BudgetHeader({ newDate, isDefault }: BudgetHeaderProps) {
  const dispatch = useDispatch();

  // get budget Data
  const { title, date } = useAppSelector((state) => state.budget.current);

  // get location
  const locationState = useLocation().state?.from;
  const prevPath = locationState
    ? locationState.pathname + locationState.search
    : undefined;

  // for budget list
  const openBudgetList = () => {
    dispatch(uiActions.showBudgetList(true));
  };

  const closeBudgetList = () => {
    dispatch(uiActions.showBudgetList(false));
  };

  // set button
  const defaultButton = (
    <NavButton className={classes.back} to={prevPath || '/user'} isNext={false} />
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
      <span>{getNumericDotDateString(newDate ? newDate.start : date.start)}</span>
      <span> ~ </span>
      <span>{getNumericDotDateString(newDate ? newDate.end : date.end)}</span>
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

  const prevDate = dayjs(newDate ? newDate.start : date.start).add(-1, 'month');
  const nextDate = dayjs(newDate ? newDate.end : date.end).add(1, 'month');

  const bottom = isDefault ? (
    <h1 onClick={openBudgetList}>{title}</h1>
  ) : (
    <BudgetNav
      title={newDate ? getMonthName(newDate.start, 'ko-KR') : title}
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
