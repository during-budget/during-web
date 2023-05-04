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

      if (!budget) {
        navigateToNewBudget(year, month);
      } else {
        navigate(`/budget/${budget._id}`);
      }
    } catch (e) {
      if ((e as Response).status === 404) {
        navigateToNewBudget(year, month);
      } else {
        throwError(e);
      }
    }
  };

  const navigateToNewBudget = (year: number, month: number) => {
    navigate(`/budget/new?year=${year}&month=${month - 1}`);
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
