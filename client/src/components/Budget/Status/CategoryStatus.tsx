import { useEffect, useState } from 'react';
import Category from '../../../models/Category';
import StatusHeader from './StatusHeader';
import AmountBars from '../Amount/AmountBars';
import AmountDetail from '../Amount/AmountDetail';
import IndexNav from '../../UI/IndexNav';
import { updateCategoryPlan } from '../../../util/api/budgetAPI';
import { uiActions } from '../../../store/ui';
import ExpenseTab from '../UI/ExpenseTab';
import { useAppDispatch, useAppSelector } from '../../../hooks/redux-hook';
import CategoryPlanButtons from '../UI/CategoryPlanButtons';
import { budgetCategoryActions } from '../../../store/budget-category';

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
  }, [storedCategories]);

  // Get category data
  const categories = storedCategories.filter((item) => {
    return isExpense ? item.isExpense : !item.isExpense;
  });

  const categoryNames = categories.map((item) => `${item.icon} ${item.title}`);

  // Update category plan (in AmountDetail)
  const updatePlan = async (amountStr: string) => {
    const amount = +amountStr;
    const categoryId = categories[currentCategoryIdx].id;

    // Send request
    const { budget } = await updateCategoryPlan(props.budgetId, categoryId, amount);

    // Dispatch budget state (for plan update)
    dispatch(budgetCategoryActions.setCategoryFromData(budget.categories));
  };

  return (
    <>
      <StatusHeader
        id="category-status-type"
        title="카테고리별 현황"
        tab={
          <ExpenseTab
            id="category-status-type-tab"
            isExpense={isExpense}
            setIsExpense={(isExpense: boolean) => {
              dispatch(uiActions.setIsExpense(isExpense));
            }}
          />
        }
      />
      <AmountBars
        amountData={categories.map((item: Category, i) => {
          return {
            amount: item.amount,
            label: item.icon,
            isOver: item.amount.overPlanned,
            onClick: () => {
              setCurrentCategoryIdx(i);
            },
          };
        })}
      />
      <AmountDetail
        id="category"
        amount={categories[currentCategoryIdx].amount}
        editPlanHandler={
          !categories[currentCategoryIdx].isDefault ? updatePlan : undefined
        }
      />
      <IndexNav
        idx={currentCategoryIdx}
        setIdx={setCurrentCategoryIdx}
        data={categoryNames}
      />
      <CategoryPlanButtons />
    </>
  );
}

export default CategoryStatus;
