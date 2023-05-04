import { useDispatch } from 'react-redux';
import { Navigate, useLoaderData, useSearchParams } from 'react-router-dom';
import { budgetActions } from '../store/budget';
import { getBudgetByMonth } from '../util/api/budgetAPI';

function CurrentBudgetNavigator() {
  const dispatch = useDispatch();

  const { budget } = useLoaderData() as Awaited<ReturnType<typeof loader>>;

  budget && dispatch(budgetActions.setCurrentBudget(budget));

  const { year, month } = getCurrentYearMonth();

  const path = budget
    ? `/budget/${budget._id}`
    : `/budget/new?year=${year}&month=${month}`;
  return <Navigate to={path} replace={true} />;
}

export const loader = async () => {
  const { year, month } = getCurrentYearMonth();
  return getBudgetByMonth(year, month);
};

const getCurrentYearMonth = () => {
  const now = new Date();

  const year = now.getFullYear();
  const month = now.getMonth() + 1;

  return { year, month };
};

export default CurrentBudgetNavigator;
