import { useAppDispatch, useAppSelector } from '../../../hooks/redux-hook';
import { uiActions } from '../../../store/ui';
import RadioTab from '../../UI/RadioTab';

function ExpenseTab(props: {
  id: string;
  className?: string;
  showAll?: boolean;
  showLine?: boolean;
  disabled?: boolean;
}) {
  const dispatch = useAppDispatch();

  const isExpense = useAppSelector((state) => state.ui.budget.isExpense);
  const isIncome = useAppSelector((state) => state.ui.budget.isIncome);

  const setIsExpense = (state: boolean) => {
    dispatch(uiActions.setIsExpense(state));
  };
  const setIsIncome = (state: boolean) => {
    dispatch(uiActions.setIsIncome(state));
  };

  const tabs = [
    {
      label: '지출',
      value: 'expense',
      checked: props.showAll ? isExpense && !isIncome : isExpense,
      onChange: () => {
        setIsExpense(true);
        setIsIncome(false);
      },
      disabled: props.disabled,
    },
    {
      label: '수입',
      value: 'income',
      checked: isIncome && !isExpense,
      onChange: () => {
        setIsExpense(false);
        setIsIncome(true);
      },
      disabled: props.disabled,
    },
  ];

  if (props.showAll) {
    tabs.unshift({
      label: '전체',
      value: 'all',
      checked: isExpense && isIncome,
      onChange: () => {
        setIsExpense(true);
        setIsIncome(true);
      },
      disabled: props.disabled,
    });
  }

  return (
    <RadioTab
      className={props.className}
      name={props.id}
      values={tabs}
      isLine={props.showLine}
    />
  );
}

export default ExpenseTab;
