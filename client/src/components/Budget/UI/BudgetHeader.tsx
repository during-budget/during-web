import dayjs from 'dayjs';
import { useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router';
import { useAppSelector } from '../../../hooks/redux-hook';
import { uiActions } from '../../../store/ui';
import { deleteBudget } from '../../../util/api/budgetAPI';
import { getMonthName, getNumericDotDateString } from '../../../util/date';
import NavButton from '../../UI/NavButton';
import OptionButton from '../../UI/OptionButton';
import classes from './BudgetHeader.module.css';
import BudgetNav from './BudgetNav';

interface BudgetHeaderProps {
  budgetId: string;
  newDate?: { start: Date; end: Date };
  isDefault?: boolean;
}

function BudgetHeader({ budgetId, newDate, isDefault }: BudgetHeaderProps) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

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
    <button className={classes.calendar} type="button" onClick={openBudgetList}>
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
      <OptionButton
        className={classes.option}
        menu={[
          {
            name: '예산 삭제하기',
            action: () => {
              dispatch(
                uiActions.showModal({
                  title: '정말 삭제하시겠습니까?',
                  description: '예산 내의 모든 내역이 삭제됩니다.',
                  onConfirm: () => {
                    deleteBudget(budgetId);
                    navigate('/');
                  },
                })
              );
            },
          },
        ]}
      />
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
