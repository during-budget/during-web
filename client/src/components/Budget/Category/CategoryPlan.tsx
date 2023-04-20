import { useEffect, useState } from 'react';
import { DragDropContext, Droppable, OnDragEndResponder } from 'react-beautiful-dnd';
import { useAppDispatch, useAppSelector } from '../../../hooks/redux-hook';
import Amount from '../../../models/Amount';
import Category from '../../../models/Category';
import { budgetCategoryActions } from '../../../store/budget-category';
import { totalActions } from '../../../store/total';
import { transactionActions } from '../../../store/transaction';
import { uiActions } from '../../../store/ui';
import { updateBudgetCategories, updateBudgetFields } from '../../../util/api/budgetAPI';
import { getTransactions } from '../../../util/api/transactionAPI';
import { getExpenseKey, getExpensePlannedKey } from '../../../util/filter';
import Button from '../../UI/Button';
import ConfirmCancelButtons from '../../UI/ConfirmCancelButtons';
import Overlay from '../../UI/Overlay';
import AmountBars from '../Amount/AmountBars';
import EditInput from '../Input/EditInput';
import BudgetCategorySetting from './BudgetCategorySetting';
import classes from './CategoryPlan.module.css';
import CategoryPlanItem from './CategoryPlanItem';

function CategoryPlan(props: { budgetId: string }) {
  const dispatch = useAppDispatch();

  // Get stored states
  const isOpen = useAppSelector((state) => state.ui.budget.category.showEditPlan);
  const isExpense = useAppSelector((state) => state.ui.budget.isExpense);
  const totalObj = useAppSelector((state) => state.total);
  const categoryObj = useAppSelector((state) => state.budgetCategory);
  const { title } = useAppSelector((state) => state.budget)[props.budgetId];
  const isDefaultBudget =
    props.budgetId === useAppSelector((state) => state.user.info.defaultBudgetId);

  // Set states - from store
  const [totalPlanState, setTotalPlanState] = useState<number>(0);
  const [categoryState, setCategoryState] = useState<Category[]>([]);
  const [defaultCategory, setDefaultCategory] = useState<Category | undefined>(undefined);

  // Set states - ui
  const [isEditSetting, setIsEditSetting] = useState(false);

  // Update states - from store
  useEffect(() => {
    setTotalPlanState(totalObj[getExpenseKey(isExpense)].planned);
  }, [isExpense, totalObj]);

  useEffect(() => {
    setCategoryState([]);

    const storedCategories = Object.values(categoryObj);

    storedCategories.forEach((item) => {
      if (item.isExpense === isExpense) {
        if (item.isDefault) {
          setDefaultCategory(item);
        } else {
          const newItem = Category.clone(item);

          // NOTE: 이미 존재하는 경우(편집중인 경우) 기존 amount 값 사용 #58 - 53adb6
          // TODO: budgetCategorySetting으로 추가/삭제 시도하면서 체크 필요
          const isExist = categoryState.find(
            (prevCategory) => prevCategory.id === item.id
          );

          if (isExist && !isOpen) {
            newItem.amount = isExist.amount;
          }

          setCategoryState((prev) => [...prev, newItem]);
        }
      }
    });
  }, [isExpense, categoryObj]);

  // Handlers for Overlay
  const closeHandler = () => {
    dispatch(uiActions.showCategoryPlanEditor({ isExpense, showEditPlan: false }));
  };

  const submitHandler = async (event: React.FormEvent) => {
    event.preventDefault();

    // total - request
    updateBudgetFields(props.budgetId, {
      [getExpensePlannedKey(isExpense)]: totalPlanState,
    });

    // total - dispatch
    dispatch(
      totalActions.updateTotalAmount({
        isExpense,
        planned: totalPlanState,
      })
    );

    // category - request
    const categoryReqData = categoryState.map((item) => {
      const { id, amount } = item;
      return {
        categoryId: id,
        amountPlanned: amount.planned,
      };
    });

    const { categories, excluded } = await updateBudgetCategories(
      props.budgetId,
      isExpense,
      categoryReqData
    );

    // category - set category
    dispatch(budgetCategoryActions.setCategoryFromData(categories));

    // category - set transactions updated category
    if (excluded.length > 0) {
      const { transactions } = await getTransactions(props.budgetId);
      dispatch(transactionActions.setTransactions(transactions));
    }

    // close
    dispatch(uiActions.showCategoryPlanEditor({ isExpense, showEditPlan: false }));
  };

  // Handler for category plan - updating category plan amount onChange item's input
  const updateCategoryPlanHandler = (i: number, value: number) => {
    setCategoryState((prev) => {
      const prevAmount = prev[i].amount;
      const nextAmount = new Amount(prevAmount.current, prevAmount.scheduled, value);
      const nextCategories = [...prev];

      nextCategories[i] = Category.clone(prev[i], { amount: nextAmount });

      return nextCategories;
    });
  };

  // Handlers for total plan
  const confirmTotalHandler = (total: string) => {
    setTotalPlanState(+total.replace(/[^0-9]+/g, ''));
    // NOTE: request는 전체 submit 이후에 전송
  };

  const focusTotalHandler = (event: React.FocusEvent<HTMLInputElement>) => {
    const value = event.target.value.replace(/[^0-9]+/g, '');
    event.target.value = value;
  };

  const sortHandler: OnDragEndResponder = (result) => {
    if (!result.destination) return;
    const items = [...categoryState];
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setCategoryState(items);
  };

  return (
    <>
      <Overlay
        className={`${classes.container} ${isOpen ? classes.open : ''}`}
        isOpen={isOpen}
        closeHandler={closeHandler}
      >
        <form className={classes.content} onSubmit={submitHandler}>
          {/* total - edit input */}
          <h5>{`${title} 카테고리별 ${isExpense ? '지출' : '수입'} 목표`}</h5>
          <EditInput
            className={classes.total}
            editClass={classes.totalEdit}
            cancelClass={classes.totalCancel}
            value={Amount.getAmountStr(totalPlanState)}
            onFocus={focusTotalHandler}
            confirmHandler={confirmTotalHandler}
          />
          {/* total - plan amount bars */}
          <AmountBars
            className={classes.bars}
            borderRadius="0.4rem"
            // NOTE: useEffect 전 초기 defaultCategory는 undefined이므로 옵셔널 처리
            amountData={[...categoryState, defaultCategory].map((item) => {
              return { label: item?.icon || '', amount: item?.amount.planned || 0 };
            })}
          />
          {/* category - plan editors (with current, scheudled amount) */}
          <ul className={classes.list}>
            <h5>목표 예산</h5>
            <DragDropContext onDragEnd={sortHandler}>
              <Droppable droppableId="category-plan-droppable">
                {(provided) => (
                  <ul
                    ref={provided.innerRef}
                    className="category-plan-droppable"
                    {...provided.droppableProps}
                  >
                    {categoryState.map((item: any, i: number) => (
                      <CategoryPlanItem
                        key={item.id}
                        idx={i}
                        id={item.id}
                        icon={item.icon}
                        title={item.title}
                        amount={item.amount}
                        onChange={updateCategoryPlanHandler}
                        hideCurrent={isDefaultBudget}
                      />
                    ))}
                    {provided.placeholder}
                  </ul>
                )}
              </Droppable>
            </DragDropContext>
          </ul>
          {/* category - default amount (left amount) */}
          <div className={classes.left}>
            <h6>{
              // NOTE: useEffect 전 초기 defaultCategory는 undefined이므로 옵셔널 처리
              `${defaultCategory?.icon || ''} 
                ${defaultCategory?.title || ''} 
                (남은 금액)`
            }</h6>
            <p>{Amount.getAmountStr(defaultCategory?.amount.planned || 0)}</p>
          </div>
          {/* buttons */}
          <Button
            className={classes.edit}
            styleClass="extra"
            onClick={() => {
              setIsEditSetting(true);
            }}
          >
            카테고리 목록 편집
          </Button>
          <ConfirmCancelButtons onClose={closeHandler} confirmMsg="목표 설정 완료" />
        </form>
      </Overlay>
      <BudgetCategorySetting
        budgetId={props.budgetId}
        isExpense={isExpense}
        isOpen={isEditSetting}
        setIsOpen={setIsEditSetting}
      />
    </>
  );
}

export default CategoryPlan;
