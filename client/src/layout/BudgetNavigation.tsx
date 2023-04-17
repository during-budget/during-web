import { Navigate } from 'react-router-dom';
import { useAppSelector } from '../hooks/redux-hook';
import Budget from '../models/Budget';
import { createBudgetFromBasic } from '../util/api/budgetAPI';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { budgetActions } from '../store/budget';

function BudgetNavigation() {
    const dispatch = useDispatch();

    const [id, setId] = useState('');
    const budgets = useAppSelector((state) => state.budget);

    useEffect(() => {
        const getId = async () => {
            const id = await getCurrentBudgetId(budgets);

            if (id) {
                setId(id);
            } else {
                const now = new Date();
                const { budget } = await createBudgetFromBasic(
                    now.getFullYear(),
                    now.getMonth() + 1
                );
                dispatch(budgetActions.setBudget(budget));
                setId(budget._id);
            }
        };
        getId();
    }, []);

    if (id) {
        return <Navigate to={`/budget/${id}`} replace={true} />;
    } else {
        return <></>;
    }
}

const getCurrentBudgetId = async (budgetObj: { [id: string]: Budget }) => {
    let id;
    const now = new Date();

    const budgets = Object.values(budgetObj);

    budgets.forEach((budget) => {
        const start = new Date(budget.date.start);
        const end = new Date(budget.date.end);
        const nextStart = new Date(end.setDate(end.getDate() + 1)); // end + 1

        const isCurrentBudget = start < now && now < nextStart;
        if (isCurrentBudget) {
            id = budget.id;
            return false;
        }
    });
    return id;
};

export default BudgetNavigation;
