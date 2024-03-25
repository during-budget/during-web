import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../hooks/useRedux';
import Amount from '../../../models/Amount';
import { budgetActions } from '../../../store/budget';
import { budgetCategoryActions } from '../../../store/budget-category';
import { uiActions } from '../../../store/ui';
import { updateCategoryPlan } from '../../../util/api/budgetAPI';
import { getErrorMessage } from '../../../util/error';
import Button from '../../UI/button/Button';
import IndexNav from '../../UI/nav/IndexNav';
import AmountBars from '../Amount/AmountBars';
import AmountDetail from '../Amount/AmountDetail';
import CategoryPlanButtons from '../UI/CategoryPlanButtons';
import ExpenseTab from '../UI/ExpenseTab';
import StatusHeader from './StatusHeader';

function CategoryStatus(props: { budgetId: string }) {
  const dispatch = useAppDispatch();

  // Get state from store
  const isExpense = useAppSelector((state) => state.ui.budget.isExpense);
  const storedCategories = useAppSelector((state) => state.budgetCategory);

  // CategoryIdx -Set current category idx
  const [currentCategoryIdx, setCurrentCategoryIdx] = useState(0);
  // CategoryIdx - Init index when category changes
  useEffect(() => {
    setCurrentCategoryIdx(0);
  }, [storedCategories, isExpense]);

  // Get category data
  const categories = isExpense ? storedCategories.expense : storedCategories.income;
  const categoryNames = categories.map((item) => `${item.icon} ${item.title}`);

  // Update category plan (in AmountDetail)
  const updatePlan = async (amountStr: string) => {
    try {
      const amount = +amountStr;
      const categoryId = categories[currentCategoryIdx].id;

      // Send request
      const { budget } = await updateCategoryPlan(props.budgetId, categoryId, amount);

      // Dispatch budget state (for plan update)
      dispatch(budgetCategoryActions.setCategoryFromData(budget.categories));
      dispatch(budgetActions.setCurrentBudget(budget));
    } catch (error) {
      const message = getErrorMessage(error);
      dispatch(
        uiActions.showErrorModal({
          description: message || '카테고리 목표 업데이트 중 문제가 발생했습니다.',
        })
      );
      if (!message) throw error;
    }
  };

  return (
    <>
      <StatusHeader
        id="category-status-type"
        title="카테고리별 현황"
        tab={<ExpenseTab id="category-status-type-tab" />}
      />
      <AmountBars
        data={categories.map((item, i) => {
          return {
            id: item.id,
            amount: item.amount,
            label: item.icon,
            onClick: () => {
              setCurrentCategoryIdx(i);
            },
          };
        })}
      />
      <AmountDetail
        id="category"
        amount={categories[currentCategoryIdx]?.amount || new Amount(0, 0, 0)}
        editPlanHandler={
          !categories[currentCategoryIdx]?.isDefault ? updatePlan : undefined
        }
      />
      <IndexNav
        idx={currentCategoryIdx}
        setIdx={setCurrentCategoryIdx}
        data={categoryNames}
        to={
          categories[currentCategoryIdx] &&
          `/category/${categories[currentCategoryIdx].id}/${props.budgetId}`
        }
      />
      <CategoryPlanButtons />
      <Button
        onClick={() => {
          dispatch(uiActions.showCategoryList(true));
        }}
        styleClass="extra"
        className="flex-column"
      >
        <span className="text-md mt-0.75">더보기</span>
      </Button>
    </>
  );
}

export default CategoryStatus;
