import { useDispatch } from 'react-redux';
import { Navigate, useLoaderData } from 'react-router-dom';
import { budgetActions } from '../store/budget';
import { BudgetDataType, getBudgetByMonth } from '../util/api/budgetAPI';
import { getCurrentYearMonth } from '../util/date';
import { getErrorMessage } from '../util/error';

function CurrentBudgetNavigator() {
  const dispatch = useDispatch();

  const data = useLoaderData() as Awaited<ReturnType<typeof loader>>;
  const budget = data?.budget;

  if (budget) {
    dispatch(budgetActions.setCurrentBudget(budget));
    return <Navigate to={`/budget/${budget._id}`} replace={true} />;
  } else {
    const { year, month } = getCurrentYearMonth();
    return <Navigate to={`/budget/new?year=${year}&month=${month}`} replace={true} />;
  }
}

export const loader = async () => {
  const { year, month } = getCurrentYearMonth();
  let data: {
    budget: BudgetDataType;
  } | null;
  try {
    data = await getBudgetByMonth(year, month);
  } catch (error) {
    const message = getErrorMessage(error);
    if (message === null || message === 'BUDGET_NOT_FOUND') {
      data = null;
    } else {
      throw error;
    }
  }
  return data;
};

export default CurrentBudgetNavigator;
