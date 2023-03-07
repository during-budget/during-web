import { useDispatch } from 'react-redux';
import { Navigate, useLoaderData } from 'react-router-dom';
import { budgetActions } from '../store/budget';
import { getBudgetList } from '../util/api/budgetAPI';

function BudgetNavigation() {
    const dispatch = useDispatch();
    const loaderData: any = useLoaderData();
    dispatch(budgetActions.setBudgets(loaderData.budgets.budgets));

    return <Navigate to={`/budget/${loaderData.id}`} replace={true} />;
}

export const loader = async () => {
    const budgets: any = await getBudgetList();
    const id = getCurrentBudgetId(budgets);

    return {
        budgets,
        id,
    };
};

const getCurrentBudgetId = (data: any) => {
    const now = new Date();

    let id = 'new';
    data.budgets.forEach((budget: any) => {
        const start = new Date(budget.startDate);
        const end = new Date(budget.endDate);
        const isCurrentBudget = start < now && now < end;
        if (isCurrentBudget) {
            id = budget._id;
            return false;
        }
    });

    return id;
};

export default BudgetNavigation;
