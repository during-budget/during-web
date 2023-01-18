import { useState } from 'react';
import { useSelector } from 'react-redux';
import BudgetItem from '../../components/Budget/BudgetItem';
import { BUDGET_TYPE } from '../../constants/types';
import classes from './BudgetList.module.css';

function BudgetList() {
    const [isRepeating, setIsRepeating] = useState(true);

    const changeTabHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        setIsRepeating((prev) => !prev);
    };

    const budgets = useSelector((state: any) => state.budgets);

    const filteredBudget = budgets.filter((budget: any) =>
        isRepeating ? budget.isRepeating : !budget.isRepeating
    );

    return (
        <div className="page">
            <h2>나의 예산</h2>
            <div className={classes['radio-controls']}>
                <input
                    id="repeating-select"
                    type="radio"
                    name="budget-type"
                    value={BUDGET_TYPE.REPEATING}
                    onChange={changeTabHandler}
                    checked={isRepeating}
                />
                <label htmlFor="repeating-select">반복예산</label>
                <input
                    id="event-select"
                    type="radio"
                    name="budget-type"
                    value={BUDGET_TYPE.EVENT}
                    onChange={changeTabHandler}
                    checked={!isRepeating}
                />
                <label htmlFor="event-select">특별예산</label>
            </div>
            <ol>
                {filteredBudget.map((budget: any, i: number) => {
                    const { id, startDate, endDate, total } = budget;
                    return (
                        <BudgetItem
                            key={i}
                            id={id}
                            startDate={startDate}
                            endDate={endDate}
                            amount={total}
                        />
                    );
                })}
            </ol>
            <a
                href={`/budget/form?type=${
                    isRepeating ? BUDGET_TYPE.REPEATING : BUDGET_TYPE.EVENT
                }`}
                className={`button__primary ${classes.button}`}
            >
                {isRepeating ? '예산 설정하기' : '예산 추가하기'}
            </a>
        </div>
    );
}

export default BudgetList;
