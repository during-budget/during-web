import classes from './BasicBudget.module.css';
import TransactionForm from '../../Budget/Transaction/TransactionForm';
import TransactionList from '../../Budget/Transaction/TransactionList';
import { useSelector } from 'react-redux';
import NavButton from '../../UI/NavButton';
import { useLocation } from 'react-router';

function BasicBudget() {
    const location = useLocation();

    const from = location.state?.from?.pathname;

    const id = useSelector((state: any) => state.user.basicBudgetId);
    const budget = useSelector((state: any) => state.basic.budget);
    const transactions = useSelector((state: any) => state.basic.transactions);

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
                <TransactionForm budgetId={id} isBasic={true} />
            </section>
        </main>
    );
}

export default BasicBudget;
