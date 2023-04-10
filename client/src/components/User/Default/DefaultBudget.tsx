import classes from './DefaultBudget.module.css';
import TransactionForm from '../../Budget/Transaction/TransactionForm';
import TransactionList from '../../Budget/Transaction/TransactionList';
import NavButton from '../../UI/NavButton';
import { useLocation } from 'react-router';
import { useAppSelector } from '../../../hooks/redux-hook';

function DefaultBudget() {
    const location = useLocation();

    const from = location.state?.from?.pathname;

    const id = useAppSelector((state) => state.user.info.defaultBudgetId);
    const budgets = useAppSelector((state) => state.budget);
    const budget = budgets[id];
    const transactions = useAppSelector((state) => state.transaction.default);

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
