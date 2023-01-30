import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import BudgetItem from '../../components/Budget/BudgetItem';
import YearPicker from '../../components/Budget/YearPicker';
import { BUDGET_TYPE } from '../../constants/types';
import classes from './BudgetList.module.css';
import { getBudgetData } from '../../util/api';
import { useLoaderData } from 'react-router-dom';
import { budgetActions } from '../../store/budget';

function BudgetList() {
    const dispatch = useDispatch();
    const currentYearStr = new Date().getFullYear().toString();
    const [yearState, setYearState] = useState(currentYearStr);

    const loaderData: any = useLoaderData();
    const budgets = useSelector((state: any) => state.budgets);

    useEffect(() => {
        dispatch(budgetActions.setBudgets(loaderData.budgets));
    }, [loaderData.budgets, dispatch]);

    console.log('hello', budgets);

    return (
        <div className={classes.container}>
            <YearPicker
                fontSize="2.5rem"
                onSelect={(value: string) => {
                    setYearState(value);
                }}
            />
        </div>
    );
}

export const loader = () => {
    return getBudgetData();
};

export default BudgetList;
