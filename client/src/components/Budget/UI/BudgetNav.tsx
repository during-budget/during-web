import { useNavigate } from 'react-router';
import { useAppDispatch } from '../../../hooks/redux-hook';
import { uiActions } from '../../../store/ui';
import { getBudgetByMonth } from '../../../util/api/budgetAPI';
import { getErrorMessage } from '../../../util/error';
import NavButton from '../../UI/NavButton';

interface BudgetNavProps {
  title: string;
  start: { year: number; month: number };
  end: { year: number; month: number };
}

const BudgetNav = ({ title, start, end }: BudgetNavProps) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const setBudget = async ({ year, month }: { year: number; month: number }) => {
    try {
      const { budget } = await getBudgetByMonth(year, month);

      if (!budget) {
        navigateToNewBudget(year, month);
      } else {
        navigate(`/budget/${budget._id}`);
      }
    } catch (error) {
      const message = getErrorMessage(error);
      if (message === null) {
        navigateToNewBudget(year, month);
      } else {
        dispatch(
          uiActions.showErrorModal({
            description:
              message || `${year}년 ${month}월 예산 조회 중 문제가 발생했습니다.`,
          })
        );
        throw error;
      }
    }
  };

  const navigateToNewBudget = (year: number, month: number) => {
    navigate(`/budget/new?year=${year}&month=${month}`);
  };

  return (
    <>
      <NavButton
        onClick={() => {
          setBudget(start);
        }}
        isNext={false}
      />
      <h1>{title}</h1>
      <NavButton
        onClick={() => {
          setBudget(end);
        }}
        isNext={true}
      />
    </>
  );
};

export default BudgetNav;
