import { useEffect, useState } from 'react';
import classes from './DefaultStatus.module.css';
import ExpenseTab from '../../Budget/UI/ExpenseTab';
import Amount from '../../../models/Amount';
import Category from '../../../models/Category';
import AmountBars from '../../Budget/Amount/AmountBars';
import Button from '../../UI/Button';
import { uiActions } from '../../../store/ui';
import { useAppDispatch } from '../../../hooks/redux-hook';
import { updateBudgetFields } from '../../../util/api/budgetAPI';

interface Props {
  budgetId: string;
  total: {
    expense: Amount;
    income: Amount;
  };
  categories: Category[];
}

function DefaultStatus({ budgetId, total, categories }: Props) {
  const dispatch = useAppDispatch();
  const [isExpense, setIsExpense] = useState(true);
  const [plan, setPlan] = useState('0원');

  const currentCategories = categories.filter((item) => item.isExpense === isExpense);

  const amount = isExpense ? total.expense.scheduled : total.income.scheduled;
  useEffect(() => {
    const plannedAmount = isExpense ? total.expense.planned : total.income.planned;
    setPlan(Amount.getAmountStr(plannedAmount));
  }, [isExpense]);

  // Change - Set number
  const changeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.replace(/[^0-9]+/g, '');

    setPlan(value);
  };

  // Focus - Conver to number
  const focusHandler = (event: React.FocusEvent<HTMLInputElement>) => {
    const value = event.target.value.replace(/[^0-9]+/g, '');

    if (value === '0') {
      setPlan('');
    } else {
      setPlan(value);
    }

    event.target.scrollIntoView({
      block: 'start',
      behavior: 'smooth',
    });
  };

  // Blur - Set AmountStr
  const blurHandler = async (event: React.FocusEvent<HTMLInputElement>) => {
    const value = event.target.value;

    // send Request
    const key = isExpense ? 'expensePlanned' : 'incomePlanned';
    updateBudgetFields(budgetId, {
      [key]: +value,
    });

    if (value === '' || +value <= 0) {
      setPlan('0원');
    } else {
      setPlan(Amount.getAmountStr(+value));
    }
  };

  return (
    <>
      <ExpenseTab
        id="default-type"
        className={classes.tab}
        isExpense={isExpense}
        setIsExpense={setIsExpense}
      />
      <div className={classes.container}>
        {/* scheduled amount */}
        <div className={classes.scheduled}>
          <span>예정</span>
          <p className={classes.total}>{Amount.getAmountStr(amount)}</p>
        </div>
        {/* plan editor */}
        {/* TODO: CategoryPlanItem의 Input과 같은 컴포넌트 NumberInput으로 통합 */}
        <div className={classes.planned}>
          <label htmlFor="default-budget-plan">목표</label>
          <input
            id="default-budget-plan"
            type="text"
            value={plan}
            onChange={changeHandler}
            onFocus={focusHandler}
            onBlur={blurHandler}
          />
        </div>
        {/* plan chart */}
        <AmountBars
          className={classes.bars}
          borderRadius="0.4rem"
          amountData={currentCategories.map((item) => {
            return {
              label: item.icon,
              amount: item.amount.planned,
            };
          })}
        />
        <div className={classes.buttons}>
          <Button
            styleClass="extra"
            onClick={() => {
              dispatch(
                uiActions.showCategoryPlanEditor({
                  isExpense: true,
                  showEditPlan: true,
                })
              );
            }}
          >
            <span className={classes.edit}>지출 카테고리 편집</span>
          </Button>
          <Button
            styleClass="extra"
            onClick={() => {
              dispatch(
                uiActions.showCategoryPlanEditor({
                  isExpense: false,
                  showEditPlan: true,
                })
              );
            }}
          >
            <span className={classes.edit}>수입 카테고리 편집</span>
          </Button>
        </div>
      </div>
    </>
  );
}

export default DefaultStatus;
