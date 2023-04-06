import Transaction from '../../../models/Transaction';
import TransactionDetail from './TransactionDetail';
import TransactionForm from './TransactionForm';
import TransactionList from './TransactionList';
import TransactionNav from './TransactionNav';

function TransactionLayout(props: {
    budgetId: string;
    date: { start: Date; end: Date };
    transactions: Transaction[];
}) {
    return (
        <section>
            <TransactionNav id="layout" isLine={true} />
            <TransactionList transactions={props.transactions} />
            <TransactionForm budgetId={props.budgetId} date={props.date} />
            <TransactionDetail />
        </section>
    );
}

export default TransactionLayout;
