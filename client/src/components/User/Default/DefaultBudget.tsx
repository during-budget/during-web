import classes from './DefaultBudget.module.css';
import TransactionForm from '../../Budget/Transaction/TransactionForm';
import TransactionList from '../../Budget/Transaction/TransactionList';
import { useSelector } from 'react-redux';
import NavButton from '../../UI/NavButton';
import { useLocation } from 'react-router';

function DefaultBudget() {
    const location = useLocation();

    const from = location.state?.from?.pathname;

    const id = useSelector((state: any) => state.user.DefaultBudgetId);
    const budget = useSelector((state: any) => state.budget.default);
    const transactions = useSelector((state: any) => state.transaction.default);

    return (
        <main className={classes.container}>
            <NavButton
                className={classes.back}
                to={from || '/user'}
                isNext={false}
            />
            <section></section>
            <hr />
            <section>
                <TransactionList transactions={transactions} />
                <TransactionForm budgetId={id} isDefault={true} />
            </section>
        </main>
    );
}

export default DefaultBudget;
