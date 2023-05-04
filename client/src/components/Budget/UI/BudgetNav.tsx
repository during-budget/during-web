import { useNavigate } from 'react-router';
import { getBudgetByMonth } from '../../../util/api/budgetAPI';
import { throwError } from '../../../util/error';
import NavButton from '../../UI/NavButton';

interface BudgetNavProps {
  title: string;
  start: { year: number; month: number };
  end: { year: number; month: number };
}

const BudgetNav = ({ title, start, end }: BudgetNavProps) => {
  const navigate = useNavigate();

  const setBudget = async ({ year, month }: { year: number; month: number }) => {
    try {
      const { budget } = await getBudgetByMonth(year, month);

      // TODO: /budget/new로 이동하기 - id가 new인 경우를 처리! (같은 Budget 스크린 컴포넌트여야 깜빡임 없을 듯~)
      if (!budget) throw Error('Budget not exists:', budget);
      navigate(`/budget/${budget._id}`);
    } catch (e) {
      throwError(e);
    }
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
