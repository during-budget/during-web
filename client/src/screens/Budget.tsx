import { LoaderFunctionArgs, useLoaderData } from 'react-router-dom';
import classes from './Budget.module.css';
import { getBudgetById } from '../util/api/budgetAPI';
import { getTransactions } from '../util/api/transactionAPI';
import Carousel from '../components/UI/Carousel';
import BudgetHeader from '../components/Budget/UI/BudgetHeader';
import TotalStatus from '../components/Budget/Status/TotalStatus';
import DateStatus from '../components/Budget/Status/DateStatus';
import CategoryStatus from '../components/Budget/Status/CategoryStatus';
import TransactionLayout from '../components/Budget/Transaction/TransactionLayout';
import { useEffect, useState } from 'react';
import { transactionActions } from '../store/transaction';
import CategoryPlan from '../components/Budget/Category/CategoryPlan';
import { useAppDispatch, useAppSelector } from '../hooks/redux-hook';
import Category from '../models/Category';

function Budget() {
    const dispatch = useAppDispatch();
    const loaderData = useLoaderData() as Awaited<ReturnType<typeof loader>>;

    const [categories, setCategories] = useState<Category[]>([]);

    // get budget
    const budgets = useAppSelector((state) => state.budget);
    const {
        id,
        title,
        date,
        total,
        categories: categoryObj,
    } = budgets[loaderData.id];

    // get transaction
    const transactions = useAppSelector((state) => state.transaction.data);

    useEffect(() => {
        // set categories
        setCategories(Object.values(categoryObj));

        // set transactions
        dispatch(
            transactionActions.setTransactions({
                transactions: loaderData.transactions,
                isDefault: false,
            })
        );
    }, [loaderData, categoryObj]);

    return (
        <>
            <BudgetHeader
                startDate={new Date(date.start)}
                endDate={new Date(date.end)}
                title={title}
            />
            <main>
                {/* Status */}
                <Carousel
                    id="status"
                    initialIndex={1}
                    itemClassName={classes.status}
                >
                    <DateStatus
                        title={title}
                        date={date}
                        transactions={transactions}
                    />
                    <TotalStatus budgetId={id} total={total} />
                    <CategoryStatus budgetId={id} categories={categories} />
                </Carousel>
                <hr />
                {/* Transactions */}
                <TransactionLayout
                    budgetId={id}
                    transactions={transactions}
                    date={date}
                />
                {/* Overlays */}
                <CategoryPlan
                    budgetId={id}
                    categories={categories}
                    total={{
                        expense: total.expense.planned,
                        income: total.income.planned,
                    }}
                    title={title}
                />
            </main>
        </>
    );
}

export default Budget;

export const loader = async (data: LoaderFunctionArgs) => {
    const { params } = data;

    if (!params.budgetId)
        throw new Error('Invalid params: budgetId not exists');

    const budgetData = await getBudgetById(params.budgetId);
    const transactionData = await getTransactions(params.budgetId);

    return {
        id: params.budgetId as string,
        budget: budgetData.budget,
        transactions: transactionData.transactions,
    };
};
