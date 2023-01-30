import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import BudgetItem from '../../components/Budget/BudgetItem';
import YearPicker from '../../components/Budget/YearPicker';
import classes from './BudgetList.module.css';
import { getBudgetList } from '../../util/api';
import { useLoaderData } from 'react-router-dom';
import { budgetActions } from '../../store/budget';
import Budget from '../../models/Budget';

const startDay = 1;
const endDay = startDay - 1;

function BudgetList() {
    const dispatch = useDispatch();
    const currentYearStr = new Date().getFullYear().toString();
    const [yearState, setYearState] = useState(currentYearStr);

    const loaderData: any = useLoaderData();
    const budgets = useSelector((state: any) => state.budgets).filter(
        (budget: Budget) => {
            const startYear = new Date(budget.startDate).getFullYear();
            const endYear = new Date(budget.endDate).getFullYear();
            return startYear >= +yearState && endYear <= +yearState;
        }
    );

    useEffect(() => {
        dispatch(budgetActions.setBudgets(loaderData.budgets));
    }, [loaderData.budgets, dispatch]);

    return (
        <div className={classes.container}>
            <YearPicker
                fontSize="2.5rem"
                onSelect={(value: string) => {
                    setYearState(value);
                }}
            />
            <ol>
                {Array(12)
                    .fill(0)
                    .map((_, month: number) => {
                        const startDate = new Date(+yearState, month, startDay);
                        const endDate = new Date(
                            +yearState,
                            endDay ? month : month + 1,
                            endDay
                        );
                        const budget = budgets.find(
                            (item: Budget) =>
                                item.startDate.toLocaleDateString() ===
                                    startDate.toLocaleDateString() &&
                                item.endDate.toLocaleDateString() ===
                                    endDate.toLocaleDateString()
                        );
                        return (
                            <BudgetItem
                                key={month}
                                startDate={startDate}
                                endDate={endDate}
                                budget={budget}
                            />
                        );
                    })}
            </ol>
        </div>
    );
}

export const loader = () => {
    return getBudgetList();
};

export default BudgetList;
