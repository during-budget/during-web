import React from 'react';
import Category from '../../../models/Category';
import classes from './BudgetCategorySettingItem.module.css';
import EmojiInput from '../Input/EmojiInput';
import Button from '../../UI/Button';

interface CategoryEditItemProps {
  idx: number;
  category: Category;
  setCategories: React.Dispatch<React.SetStateAction<Category[]>>;
  setCheckedCategoryIds: React.Dispatch<React.SetStateAction<Map<string, boolean>>>;
}

const CategoryEditItem = ({
  idx,
  category,
  setCategories,
  setCheckedCategoryIds,
}: CategoryEditItemProps) => {
  const editIconHandler = (idx: number, icon: string) => {
    setCategories((prev) => {
      const next = [...prev];
      next[idx].icon = icon;
      return next;
    });
  };

  const editTitleHandler = (idx: number, title: string) => {
    setCategories((prev) => {
      const next = [...prev];
      next[idx].title = title;
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

  return (
    <li id={category.id} className={`${classes.contianer} ${classes.edit}`}>
      <div className={classes.info}>
        <EmojiInput
          className={classes.icon}
          value={category.icon}
          onChange={(value: string) => {
            editIconHandler(idx, value);
          }}
          required={true}
        ></EmojiInput>
        <input
          className={classes.title}
          type="text"
          value={category.title}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            editTitleHandler(idx, event.target.value);
          }}
          required
        />
      </div>
      <Button
        className={classes.trash}
        styleClass="extra"
        onClick={() => {
          removeHandler(idx);
        }}
      />
    </li>
  );
};

export default CategoryEditItem;
