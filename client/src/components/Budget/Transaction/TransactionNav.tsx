import CurrentTab from '../UI/CurrentTab';
import ExpenseTab from '../UI/ExpenseTab';

interface TransactionNavProps {
  id: string;
  showCurrent?: boolean;
  showAll?: boolean;
  disabled?: boolean;
}

const TransactionNav = ({ id, showCurrent, showAll, disabled }: TransactionNavProps) => {
  return (
    <div className="flex j-center">
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
