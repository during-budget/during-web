import TransactionDetail from './TransactionDetail';
import TransactionForm from './TransactionForm';
import TransactionList from './TransactionList';
import TransactionNav from './TransactionNav';

function TransactionLayout(props: { budgetId: string }) {
  return (
    <section>
      <TransactionNav id="layout" isLine={true} />
      <TransactionList />
      <TransactionForm budgetId={props.budgetId} />
      <TransactionDetail />
    </section>
  );
}

export default TransactionLayout;
