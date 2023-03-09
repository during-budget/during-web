import { useLoaderData } from 'react-router-dom';
import classes from './Budget.module.css';
import { getBudgetById } from '../util/api/budgetAPI';
import { getTransactions } from '../util/api/transactionAPI';
import BudgetModel from '../models/Budget';
import Carousel from '../components/UI/Carousel';
import BudgetHeader from '../components/Budget/BudgetHeader';
import TotalStatus from '../components/Status/TotalStatus';
import DateStatus from '../components/Status/DateStatus';
import CategoryStatus from '../components/Status/CategoryStatus';
import TransactionLayout from '../components/Transaction/TransactionLayout';
import TransactionModel from '../models/Transaction';

function Budget() {
    const loaderData: any = useLoaderData();

    const budget = BudgetModel.getBudgetFromData(loaderData.budget);
    const { title, date, total } = budget;

    const transactions = loaderData.transactions.map((data: any) =>
        TransactionModel.getTransactionFromData(data)
    );

    return (
        <>
            <BudgetHeader
                startDate={new Date(date.start)}
                endDate={new Date(date.end)}
                title={title}
            />
            <main>
                <Carousel
                    id="status"
                    initialIndex={1}
                    itemClassName={classes.status}
                >
                    <DateStatus
                        date={budget.date}
                        transactions={transactions}
                    />
                    <TotalStatus total={total} />
                    <CategoryStatus categories={budget.categories} />
                </Carousel>
                <hr />
                <TransactionLayout transactions={transactions} />
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
        budget: budgetData.budget,
        transactions: transactionData.transactions,
    };
};
