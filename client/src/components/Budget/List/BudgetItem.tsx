import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import Budget from '../../../models/Budget';
import { getMonthName } from '../../../util/date';
import AmountRing from '../Amount/AmountRing';
import classes from './BudgetItem.module.css';

interface BudgetItemProps {
  budget?: Budget;
  startDate: Date;
  endDate: Date;
  closeHandler: () => void;
}

const BudgetItem = ({ budget, startDate, endDate, closeHandler }: BudgetItemProps) => {
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
  const startMonth = getMonthName(startDate, navigator.language);
  const endMonth = getMonthName(endDate, navigator.language);
  const defaultTitle =
    startMonth === endMonth ? startMonth : `${startMonth} - ${endMonth}`;
  const title = budget ? budget.title : defaultTitle;

  const dateInfo = (
    <div className={classes.info}>
      <p>{`${start} ~ ${end}`}</p>
      <h5>{title}</h5>
    </div>
  );

  // NOTE: Get dash for different font-size (match for rem)
  const mediumScreen = window.matchMedia('(max-width: 400px)');
  const smallScreen = window.matchMedia('(max-width: 350px)');
  const dash = smallScreen.matches ? 190 : mediumScreen.matches ? 220 : 250;

  const amountRing = budget && (
    <>
      <Link to={`/budget/${budget.id}`} onClick={closeHandler}>
        {/* TODO: 수입/지출 선택 */}
        <AmountRing
          amount={budget.total.expense}
          size="8rem"
          r="2.5rem"
          dash={dash}
          thickness="1.125rem"
          blur={2.6}
        />{' '}
        {dateInfo}
      </Link>
    </>
  );

  const addButton = (
    <Link
      to={`/budget/new?year=${startDate.getFullYear()}&month=${startDate.getMonth() + 1}`}
      onClick={() => {
        closeHandler();
      }}
    >
      <div className={classes.add} />
      {dateInfo}
    </Link>
  );

  return <li className={classes.item}>{budget ? amountRing : addButton}</li>;
};

export default BudgetItem;
