import { useAppDispatch, useAppSelector } from '../../../hooks/redux-hook';
import Amount from '../../../models/Amount';
import { budgetCategoryActions } from '../../../store/budget-category';
import { totalActions } from '../../../store/total';
import { uiActions } from '../../../store/ui';
import { updateBudgetFields } from '../../../util/api/budgetAPI';
import { getExpensePlannedKey } from '../../../util/filter';
import AmountDetail from '../Amount/AmountDetail';
import AmountRing from '../Amount/AmountRing';
import ExpenseTab from '../UI/ExpenseTab';

function TotalStatus(props: { budgetId?: string }) {
  const { budgetId } = props;
  const dispatch = useAppDispatch();

  // Get state from store
  const isExpense = useAppSelector((state) => state.ui.budget.isExpense);
  const total = useAppSelector((state) => state.total);

  // Get current total state
  const currentTotal = isExpense ? total.expense : total.income;

  // Update plan amount (request & dispatch)
  const updatePlan = async (amountStr: string) => {
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
  };

  // NOTE: Get dash for different font-size (match for rem)
  const mediumScreen = window.matchMedia('(max-width: 400px)');
  const smallScreen = window.matchMedia('(max-width: 350px)');
  const dash = smallScreen.matches ? 475 : mediumScreen.matches ? 555 : 634;

  return (
    <>
      {budgetId && (
        <ExpenseTab
          id="total-nav"
          isExpense={isExpense}
          setIsExpense={(isExpense: boolean) => {
            dispatch(uiActions.setIsExpense(isExpense));
          }}
        />
      )}
      <AmountRing
        amount={budgetId ? currentTotal : new Amount(0, 0, 0)}
        size="18rem"
        r="35%"
        thickness="3rem"
        dash={dash}
        skinScale={0.87}
      />
      {budgetId && (
        <AmountDetail id="total" amount={currentTotal} editPlanHandler={updatePlan} />
      )}
    </>
  );
}

export default TotalStatus;
