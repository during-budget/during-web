import { useAppDispatch, useAppSelector } from '../../../hooks/useRedux';
import Amount from '../../../models/Amount';
import { uiActions } from '../../../store/ui';
import { getExpenseKey } from '../../../util/filter';
import Button from '../../UI/button/Button';
import Overlay from '../../UI/overlay/Overlay';
import AmountArea from '../Amount/AmountArea';
import EditInput from '../Input/EditInput';
import ExpenseTab from '../UI/ExpenseTab';
import CategoryListItem from './CategoryListItem';
import classes from './CategoryListOverlay.module.css';

function CategoryListOverlay(props: { budgetId: string }) {
  const dispatch = useAppDispatch();

  // Get stored states
  const isOpen = useAppSelector((state) => state.ui.budget.category.showList);
  const isExpense = useAppSelector((state) => state.ui.budget.isExpense);
  const storedTotal = useAppSelector((state) => state.total);
  const storedCategories = useAppSelector((state) => state.budgetCategory);
  const currentCategories = isExpense
    ? storedCategories.expense
    : storedCategories.income;
  const { title } = useAppSelector((state) => state.budget.current);

  // Handlers for Overlay
  const closeHandler = () => {
    dispatch(uiActions.showCategoryList(false));
  };

  return (
    <>
      <Overlay
        id="category-list"
        isOpen={isOpen}
        noTransform={true}
        onClose={closeHandler}
        className={`${classes.container} ${isOpen ? classes.open : ''}`}
      >
        {/* total - edit input */}
        <div className="flex j-between">
          <h5>{isExpense ? '지출' : '수입'} 카테고리</h5>
          <ExpenseTab id="category-list-expense-tab" />
        </div>
        <EditInput
          id="category-list-edit-input"
          className={classes.total}
          editClass={classes.totalEdit}
          cancelClass={classes.totalCancel}
          label={`${title} ${isExpense ? '지출' : '수입'} 목표`}
          value={Amount.getAmountStr(storedTotal[getExpenseKey(isExpense)].planned)}
          disableEdit={true}
        />
        {/* total - plan amount bars */}
        <AmountArea
          className={classes.bars}
          borderRadius="0.4rem"
          amountData={currentCategories.map((item) => {
            return { label: item.icon || ' ', amount: item.amount.planned || 0 };
          })}
        />
        {/* category - plan editors (with current, scheudled amount) */}
        <ul className={classes.list}>
          <h5>현재 {isExpense ? '지출' : '수입'}</h5>
          <ul>
            {currentCategories.map(
              (item, i: number) =>
                item && (
                  <CategoryListItem
                    key={item.id}
                    id={item.id}
                    icon={item.icon}
                    title={item.title}
                    amount={item.amount}
                  />
                )
            )}
          </ul>
        </ul>
        {/* buttons */}
        <Button
          className={classes.edit}
          styleClass="extra"
          fontSize="md"
          onClick={() => {
            dispatch(uiActions.showBudgetCategorySetting(true));
          }}
        >
          카테고리 목록 편집
        </Button>
        <Button
          className="mt-1"
          onClick={() => {
            dispatch(uiActions.showCategoryList(false));
          }}
        >
          닫기
        </Button>
      </Overlay>
    </>
  );
}

export default CategoryListOverlay;
