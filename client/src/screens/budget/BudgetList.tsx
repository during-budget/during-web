import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import BudgetItem from '../../components/Budget/BudgetItem';
import YearPicker from '../../components/Budget/YearPicker';
import { BUDGET_TYPE } from '../../constants/types';
import classes from './BudgetList.module.css';

function BudgetList() {
    const currentYearStr = new Date().getFullYear().toString();
    const [yearState, setYearState] = useState(currentYearStr);

    const budgets = useSelector((state: any) => state.budgets);

    console.log(budgets);

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

export default BudgetList;
