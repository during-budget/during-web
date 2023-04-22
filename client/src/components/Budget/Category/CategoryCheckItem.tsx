import React from 'react';
import Category from '../../../models/Category';
import Icon from '../../UI/Icon';
import classes from './BudgetCategorySettingItem.module.css';

interface CategoryEditItemProps {
  category: Category;
  checkedCategoryIds: Map<string, boolean>;
  setCheckedCategoryIds: React.Dispatch<React.SetStateAction<Map<string, boolean>>>;
}

const CategoryCheckItem = ({
  category,
  checkedCategoryIds,
  setCheckedCategoryIds,
}: CategoryEditItemProps) => {
  const checkedHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const id = event.target.value;
    const isChecked = event.target.checked;
    setCheckedCategoryIds((prev) => {
      const next = new Map(prev);
      next.set(id, isChecked);
      return next;
    });
  };

  return (
    // TODO: uncontrolled to controlled 오류 -> change undfined to defined value 경고 해결
    <li id={category.id} className={classes.container}>
      <input
        id={`check-${category.id}`}
        className={classes.check}
        type="checkbox"
        name="category-setting"
        checked={checkedCategoryIds.get(category.id)}
        onChange={checkedHandler}
        value={category.id}
      />
      <label htmlFor={`check-${category.id}`} className={classes.info}>
        <Icon className={classes.icon}>{category.icon}</Icon>
        <span className={classes.title}>
          {category.title}
        </span>
      </label>
    </li>
  );
};

export default CategoryCheckItem;
