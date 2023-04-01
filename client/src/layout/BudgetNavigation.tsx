import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

function BudgetNavigation() {
    const budgets = useSelector((state: any) => state.budget);
    const id = getCurrentBudgetId(budgets);

    return <Navigate to={`/budget/${id}`} replace={true} />;
}

const getCurrentBudgetId = (budgets: any) => {
    const now = new Date();

    let id = 'new';
    budgets.forEach((budget: any) => {
        const start = new Date(budget.date.start);
        const end = new Date(budget.date.end);
        const nextStart = new Date(end.setDate(end.getDate() + 1)); // end + 1

        const isCurrentBudget = start < now && now < nextStart;
        if (isCurrentBudget) {
            id = budget._id;
            return false;
        }
    });

    return id;
};

export default BudgetNavigation;
