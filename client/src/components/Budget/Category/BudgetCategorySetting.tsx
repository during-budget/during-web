import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../hooks/redux-hook';
import Category from '../../../models/Category';
import { budgetCategoryActions } from '../../../store/budget-category';
import { transactionActions } from '../../../store/transaction';
import { uiActions } from '../../../store/ui';
import { userCategoryActions } from '../../../store/user-category';
import { updateBudgetCategories } from '../../../util/api/budgetAPI';
import { updateCategoriesPartially } from '../../../util/api/categoryAPI';
import { getTransactions } from '../../../util/api/transactionAPI';
import DraggableItem from '../../UI/DraggableItem';
import DraggableList from '../../UI/DraggableList';
import EmojiInput from '../../UI/EmojiInput';
import OverlayForm from '../../UI/OverlayForm';
import classes from './BudgetCategorySetting.module.css';
import CategoryAddButton from './CategoryAddButton';
import DefaultCategoryEdit from './DefaultCategoryEdit';

interface BudgetCategorySettingProps {
  budgetId: string;
}

const BudgetCategorySetting = ({ budgetId }: BudgetCategorySettingProps) => {
  const dispatch = useAppDispatch();

  // Set ui data
  const isOpen = useAppSelector((state) => state.ui.budget.category.showSetting);
  const isExpense = useAppSelector((state) => state.ui.budget.isExpense);

  // Set category data
  const storedUserCategories = useAppSelector((state) => state.userCategory);
  const storedBudgetCategories = useAppSelector((state) => state.budgetCategory);

  const currentUserCategories = isExpense
    ? storedUserCategories.expense
    : storedUserCategories.income;
  const currentBudgetCategories = isExpense
    ? storedBudgetCategories.expense
    : storedBudgetCategories.income;

  const [categories, setCategories] = useState<Category[]>([]);
  const [defaultCategory, setDefaultCategory] = useState<Category>(
    Category.getEmptyCategory
  );
  const [checkedCategoryIds, setCheckedCategoryIds] = useState<Map<string, boolean>>(
    new Map()
  );

  // Set categories
  useEffect(() => {
    // categories
    const currentCategories = currentUserCategories.map((item) => {
      const budgetCategory = currentBudgetCategories.find(
        (target) => target.id === item.id
      );
      if (budgetCategory) {
        item.amount = budgetCategory.amount;
      }
      return item;
    });

    setCategories(currentCategories.filter((item) => !item.isDefault));
    setDefaultCategory(
      currentUserCategories.find((item) => item.isDefault) || Category.getEmptyCategory()
    );

    // checked
    const checkedIds = currentUserCategories.map((item) => item.id);
    setCheckedCategoryIds(
      new Map(
        currentBudgetCategories.map((item: Category) => [
          item.id,
          checkedIds.includes(item.id),
        ])
      )
    );
  }, [currentUserCategories, currentBudgetCategories, isExpense]);

  const submitHandler = async () => {
    await updateUserCategory();
    updateBudgetCategory();
    closeHandler();
  };

  const updateUserCategory = async () => {
    const {
      categories: updatedCategory,
      updated,
      removed,
    } = await updateCategoriesPartially({
      isExpense,
      categories: [...categories, defaultCategory],
    });

    // user category - update transaction state (removed category -> default category)
    if (removed.length > 0) {
      const { transactions } = await getTransactions(budgetId);
      dispatch(transactionActions.setTransactions(transactions));
    }

    // user category - update category state
    dispatch(userCategoryActions.setCategories(updatedCategory));
    dispatch(budgetCategoryActions.updateCategoryFromSetting({ updated, removed }));
  };

  const updateBudgetCategory = async () => {
    // get checked categories & default category
    const updatingCategories = categories.filter((item) =>
      checkedCategoryIds.get(item.id) && item.title
    );

    // send request
    const categoryReqData = updatingCategories.map((item) => {
      const { id, amount } = item;
      return {
        categoryId: id,
        amountPlanned: amount.planned,
      };
    });
    const { categories: updatedCategories, excluded: excludedCategories } =
      await updateBudgetCategories(budgetId, isExpense, categoryReqData);

    // set state - updated category
    dispatch(budgetCategoryActions.setCategoryFromData(updatedCategories));
    // set state - transactions updated category (excluded -> default)
    if (excludedCategories.length > 0) {
      const { transactions } = await getTransactions(budgetId);
      dispatch(transactionActions.setTransactions(transactions));
    }
  };

  const checkHandler = (_: number, id?: string, checked?: boolean) => {
    setCheckedCategoryIds((prev) => {
      const next = new Map(prev);
      id && next.set(id, checked || false);
      return next;
    });
  };

  const removeHandler = (idx: number) => {
    setCategories((prev) => {
      const removedId = prev[idx].id;
      setCheckedCategoryIds((prev) => {
        const next = new Map(prev);
        next.set(removedId, false);
        return next;
      });
      return [...prev.slice(0, idx), ...prev.slice(idx + 1, prev.length)];
    });
  };

  const iconHandler = (idx: number, value: string) => {
    setCategories((prev) => {
      const next = [...prev];
      next[idx].icon = value;
      return next;
    });
  };

  const titleHandler = (idx: number, value: string) => {
    setCategories((prev) => {
      const next = [...prev];
      next[idx].title = value;
      return next;
    });
  };

  const closeHandler = () => {
    dispatch(uiActions.showBudgetCategorySetting(false));
  };

  return (
    <OverlayForm
      overlayOptions={{ isOpen, onClose: closeHandler, noTransform: true }}
      onSubmit={submitHandler}
      className={classes.budgetCategoryForm}
    >
      <h5>카테고리 목록 편집</h5>
      <DraggableList
        id="budget-category-setting-list"
        className={classes.list}
        list={categories}
        setList={setCategories}
      >
        {categories.map((item, i) => (
          <DraggableItem
            key={item.id}
            id={item.id}
            className={classes.budgetCategoryItem}
            idx={i}
            onCheck={checkHandler}
            checked={checkedCategoryIds.get(item.id)}
            onRemove={item.isDefault ? undefined : removeHandler}
          >
            <div className={classes.info}>
              <EmojiInput
                className={classes.icon}
                value={item.icon}
                onChange={(value: string) => {
                  iconHandler(i, value);
                }}
                required={true}
              />
              <input
                className={classes.title}
                type="text"
                value={item.title}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  titleHandler(i, event.target.value);
                }}
                required
              />
            </div>
          </DraggableItem>
        ))}
      </DraggableList>
      <CategoryAddButton
        isExpense={isExpense}
        setCategories={setCategories}
        onAdd={(category) => {
          checkedCategoryIds.set(category.id, true);
        }}
        afterAdd={() => {
          const input = document.querySelector(
            '.' + classes.budgetCategoryItem + ':last-child .' + classes.title
          ) as HTMLInputElement;
          input?.focus();
        }}
      />
      <DefaultCategoryEdit
        defaultCategory={defaultCategory}
        setDefaultCategory={setDefaultCategory}
      />
    </OverlayForm>
  );
};

export default BudgetCategorySetting;
