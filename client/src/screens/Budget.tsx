import { LoaderFunctionArgs, useLoaderData } from 'react-router-dom';
import classes from './Budget.module.css';
import { getBudgetById } from '../util/api/budgetAPI';
import Carousel from '../components/UI/Carousel';
import BudgetHeader from '../components/Budget/UI/BudgetHeader';
import TotalStatus from '../components/Budget/Status/TotalStatus';
import DateStatus from '../components/Budget/Status/DateStatus';
import CategoryStatus from '../components/Budget/Status/CategoryStatus';
import TransactionLayout from '../components/Budget/Transaction/TransactionLayout';
import { useEffect } from 'react';
import { transactionActions } from '../store/transaction';
import CategoryPlan from '../components/Budget/Category/CategoryPlan';
import { useAppDispatch, useAppSelector } from '../hooks/redux-hook';

function Budget() {
    const dispatch = useAppDispatch();

    const loaderData = useLoaderData() as Awaited<ReturnType<typeof loader>>;

    const budgets = useAppSelector((state) => state.budget);

    // get budget
    const {
        id,
        title,
        date,
        total,
        categories: categoryObj,
    } = budgets[loaderData.budget._id];

    // TODO: Budget 객체가 첫 로드 한번만 실행됨 보장할 것.
    const categories = Object.values(categoryObj);

    useEffect(() => {
        // set transactions
        dispatch(transactionActions.setTransactions(loaderData.transactions));
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
                    <DateStatus title={title} date={date} />
                    <TotalStatus budgetId={id} total={total} />
                    <CategoryStatus budgetId={id} categories={categories} />
                </Carousel>
                <hr />
                {/* Transactions */}
                <TransactionLayout budgetId={id} date={date} />
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

    //     const { budget: budgetData, transactions: transactionData } =
    //         await getBudgetById(params.budgetId);
    // const id = params.budgetId;
    //     const budget = BudgetModel.getBudgetFromData(budgetData);
    //     const transactions = transactionData.map((item: any) =>
    //         Transaction.getTransactionFromData(item)
    //     );

    //     return {
    //         id,
    //         data: await getBudgetById(params.budgetId);
    //     };
    return getBudgetById(params.budgetId);
};
