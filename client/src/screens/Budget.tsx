import { useLoaderData } from 'react-router-dom';
import classes from './Budget.module.css';
import { getBudgetById } from '../util/api/budgetAPI';
import { getTransactions } from '../util/api/transactionAPI';
import BudgetModel from '../models/Budget';
import Carousel from '../components/UI/Carousel';
import BudgetHeader from '../components/Budget/UI/BudgetHeader';
import TotalStatus from '../components/Budget/Status/TotalStatus';
import DateStatus from '../components/Budget/Status/DateStatus';
import CategoryStatus from '../components/Budget/Status/CategoryStatus';
import TransactionLayout from '../components/Budget/Transaction/TransactionLayout';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { transactionActions } from '../store/transaction';
import CategoryPlan from '../components/Budget/Category/CategoryPlan';

function Budget() {
    const dispatch = useDispatch();
    const loaderData: any = useLoaderData();

    let budget, transactions;

    // get budget
    const budgets = useSelector((state: any) => state.budget);
    budget = budgets.find((item: BudgetModel) => item.id === loaderData.id);

    if (!budget) {
        budget = BudgetModel.getBudgetFromData(loaderData.budget);
    }

    const { id, title, date, total, categories } = budget;

    // get transaction
    transactions = useSelector((state: any) => state.transaction.data);

    // set transaction
    useEffect(() => {
        dispatch(transactionActions.setTransaction(loaderData.transactions));
    }, []);

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
                <TransactionLayout budgetId={id} transactions={transactions} />
                {/* Overlays */}
                <CategoryPlan />
            </main>
        </>
    );
}

export default Budget;

export const loader = async (data: any) => {
    const { params } = data;

    const budgetData = await getBudgetById(params.budgetId);
    const transactionData = await getTransactions(params.budgetId);

    return {
        id: params.budgetId,
        budget: budgetData.budget,
        transactions: transactionData.transactions,
    };
};
