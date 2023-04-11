import classes from './DefaultBudget.module.css';
import TransactionForm from '../../Budget/Transaction/TransactionForm';
import TransactionList from '../../Budget/Transaction/TransactionList';
import NavButton from '../../UI/NavButton';
import { useLoaderData, useLocation } from 'react-router';
import { useAppDispatch, useAppSelector } from '../../../hooks/redux-hook';
import { loader as BudgetLoader } from '../../../screens/Budget';
import { useEffect } from 'react';
import { transactionActions } from '../../../store/transaction';

function DefaultBudget() {
    const location = useLocation();
    const dispatch = useAppDispatch();

    const from = location.state?.from?.pathname;

    const loaderData = useLoaderData() as Awaited<
        ReturnType<typeof BudgetLoader>
    >;

    const budgets = useAppSelector((state) => state.budget);

    // get budget
    const {
        id,
        total,
        categories: categoryObj,
    } = budgets[loaderData.budget._id];

    const { expense, income } = total;

    const expenseAmount = expense.scheduled;
    const incomeAmount = income.scheduled;

    //  set transactions
    useEffect(() => {
        dispatch(transactionActions.setTransactions(loaderData.transactions));
    }, [loaderData, categoryObj]);

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
                <TransactionList isDefault={true} />
                <TransactionForm budgetId={id} isDefault={true} />
            </section>
        </main>
    );
}

export default DefaultBudget;
