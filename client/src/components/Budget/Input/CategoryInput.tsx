import React, { useEffect, useImperativeHandle, useMemo, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '../../../hooks/redux-hook';
import Category from '../../../models/Category';
import { uiActions } from '../../../store/ui';
import Select from '../../UI/Select';
import ExpenseTab from '../UI/ExpenseTab';
import classes from './CategoryInput.module.css';

interface CategoryInputProps {
  categoryId?: string;
  className?: string;
  setIcon?: React.Dispatch<string>;
  disabled?: boolean;
  setIsEditSetting: (isEdit: boolean) => void;
}

const CategoryInput = React.forwardRef(
  (
    { categoryId, className, setIcon, disabled, setIsEditSetting }: CategoryInputProps,
    ref
  ) => {
    const dispatch = useAppDispatch();
    const categoryRef = useRef<any>(null);

    useImperativeHandle(ref, () => {
      return {
        value: () => categoryRef.current!.value(),
      };
    });

    // Set category data
    const isExpense = useAppSelector((state) => state.ui.budget.isExpense);
    const storedCategories = useAppSelector((state) => state.budgetCategory);
    const filteredCategories = useMemo(
      () => (isExpense ? storedCategories.expense : storedCategories.income),
      [storedCategories, isExpense]
    );

    const categoryOptions = useMemo(
      () => getCategoryOptions(filteredCategories),
      [filteredCategories]
    );

    const defaultCategory = useMemo(
      () => filteredCategories.find((item) => item.isDefault) || filteredCategories[0],
      [filteredCategories]
    );

    const currentCategory = useMemo(
      () =>
        filteredCategories.find(
          (item) => item.id === categoryId || item.id === defaultCategory.id
        ),
      [categoryId]
    );

    // NOTE: 카테고리 목록 변경 시 기본 카테고리 아이콘으로 업데이트
    useEffect(() => {
      setIcon && setIcon(defaultCategory.icon);
    }, [categoryOptions]);

    // NOTE: 현재 카테고리 변경 시 아이콘 업데이트 (주의: 카테고리 목록 변경 - 기본 아이콘 업데이트 이후 동작해야 함)
    useEffect(() => {
      setIcon && setIcon(currentCategory?.icon || defaultCategory.icon);
    }, [currentCategory]);

    /** 카테고리 선택 시 아이콘 업데이트: 이모지 인풋 플레이스홀더 업데이트를 위한 핸들러 */
    const iconHandler = (selectedCategoryId?: string) => {
      const selectedCategory = filteredCategories.find(
        (item: Category) => item.id === selectedCategoryId
      );
      setIcon && setIcon(selectedCategory?.icon || '');
    };

    return (
      <>
        <Select
          ref={categoryRef}
          className={className}
          data={categoryOptions}
          defaultValue={categoryId || defaultCategory.id}
          onChange={iconHandler}
          showEdit={() => {
            dispatch(uiActions.setIsExpense(isExpense));
            setIsEditSetting(true);
          }}
          disabled={disabled}
        />
      </>
    );
  }
);

/** 카테고리 Select의 Options 엘리먼트를 반환 */
const getCategoryOptions = (categories: Category[]) => {
  const categoryOptions: any = categories.map((item: Category) => {
    return {
      value: item.id,
      label: `${item.icon} ${item.title}`,
    };
  });

  return [
    {
      element: (
        <ExpenseTab
          className={classes.tab}
          key="category-input-expense-tab"
          id="category-input-expense-tab"
        />
      ),
    },
    ...categoryOptions,
  ];
};

export default CategoryInput;
