import { useAppDispatch, useAppSelector } from '../../../hooks/useRedux';
import useScreenEndPoint from '../../../hooks/useScreenEndPoint';
import Amount from '../../../models/Amount';
import { budgetCategoryActions } from '../../../store/budget-category';
import { totalActions } from '../../../store/total';
import { uiActions } from '../../../store/ui';
import { updateBudgetFields } from '../../../util/api/budgetAPI';
import { getErrorMessage } from '../../../util/error';
import { getExpensePlannedKey } from '../../../util/filter';
import AmountDetail from '../Amount/AmountDetail';
import AmountRing from '../Amount/AmountRing';
import ExpenseTab from '../UI/ExpenseTab';

interface TotalStatusProps {
  budgetId?: string;
}

const TotalStatus = ({ budgetId }: TotalStatusProps) => {
  const dispatch = useAppDispatch();

  // Get state from store
  const isExpense = useAppSelector((state) => state.ui.budget.isExpense);
  const total = useAppSelector((state) => state.total);

  // Get screen size
  const [isLargeScreen, isSmallScreen] = useScreenEndPoint();

  // Get current total state
  const currentTotal = isExpense ? total.expense : total.income;

  // Update plan amount (request & dispatch)
  const updatePlan = async (amountStr: string) => {
    try {
      // convert amount
      const amount = +amountStr;

      // send Request
      const key = getExpensePlannedKey(isExpense);
      const { budget } = await updateBudgetFields(budgetId!, {
        [key]: amount,
      });

      // Update total plan state
      dispatch(totalActions.updateTotalAmount({ isExpense, planned: amount }));
      // Update category plan state
      dispatch(budgetCategoryActions.setCategoryFromData(budget.categories));
    } catch (error) {
      const message = getErrorMessage(error);
      dispatch(
        uiActions.showErrorModal({
          description: message || '목표 금액 업데이트 중 문제가 발생했습니다.',
        })
      );
      if (!message) throw error;
    }
  };

  // NOTE: Get dash for different font-size (_reset.css의 미디어쿼리 확인)
  const dash = isSmallScreen ? 477 : isLargeScreen ? 715 : 635;

  return (
    <div className='flex-column i-center'>
      {budgetId && <ExpenseTab id="total-nav" />}
      <AmountRing
        amount={budgetId ? currentTotal : new Amount(0, 0, 0)}
        size="18rem"
        r="35%"
        thickness="3rem"
        dash={dash}
        skinScale={0.87}
        showMsg={isExpense}
      />
      {budgetId && (
        <AmountDetail id="total" amount={currentTotal} editPlanHandler={updatePlan} />
      )}
    </div>
  );
};

export default TotalStatus;
