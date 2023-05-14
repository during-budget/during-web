import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../hooks/redux-hook';
import { uiActions } from '../../../store/ui';
import Overlay from '../../UI/Overlay';
import YearPicker from '../../UI/YearPicker';
import BudgetItem from './BudgetItem';
import classes from './BudgetList.module.css';
import { budgetActions } from '../../../store/budget';
import { getBudgetList } from '../../../util/api/budgetAPI';

const startDay = 1;
const endDay = startDay - 1;

const BudgetList = () => {
  const dispatch = useAppDispatch();

  const isOpen = useAppSelector((state) => state.ui.budget.showBudgetList);
  const budgets = useAppSelector((state) => state.budget.list);

  const [yearState, setYearState] = useState(new Date().getFullYear().toString());

  useEffect(() => {
    const setBudgetList = async () => {
      const { budgets } = await getBudgetList();
      dispatch(budgetActions.setBudgetList(budgets));
    };

    if (isOpen) {
      setBudgetList();
    }
  }, [isOpen]);

  const closeHandler = () => {
    dispatch(uiActions.showBudgetList(false));
  };

  return (
    <Overlay isOpen={isOpen} onClose={closeHandler} className={classes.container}>
      <YearPicker
        className={classes.year}
        fontSize="2.5rem"
        onSelect={(value: string) => {
          setYearState(value);
        }}
      />
      <nav>
        <ol>
          {Array(12)
            .fill(0)
            .map((_, month: number) => {
              const startDate = new Date(+yearState, month, startDay);
              const endDate = new Date(+yearState, endDay ? month : month + 1, endDay);
              const budget = budgets.find(
                (item) =>
                  item.date.start.toLocaleDateString() ===
                    startDate.toLocaleDateString() &&
                  item.date.end.toLocaleDateString() === endDate.toLocaleDateString()
              );
              return (
                <BudgetItem
                  key={month}
                  budget={budget}
                  startDate={startDate}
                  endDate={endDate}
                  onClose={closeHandler}
                />
              );
            })}
        </ol>
      </nav>
    </Overlay>
  );
};

export default BudgetList;
