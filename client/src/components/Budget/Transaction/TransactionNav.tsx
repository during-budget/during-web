import CurrentTab from '../UI/CurrentTab';
import ExpenseTab from '../UI/ExpenseTab';
import classes from './TransactionNav.module.css';

interface TransactionNavProps {
  id: string;
  showCurrent?: boolean;
  showAll?: boolean;
  disabled?: boolean;
}

const TransactionNav = ({ id, showCurrent, showAll, disabled }: TransactionNavProps) => {
  return (
    <div className={classes.transactionNav}>
      {showCurrent && (
        <>
          <CurrentTab id={`${id}_current`} disabled={disabled} />
          <span>|</span>
        </>
      )}
      <ExpenseTab
        id={`${id}_expense`}
        showAll={showAll}
        disabled={disabled}
        showLine={!showCurrent}
      />
    </div>
  );
};

export default TransactionNav;
