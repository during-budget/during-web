import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../hooks/redux-hook';
import Category from '../../../models/Category';
import { userCategoryActions } from '../../../store/user-category';
import { updateCategories } from '../../../util/api/categoryAPI';
import ExpenseTab from '../../Budget/UI/ExpenseTab';
import OverlayForm from '../../UI/OverlayForm';
import UserCategoryList from './UserCategoryList';
import classes from './UserCategorySetting.module.css';
import { SettingOverlayProps } from '../../../screens/User';

function UserCategorySetting({ isOpen, onClose }: SettingOverlayProps) {
  const dispatch = useAppDispatch();

  const isExpense = useAppSelector((state) => state.ui.budget.isExpense);

  const [expenseCategories, setExpenseCategories] = useState<Category[]>([]);
  const [incomeCategories, setIncomeCategories] = useState<Category[]>([]);
  const [defaultCategory, setDefaultCategory] = useState<Category | undefined>(undefined);

  const storedCategories = useAppSelector((state) => state.userCategory);
  const currentCategories = isExpense
    ? storedCategories.expense
    : storedCategories.income;

  // Set categories
  useEffect(() => {
    setExpenseCategories(storedCategories.expense.filter((item) => !item.isDefault));
    setIncomeCategories(storedCategories.income.filter((item) => !item.isDefault));
  }, [storedCategories, isOpen]);

  useEffect(() => {
    const currentDefault = currentCategories.find((item: Category) => item.isDefault);
    setDefaultCategory(currentDefault);
  }, [isExpense]);

  // Form handlers
  const submitHandler = async () => {
    // request data
    const updatingCategories = [...expenseCategories, ...incomeCategories];
    if (defaultCategory) {
      updatingCategories.push(defaultCategory);
    }

    // get response
    const { categories } = await updateCategories({
      categoryData: updatingCategories,
    });

    // dispatch
    dispatch(userCategoryActions.setCategories(categories));

    // close overlay
    onClose();
  };

  return (
    <OverlayForm
      onSubmit={submitHandler}
      overlayOptions={{
        isOpen,
        noTransform: true,
        onClose,
      }}
      className={classes.container}
    >
      <div className={classes.header}>
        <h5>카테고리 설정</h5>
        <ExpenseTab id="user-category-setting-type" />
      </div>
      <UserCategoryList
        isExpense={isExpense}
        categories={isExpense ? expenseCategories : incomeCategories}
        setCategories={isExpense ? setExpenseCategories : setIncomeCategories}
        defaultCategory={defaultCategory}
        setDefaultCategory={setDefaultCategory}
      />
    </OverlayForm>
  );
}

export default UserCategorySetting;
