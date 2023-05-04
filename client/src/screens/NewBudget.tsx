import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { useNavigate, useSearchParams } from 'react-router-dom';
import BudgetList from '../components/Budget/List/BudgetList';
import TotalStatus from '../components/Budget/Status/TotalStatus';
import BudgetHeader from '../components/Budget/UI/BudgetHeader';
import Carousel from '../components/UI/Carousel';
import { createBudgetFromBasic } from '../util/api/budgetAPI';
import classes from './Budget.module.css';

dayjs.extend(customParseFormat);

function NewBudget() {
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();
  const yearStr = searchParams.get('year');
  const monthStr = searchParams.get('month');

  if (!yearStr || !monthStr) {
    throw new Error('Year or month parm is empty');
  }

  const startDate = new Date(+yearStr, +monthStr, 1);
  const endDate = dayjs(startDate).endOf('month').toDate();

  const createNewBudget = async () => {
    const { budget } = await createBudgetFromBasic(+yearStr, +monthStr);
    navigate(`/budget/${budget._id}`);
  };

  return (
    <>
      <BudgetHeader newDate={{ start: startDate, end: endDate }} />
      <main>
        {/* Status */}
        <Carousel id="status" initialIndex={0} itemClassName={classes.status}>
          <TotalStatus />
        </Carousel>
        {/* Overlays */}
        <BudgetList />
      </main>
    </>
  );
}

export default NewBudget;
