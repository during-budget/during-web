import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import BudgetList from '../components/Budget/List/BudgetList';
import TotalStatus from '../components/Budget/Status/TotalStatus';
import BudgetHeader from '../components/Budget/UI/BudgetHeader';
import Button from '../components/UI/Button';
import Carousel from '../components/UI/Carousel';
import { useAppDispatch, useAppSelector } from '../hooks/useRedux';
import { uiActions } from '../store/ui';
import { createBudgetFromBasic } from '../util/api/budgetAPI';
import { getErrorMessage } from '../util/error';
import classes from './NewBudget.module.css';

dayjs.extend(customParseFormat);

function NewBudget() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();

  const defaultBudgetId = useAppSelector((state) => state.budget.default.id);

  const [params] = useSearchParams();

  const now = new Date();
  const year = +(params.get('year') || now.getFullYear());
  const month = +(params.get('month') || now.getMonth() + 1);

  const startDate = new Date(year, month - 1, 1);
  const endDate = dayjs(startDate).endOf('month').toDate();

  const createNewBudget = async () => {
    try {
      const { budget } = await createBudgetFromBasic(year, month);
      navigate(`/budget/${budget._id}`);
    } catch (error) {
      const message = getErrorMessage(error);
      dispatch(
        uiActions.showErrorModal({
          description: message || '예산 생성 중 문제가 발생했습니다.',
        })
      );
      if (!message) throw error;
    }
  };

  return (
    <div className={classes.new}>
      <BudgetHeader budgetId={defaultBudgetId} newDate={{ start: startDate, end: endDate }} />
      <main>
        {/* Status */}
        <Carousel id="status" initialIndex={0} itemClassName={classes.status}>
          <div
            className={classes.clickable}
            onClick={() => {
              createNewBudget();
            }}
          >
            <TotalStatus />
          </div>
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
    </div>
  );
}

export default NewBudget;
