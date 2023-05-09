import { useEffect, useState } from 'react';
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
import DraggableList from '../../UI/DraggableList';
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
  const storedTotal = useAppSelector((state) => state.total);
  const storedCategories = useAppSelector((state) => state.budgetCategory);
  const currentCategories = isExpense
    ? storedCategories.expense
    : storedCategories.income;
  const { title } = useAppSelector((state) => state.budget.current);
  const isDefaultBudget =
    props.budgetId === useAppSelector((state) => state.user.info.defaultBudgetId);

  // Set states - from store
  const [totalPlanState, setTotalPlanState] = useState<number>(0);
  const [categoryState, setCategoryState] = useState<Category[]>([]);
  const [defaultCategory, setDefaultCategory] = useState<Category | undefined>(undefined);

  // Set states - ui
  const [isEditSetting, setIsEditSetting] = useState(false);

  // Update state <- from store
  // TODO: isExpense 일치 일반 카테고리와 기본 카테고리 분류해서 얻는 헬퍼 함수나 훅.. 만들기...
  useEffect(() => {
    setTotalPlanState(storedTotal[getExpenseKey(isExpense)].planned);
  }, [isExpense, storedTotal]);

  useEffect(() => {
    setCategoryState([]);
    currentCategories.forEach((item) => {
      if (item.isExpense === isExpense) {
        if (item.isDefault) {
          setDefaultCategory(item);
        } else {
          setCategoryState((prev) => [...prev, item]);
        }
      }
    });
  }, [isExpense, currentCategories]);

  // Update default state <- category, total
  useEffect(() => {
    setDefaultCategory((prev) => {
      const nextDefault = Category.clone(prev);
      const categoryPlanSum = categoryState.reduce(
        (acc, curr) => acc + curr.amount.planned,
        0
      );

      nextDefault.amount.planned = totalPlanState - categoryPlanSum;

      return nextDefault;
    });
  }, [categoryState, totalPlanState]);

  // Handlers for Overlay
  const closeHandler = () => {
    dispatch(uiActions.showCategoryPlanEditor({ isExpense, showEditPlan: false }));
  };

  const submitHandler = async (event: React.FormEvent) => {
    event.preventDefault();

    // total - request
    // NOTE: total 업데이트로 인한 defaultCategory 연산 -> 해당 결과 기반 카테고리 예산 업데이트 결과를 위한 await
    await updateBudgetFields(props.budgetId, {
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
    // NOTE: 마운트 이후에는(useEffect 이후) 항상 defaultCategory가 존재함
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
    let planDiff = 0;

    // Update target category
    setCategoryState((prev) => {
      const prevAmount = prev[i].amount;
      const nextAmount = new Amount(prevAmount.current, prevAmount.scheduled, value);
      const nextCategories = [...prev];

      nextCategories[i] = Category.clone(prev[i], { amount: nextAmount });

      planDiff = prevAmount.planned - nextAmount.planned;

      return nextCategories;
    });
  };

  // Handlers for plan amounts
  const confirmTotalHandler = (total: string) => {
    const confirmedTotal = +total.replace(/[^0-9]+/g, '');
    setTotalPlanState(confirmedTotal);
  };

  const convertTotalHandler = (value: string) => {
    return value.replace(/[^0-9]/g, '');
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
            confirmHandler={confirmTotalHandler}
            convertDefaultValue={convertTotalHandler}
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
            <DraggableList
              id="category-plan-draggable-list"
              list={categoryState}
              setList={(list: any[]) => {
                setCategoryState(list);
              }}
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
            </DraggableList>
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
        budgetCategories={categoryState}
        isExpense={isExpense}
        isOpen={isEditSetting}
        closeHandler={() => {
          setIsEditSetting(false);
        }}
        setCategoryPlans={setCategoryState}
      />
    </>
  );
}

export default CategoryPlan;
