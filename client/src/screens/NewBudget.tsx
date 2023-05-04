import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import {
  Link,
  LoaderFunctionArgs,
  useLoaderData,
  useLocation,
  useNavigate,
  useSearchParams,
} from 'react-router-dom';
import BudgetList from '../components/Budget/List/BudgetList';
import TotalStatus from '../components/Budget/Status/TotalStatus';
import BudgetHeader from '../components/Budget/UI/BudgetHeader';
import Button from '../components/UI/Button';
import Carousel from '../components/UI/Carousel';
import { useAppSelector } from '../hooks/redux-hook';
import { createBudgetFromBasic, getBudgetByMonth } from '../util/api/budgetAPI';
import classes from './NewBudget.module.css';
import { useEffect } from 'react';

dayjs.extend(customParseFormat);

function NewBudget() {
  const navigate = useNavigate();
  const location = useLocation();

  const defaultBudgetId = useAppSelector((state) => state.budget.default.id);

  const { year, month, budget } = useLoaderData() as Awaited<ReturnType<typeof loader>>;

  useEffect(() => {
    if (budget) {
      navigate(`/budget/${budget._id}`);
    }
  }, [budget]);

  const startDate = new Date(year, month - 1, 1);
  const endDate = dayjs(startDate).endOf('month').toDate();

  const createNewBudget = async () => {
    const { budget } = await createBudgetFromBasic(year, month);
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
        {/* Button */}
        <div className={classes.create}>
          <p>기본 예산을 바탕으로 예산이 생성됩니다.</p>
          <Button
            className={classes.button}
            onClick={() => {
              createNewBudget();
            }}
          >
            예산 생성
          </Button>
          <Link
            to={`/budget/default/${defaultBudgetId}`}
            state={{ from: location }}
            className={classes.link}
          >
            기본 예산 보러가기
          </Link>
        </div>
        {/* Overlays */}
        <BudgetList />
      </main>
    </>
  );
}

export default NewBudget;

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const params = url.searchParams;

  const now = new Date();
  const year = +(params.get('year') || now.getFullYear());
  const month = +(params.get('month') || now.getMonth() + 1);

  const { budget } = await getBudgetByMonth(year, month);

  console.log(year, month);

  return {
    year,
    month,
    budget,
  };
};
