import { Navigate } from 'react-router-dom';
import { useAppSelector } from '../hooks/redux-hook';
import Budget from '../models/Budget';

function BudgetNavigation() {
    const budgets = useAppSelector((state) => state.budget);
    const id = getCurrentBudgetId(budgets);

    return <Navigate to={`/budget/${id}`} replace={true} />;
}

const getCurrentBudgetId = (budgetObj: { [id: string]: Budget }) => {
    let id = 'new';
    const now = new Date();

    const budgets = Object.values(budgetObj);

    budgets.forEach((budget) => {
        const start = new Date(budget.date.start);
        const end = new Date(budget.date.end);
        const nextStart = new Date(end.setDate(end.getDate() + 1)); // end + 1

        const isCurrentBudget = start < now && now < nextStart;
        if (isCurrentBudget) {
            id = budget.id; // TODO: 원래 _id로 접근해서 잘 돌아가던 코드..... 문제가 있는지 확인 필요
            return false;
        }
    });

    return id;
};

export default BudgetNavigation;
