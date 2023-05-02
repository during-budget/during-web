import { useDispatch } from 'react-redux';
import { Navigate, useLoaderData } from 'react-router-dom';
import { budgetActions } from '../store/budget';
import { getBudgetByMonth } from '../util/api/budgetAPI';

function CurrentBudgetNavigator() {
  const dispatch = useDispatch();

  const { budget } = useLoaderData() as Awaited<ReturnType<typeof loader>>;

  if (!budget) {
  }
  dispatch(budgetActions.setCurrentBudget(budget));

  if (budget) {
    return <Navigate to={`/budget/${budget._id}`} replace={true} />;
  } else {
    throw Error('Budget not exists:', budget);
    // TODO: /budget/new로 이동하기 - id가 new인 경우를 처리! (같은 Budget 스크린 컴포넌트여야 깜빡임 없을 듯~)
  }
}

export const loader = async () => {
  const now = new Date();

  const year = now.getFullYear();
  const month = now.getMonth() + 1;

  return getBudgetByMonth(year, month);
};

export default CurrentBudgetNavigator;
