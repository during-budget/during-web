import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../hooks/redux-hook';
import Category from '../../../models/Category';
import { userCategoryActions } from '../../../store/user-category';
import { updateCategories } from '../../../util/api/categoryAPI';
import ExpenseTab from '../../Budget/UI/ExpenseTab';
import ConfirmCancelButtons from '../../UI/ConfirmCancelButtons';
import Overlay from '../../UI/Overlay';
import UserCategoryList from './UserCategoryList';
import classes from './UserCategorySetting.module.css';

function UserCategorySetting(props: {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}) {
  const dispatch = useAppDispatch();

  const storedCategories = useAppSelector((state) => state.userCategory);

  const [isExpense, setIsExpense] = useState(true);
  const [expenseCategories, setExpenseCategories] = useState<Category[]>([]);
  const [incomeCategories, setIncomeCategories] = useState<Category[]>([]);
  const [defaultCategory, setDefaultCategory] = useState<Category | undefined>(undefined);

  // Set categories
  useEffect(() => {
    setExpenseCategories([]);
    setIncomeCategories([]);

    storedCategories.forEach((item: Category) => {
      if (item.isDefault) {
        return;
      }

      if (item.isExpense) {
        setExpenseCategories((prev) => [...prev, item]);
      } else {
        setIncomeCategories((prev) => [...prev, item]);
      }
    });
  }, [storedCategories, props.isOpen]);

  useEffect(() => {
    const currentDefault = storedCategories.find(
      (item: Category) => item.isDefault && item.isExpense === isExpense
    );
    setDefaultCategory(currentDefault);
  }, [isExpense]);

  // Form handlers
  const submitHandler = async (event: React.FormEvent) => {
    event.preventDefault();

    // request data
    const updatingCategories = [...expenseCategories, ...incomeCategories];
    if (defaultCategory) {
      updatingCategories.push(defaultCategory);
    }

    // get response
    const { categories } = await updateCategories({
      isExpense,
      categoryData: updatingCategories,
    });

    // dispatch
    dispatch(userCategoryActions.setCategories(categories));

    // close overlay
    props.setIsOpen(false);
  };

  const closeHandler = () => {
    props.setIsOpen(false);
  };

  return (
    <Overlay
      className={classes.container}
      isOpen={props.isOpen}
      closeHandler={closeHandler}
    >
      <form onSubmit={submitHandler}>
        <div className={classes.header}>
          <h5>카테고리 설정</h5>
          <ExpenseTab
            id="user-category-setting-type"
            isExpense={isExpense}
            setIsExpense={setIsExpense}
          />
        </div>
        <UserCategoryList
          isExpense={isExpense}
          categories={isExpense ? expenseCategories : incomeCategories}
          setCategories={isExpense ? setExpenseCategories : setIncomeCategories}
          defaultCategory={defaultCategory}
          setDefaultCategory={setDefaultCategory}
        />
        <ConfirmCancelButtons onClose={closeHandler} confirmMsg="완료" />
      </form>
    </Overlay>
  );
}

export default UserCategorySetting;
