import { Link, useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../hooks/useRedux';
import Amount from '../../../models/Amount';
import { uiActions } from '../../../store/ui';
import Button from '../../UI/button/Button';
import Icon from '../../UI/component/Icon';
import NavButton from '../../UI/button/NavButton';
import ExpenseTab from '../UI/ExpenseTab';
import classes from './CategoryLayout.module.css';

const CategoryLayout = () => {
  const dispatch = useAppDispatch();

  const { budgetId } = useParams();

  const showLayout = useAppSelector((state) => state.ui.budget.category.showLayout);
  const isExpense = useAppSelector((state) => state.ui.budget.isExpense);
  const allCategories = useAppSelector((state) => state.budgetCategory);
  const categories = isExpense ? allCategories.expense : allCategories.income;

  const closeHandler = () => {
    dispatch(uiActions.showCategoryLayer(false));
  };

  const closeButton = (
    <Button styleClass="extra" onClick={closeHandler}>
      닫기
    </Button>
  );

  if (showLayout) {
    return (
      <>
        <div className={classes.top}>
          <ExpenseTab id="category-layout-expense-tab" showLine={true} />
          {closeButton}
        </div>

        <ul>
          <li className={classes.header}>
            <span>카테고리명</span>
            <span>(현재 + 예정) / (목표금액)</span>
          </li>
          {categories.map((category) => {
            const { current, scheduled, planned } = category.amount;

            const currentScheduled = current + scheduled;
            const remaining = planned - currentScheduled;

            const currentStr = Amount.getAmountStr(current);
            const scheduledStr = Amount.getAmountStr(scheduled);
            const plannedStr = Amount.getAmountStr(planned);
            const currentScheduledStr = Amount.getAmountStr(currentScheduled);
            const remainingStr = Amount.getAmountStr(Math.abs(remaining));

            const link = `/category/${category.id}/${budgetId}`;

            return (
              <li key={category.id}>
                <Link to={link} className={classes.item}>
                  <Icon>{category.icon}</Icon>
                  <div className={classes.data}>
                    <div className={classes.main}>
                      <p className={classes.title}>{category.title}</p>
                      <div className={classes.description}>
                        <p className={classes.amount}>
                          {currentScheduledStr} <span className={classes.divider}>/</span>{' '}
                          {plannedStr}
                        </p>
                        <p className={classes.label}>
                          {remaining === 0
                            ? ''
                            : `${remainingStr} ${remaining < 0 ? '초과' : '남음'}`}
                        </p>
                      </div>
                    </div>
                  </div>
                  <NavButton isNext={true} onClick={() => {}} />
                </Link>
              </li>
            );
          })}
        </ul>
        {closeButton}
        <hr />
      </>
    );
  } else {
    return <></>;
  }
};

export default CategoryLayout;
