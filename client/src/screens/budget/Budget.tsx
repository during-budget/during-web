import classes from './Budget.module.css';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import BudgetHeader from '../../components/Budget/BudgetHeader';
import TransactionLayout from '../../components/Transaction/TransactionLayout';
import React from 'react';
import Carousel from '../../components/UI/Carousel';
import DateStatus from '../../components/Status/DateStatus';
import TotalStatus from '../../components/Status/TotalStatus';
import CategoryStatus from '../../components/Status/CategoryStatus';

function Budget() {
    const { budgetId } = useParams();
    const budgets = useSelector((state: any) => state.budgets);
    const budget = budgets.find((item: any) => item.id === budgetId);

    if (!budget) {
        throw new Error("Budget doesn`'t exists");
    }

    const { startDate, endDate, title, total } = budget;

    return (
        <>
            <BudgetHeader
                startDate={startDate}
                endDate={endDate}
                title={title}
            />
            <main className={classes.container}>
                <Carousel id="status" initialIndex={1}>
                    <DateStatus
                        budgetId={budgetId!}
                        startDate={startDate}
                        endDate={endDate}
                    />
                    <TotalStatus budgetId={budgetId!} amount={total} />
                    <CategoryStatus budgetId={budgetId!} />
                </Carousel>
                <hr />
                <TransactionLayout budgetId={budget.id} />
            </main>
        </>
    );
}

export default Budget;
