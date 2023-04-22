import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../hooks/redux-hook';
import Category from '../../../models/Category';
import { budgetCategoryActions } from '../../../store/budget-category';
import { transactionActions } from '../../../store/transaction';
import { userCategoryActions } from '../../../store/user-category';
import { updateCategories } from '../../../util/api/categoryAPI';
import { getTransactions } from '../../../util/api/transactionAPI';
import { getFilteredCategories } from '../../../util/filter';
import Button from '../../UI/Button';
import ConfirmCancelButtons from '../../UI/ConfirmCancelButtons';
import Overlay from '../../UI/Overlay';
import classes from './BudgetCategorySetting.module.css';
import CategoryAddButton from './CategoryAddButton';
import CategoryCheckItem from './CategoryCheckItem';
import CategoryEditItem from './CategoryEditItem';
import DefaultCategoryEdit from './DefaultCategoryEdit';

interface BudgetCategorySettingProps {
  budgetId: string;
  budgetCategories: Category[];
  isExpense: boolean;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  sendRequest?: boolean;
  setCategoryPlans?: React.Dispatch<React.SetStateAction<Category[]>>;
  setDefaultPlan?: React.Dispatch<React.SetStateAction<Category | undefined>>;
}

function BudgetCategorySetting({
  budgetId,
  budgetCategories,
  isExpense,
  isOpen,
  setIsOpen,
  sendRequest,
  setCategoryPlans,
}: BudgetCategorySettingProps) {
  const dispatch = useAppDispatch();

  // Set category data
  const storedCategories = useAppSelector((state) => state.userCategory);

  // Set state for edit & check
  const [isEdit, setIsEdit] = useState(false);
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
    setCategories(getFilteredCategories({ categories: storedCategories, isExpense }));
    setDefaultCategory(
      getFilteredCategories({
        categories: storedCategories,
        isExpense,
        isDefault: true,
      })[0]
    );

    // checked categories
    const checkedIds = budgetCategories.map((item) => item.id);
    setCheckedCategoryIds(
      new Map(categories.map((item: Category) => [item.id, checkedIds.includes(item.id)]))
    );

    // init edit mode
    if (isOpen) {
      setIsEdit(false);
    }
  }, [storedCategories, isExpense, isOpen]);

  // Form handlers
  const submitHandler = async (event?: React.FormEvent) => {
    event?.preventDefault();
    if (isEdit) {
      submitEditData();
    } else {
      submitCheckedData();
      closeHandler();
    }
  };

  const submitEditData = async () => {
    const updatingCategories = [...categories, defaultCategory];
    const {
      categories: updatedCategories,
      updated,
      removed,
    } = await updateCategories({ isExpense, categoryData: updatingCategories });

    // update transaction state (removed category -> default category)
    if (removed.length > 0) {
      const { transactions } = await getTransactions(budgetId);
      dispatch(transactionActions.setTransactions(transactions));
    }

    // update category state
    dispatch(userCategoryActions.setCategories(updatedCategories));
    dispatch(budgetCategoryActions.updateCategoryFromSetting({ updated, removed }));
  };

  const submitCheckedData = async () => {
    // checkedId -> checkedCategories
    const checkedCategories: Category[] = [];
    checkedCategoryIds.forEach((isChecked, key) => {
      if (isChecked) {
        const category = categories.find((item: Category) => item.id === key);
        category && checkedCategories.push(category);
      }
    });

    // checkedCategories -> update budget categories (include / exclude)
    const updatingCategories: Category[] = [];
    checkedCategories.forEach((checkedItem: Category) => {
      const existingItem = budgetCategories.find((item) => item.id === checkedItem.id);
      if (existingItem) {
        existingItem.title = checkedItem.title;
        existingItem.icon = checkedItem.icon;
        updatingCategories.push(existingItem);
      } else {
        updatingCategories.push(checkedItem);
      }
    });

    // update budgetCategory state
    if (setCategoryPlans) {
      setCategoryPlans(updatingCategories);
    } else {
      // TODO: 입력폼에서의 budget setting 시 고려
      //   dispatch(
      //     budgetActions.updateCategory({
      //       isExpense: isExpense,
      //       budgetId: budgetId,
      //       categories: updatingCategories,
      //     })
      //   );
      // }
      // if (sendRequest) {
      //   // consist request data - {categoryId, amountPlanned}[]
      //   const categoryReqData = updatingCategories.map((item) => {
      //     const { id, amount } = item;
      //     return {
      //       categoryId: id,
      //       amountPlanned: amount.planned,
      //     };
      //   });
      //   // send request
      //   const { categories: updatedCategories, excluded: excludedCategories } =
      //     await updateBudgetCategories(props.budgetId, props.isExpense, categoryReqData);
      //   // set state - updated category
      //   dispatch(
      //     budgetActions.setCategories({
      //       budgetId: props.budgetId,
      //       categories: updatedCategories,
      //     })
      //   );
      //   // set state - transactions updated category (excluded -> default)
      //   if (excludedCategories.length > 0) {
      //     const { transactions } = await getTransactions(props.budgetId);
      //     dispatch(transactionActions.setTransactions(transactions));
      //   }
    }
  };

  /** Close overlay */
  const closeHandler = () => {
    setIsOpen(false);
  };

  /** Set isEdit & Submit */
  const editHandler = async () => {
    if (isEdit) {
      submitHandler();
      setIsEdit(false);
    } else {
      setIsEdit(true);
    }
  };

  return (
    <Overlay
      className={`${classes.container} ${isEdit ? classes.edit : ''}`}
      isOpen={isOpen}
      closeHandler={closeHandler}
    >
      <form id="budget-category-setting-form" onSubmit={submitHandler}>
        {/* Header */}
        <div className={classes.header}>
          <h5>카테고리 목록 편집</h5>
          <Button
            styleClass="extra"
            className={isEdit ? classes.confirm : classes.pencil}
            onClick={editHandler}
          ></Button>
        </div>
        {/* List */}
        <ul className={classes.list}>
          {categories.map((item, i) =>
            isEdit ? (
              <CategoryEditItem
                key={item.id}
                idx={i}
                category={item}
                setCategories={setCategories}
                setCheckedCategoryIds={setCheckedCategoryIds}
              />
            ) : (
              <CategoryCheckItem
                key={item.id}
                category={item}
                checkedCategoryIds={checkedCategoryIds}
                setCheckedCategoryIds={setCheckedCategoryIds}
              />
            )
          )}
        </ul>
        {/* Add category & Edit default category */}
        {isEdit && (
          <>
            <CategoryAddButton isExpense={isExpense} setCategories={setCategories} />
            <DefaultCategoryEdit
              defaultCategory={defaultCategory}
              setDefaultCategory={setDefaultCategory}
            />
          </>
        )}
        {/* Confirm & Cancel */}
        <ConfirmCancelButtons
          onClose={closeHandler}
          confirmMsg={isEdit ? '수정 완료' : '카테고리 설정 완료'}
        />
      </form>
    </Overlay>
  );
  return <></>;
}

export default BudgetCategorySetting;
