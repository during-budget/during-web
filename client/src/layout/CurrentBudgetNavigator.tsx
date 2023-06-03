import { useDispatch } from 'react-redux';
import { Navigate, useLoaderData } from 'react-router-dom';
import { budgetActions } from '../store/budget';
import { BudgetDataType, getBudgetByMonth } from '../util/api/budgetAPI';
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
    if (message === null) {
      data = null;
    } else {
      throw error;
    }
  }
  return data;
};

const getCurrentYearMonth = () => {
  const now = new Date();

  const year = now.getFullYear();
  const month = now.getMonth() + 1;

  return { year, month };
};

export default CurrentBudgetNavigator;
