import { useSelector } from 'react-redux';
import { useLoaderData } from 'react-router-dom';
import BudgetHeader from '../components/Budget/BudgetHeader';
import { getBudgetById } from '../util/api/budgetAPI';
import BudgetModel from '../models/Budget';

function Budget() {
    const loaderData: any = useLoaderData();
    const budgets = useSelector((state: any) => state.budgets);

    const budget = BudgetModel.getBudgetFromData(loaderData.budget);

    return (
        <>
            <BudgetHeader
                startDate={new Date(budget.date.start)}
                endDate={new Date(budget.date.end)}
                title={budget.title}
            />
        </>
    );
}

export default Budget;

export const loader = async (data: any) => {
    const { params } = data;

    const budgetData = await getBudgetById(params.budgetId);

    return {
        budget: budgetData.budget,
    };
};
