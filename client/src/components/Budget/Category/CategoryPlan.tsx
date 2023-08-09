import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../hooks/useRedux';
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
import DraggableList from '../../UI/DraggableList';
import Inform from '../../UI/Inform';
import OverlayForm from '../../UI/OverlayForm';
import AmountArea from '../Amount/AmountArea';
import EditInput from '../Input/EditInput';
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
  const [allCategory, setAllCategoryState] = useState<Category[]>([]);
  const [remaining, setRemaining] = useState(0);

  // Update state <- from store
  // TODO: isExpense 일치 일반 카테고리와 기본 카테고리 분류해서 얻는 헬퍼 함수나 훅.. 만들기...
  useEffect(() => {
    if (isOpen) {
      setTotalPlanState(storedTotal[getExpenseKey(isExpense)].planned);
    }
  }, [isOpen, isExpense, storedTotal]);

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

  useEffect(() => {
    setAllCategoryState([
      ...categoryState,
      defaultCategory || Category.getEmptyCategory(),
    ]);
  }, [categoryState, defaultCategory]);

  // Handlers for Overlay
  const closeHandler = () => {
    dispatch(uiActions.showCategoryPlanEditor({ isExpense, showEditPlan: false }));
  };

  useEffect(() => {
    const categoryPlanSum = allCategory.reduce(
      (acc, item) => acc + item.amount.planned,
      0
    );
    setRemaining(totalPlanState - categoryPlanSum);
  }, [totalPlanState, allCategory]);

  const submitHandler = async () => {
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
      const { id, amount, autoPlanned } = item;
      return {
        categoryId: id,
        amountPlanned: amount.planned,
        autoPlanned,
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
  const updateCategoryPlanHandler = (i: number, value: number, autoPlanned: boolean) => {
    let planDiff = 0;

    // Update target category
    setCategoryState((prev) => {
      const prevAmount = prev[i].amount;
      const nextAmount = new Amount(prevAmount.current, prevAmount.scheduled, value);
      const nextCategories = [...prev];

      console.log(i, value, autoPlanned);

      nextCategories[i] = Category.clone(prev[i], { amount: nextAmount, autoPlanned });

      planDiff = prevAmount.planned - nextAmount.planned;

      return nextCategories;
    });
  };

  // Handlers for plan amounts
  const confirmTotalHandler = (total: string) => {
    const confirmedTotal = +total.replace(/[^0-9.]+/g, '');
    setTotalPlanState(confirmedTotal);
  };

  const convertTotalHandler = (value: string) => {
    return value.replace(/[^0-9]/g, '');
  };

  return (
    <>
      <OverlayForm
        onSubmit={submitHandler}
        overlayOptions={{
          id: 'category-plan',
          isOpen,
          noTransform: true,
          onClose: closeHandler,
        }}
        confirmCancelOptions={{
          confirmMsg: '목표 설정 완료',
        }}
        formHeight="75vh"
        className={`${classes.container} ${isOpen ? classes.open : ''}`}
      >
        {/* total - edit input */}
        <h5>카테고리 목표 수정</h5>
        <EditInput
          id="category-total-plan-edit-input"
          className={classes.total}
          editClass={classes.totalEdit}
          cancelClass={classes.totalCancel}
          label={`${title} ${isExpense ? '지출' : '수입'} 목표`}
          value={Amount.getAmountStr(totalPlanState)}
          onConfirm={confirmTotalHandler}
          convertDefaultValue={convertTotalHandler}
        />
        {remaining < 0 && (
          <Inform className={classes.alert} isError={isExpense}>
            <strong>전체 목표 초과</strong>

            <p>
              카테고리별 목표 총합이{' '}
              <strong>{`${Amount.getAmountStr(totalPlanState + -1 * remaining)}`}</strong>
              입니다.
            </p>
          </Inform>
        )}
        {/* total - plan amount bars */}
        <AmountArea
          className={classes.bars}
          borderRadius="0.4rem"
          amountData={allCategory.map((item) => {
            return { label: item.icon || ' ', amount: item.amount.planned || 0 };
          })}
        />
        {/* category - plan editors (with current, scheudled amount) */}
        <ul className={classes.list}>
          <h5>목표 예산</h5>
          <DraggableList
            id="category-plan-draggable-list"
            list={allCategory}
            setList={(list: Category[]) => {
              setCategoryState(list.filter((item) => !item.isDefault));
            }}
          >
            {allCategory.map(
              (item, i: number) =>
                item && (
                  <CategoryPlanItem
                    key={item.id}
                    idx={i}
                    id={item.id}
                    icon={item.icon}
                    title={item.title}
                    amount={item.amount}
                    isDefault={item.isDefault}
                    autoPlanned={item.autoPlanned}
                    onChange={updateCategoryPlanHandler}
                    hideCurrent={isDefaultBudget}
                    preventDrag={item.isDefault}
                    resetAutoPlan={isOpen}
                  />
                )
            )}
          </DraggableList>
        </ul>
        {/* category - default amount (left amount) */}
        <div
          className={`${classes.left} ${
            (defaultCategory?.amount.planned || 0) -
              (defaultCategory?.amount.current || 0) -
              (defaultCategory?.amount.scheduled || 0) <
            0
              ? classes.red
              : ''
          }`}
        >
          <h6>남은 금액</h6>
          <p>
            {/* TODO: 서버에서 remained 가져오기 */}
            {Amount.getAmountStr(remaining)}
          </p>
        </div>
        {/* buttons */}
        <Button
          className={classes.edit}
          styleClass="extra"
          onClick={() => {
            dispatch(uiActions.showBudgetCategorySetting(true));
          }}
        >
          카테고리 목록 편집
        </Button>
      </OverlayForm>
    </>
  );
}

export default CategoryPlan;
