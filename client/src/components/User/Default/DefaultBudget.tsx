import { useEffect } from 'react';
import { useLoaderData, useLocation } from 'react-router';
import { useAppDispatch, useAppSelector } from '../../../hooks/redux-hook';
import { loader as BudgetLoader } from '../../../screens/Budget';
import { transactionActions } from '../../../store/transaction';
import CategoryPlan from '../../Budget/Category/CategoryPlan';
import TransactionDetail from '../../Budget/Transaction/TransactionDetail';
import TransactionForm from '../../Budget/Transaction/TransactionForm';
import TransactionList from '../../Budget/Transaction/TransactionList';
import NavButton from '../../UI/NavButton';
import classes from './DefaultBudget.module.css';
import DefaultStatus from './DefaultStatus';

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
        title,
        total,
        categories: categoryObj,
    } = budgets[loaderData.budget._id];

    const categories = Object.values(categoryObj);

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
            <section className={classes.status}>
                <h1>{title}</h1>
                <DefaultStatus
                    budgetId={id}
                    total={total}
                    categories={categories}
                />
            </section>
            <hr />
            <section className={classes.transactions}>
                <TransactionList isDefault={true} />
                <TransactionForm budgetId={id} isDefault={true} />
                <TransactionDetail isDefault={true} />
            </section>
            {/* Overlay */}
            <CategoryPlan
                budgetId={id}
                categories={categories}
                total={{
                    expense: total.expense.planned,
                    income: total.income.planned,
                }}
                title={title}
                isDefault={true}
            />
        </main>
    );
}

export default DefaultBudget;
