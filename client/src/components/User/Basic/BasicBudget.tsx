import classes from './BasicBudget.module.css';
import TransactionForm from '../../Budget/Transaction/TransactionForm';
import TransactionList from '../../Budget/Transaction/TransactionList';
import { useSelector } from 'react-redux';

function BasicBudget() {
    const id = useSelector((state: any) => state.user.basicBudgetId);

    return (
        <main className={classes.container}>
            <section></section>
            <hr />
            <section>
                <TransactionList transactions={[]} />
                <TransactionForm budgetId={id} isBasic={true} />
            </section>
        </main>
    );
}

export default BasicBudget;
