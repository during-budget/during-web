import TransactionDetail from './TransactionDetail';
import TransactionForm from './TransactionForm';
import TransactionList from './TransactionList';
import TransactionNav from './TransactionNav';

function TransactionLayout(props: { budgetId: string; isDefault?: boolean }) {
  const { budgetId, isDefault } = props;

  return (
    <section>
      {!isDefault && <TransactionNav id="layout" isLine={true} />}
      <TransactionList isDefault={isDefault} />
      <TransactionForm budgetId={budgetId} isDefaultBudget={isDefault} />
      <TransactionDetail isDefaultBudget={isDefault} />
    </section>
  );
}

export default TransactionLayout;
