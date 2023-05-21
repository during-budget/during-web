import CurrentTab from '../UI/CurrentTab';
import ExpenseTab from '../UI/ExpenseTab';
import classes from './TransactionNav.module.css';

interface TransactionNavProps {
  id: string;
  isAll?: boolean;
  disabled?: boolean;
}

const TransactionNav = ({ id, isAll, disabled }: TransactionNavProps) => {
  return (
    <div className={classes.transactionNav}>
      <CurrentTab id={`${id}_current`} disabled={disabled} />
      <span>|</span>
      <ExpenseTab id={`${id}_expense`} isAll={isAll} disabled={disabled} />
    </div>
  );
};

export default TransactionNav;
