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
import { useEffect } from 'react';
import { transactionActions } from '../store/transaction';
import CategoryPlan from '../components/Budget/Category/CategoryPlan';
import { useAppDispatch } from '../hooks/redux-hook';
import BudgetModel from '../models/Budget';
import Transaction from '../models/Transaction';

function Budget() {
    const dispatch = useAppDispatch();
    const loaderData = useLoaderData() as Awaited<ReturnType<typeof loader>>;

    // get budget
    const {
        id,
        title,
        date,
        total,
        categories: categoryObj,
    } = loaderData.budget;

    const categories = Object.values(categoryObj);
    const transactions = loaderData.transactions;

    useEffect(() => {
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

    const { budget: budgetData, transactions: transactionData } =
        await getBudgetById(params.budgetId);

    const budget = BudgetModel.getBudgetFromData(budgetData);
    const transactions = transactionData.map((item: any) =>
        Transaction.getTransactionFromData(item)
    );

    return {
        id: params.budgetId,
        budget,
        transactions,
    };
};
