import Category from '../../../models/Category';
import EmojiInput from '../../UI/EmojiInput';
import classes from './DefaultCategoryEdit.module.css';

interface DefaultCategoryEditProps {
  defaultCategory: Category;
  setDefaultCategory: React.Dispatch<React.SetStateAction<Category>>;
}

const DefaultCategoryEdit = ({
  defaultCategory,
  setDefaultCategory,
}: DefaultCategoryEditProps) => {
  const defaultIconHandler = (icon: string) => {
    setDefaultCategory((prev) => {
      const { id, title, isExpense, isDefault } = prev;
      return new Category({ id, icon, title, isExpense, isDefault });
    });
  };

  const defaultTitleHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const title = event.target.value;
    setDefaultCategory((prev: Category) => {
      const { id, icon, isExpense, isDefault } = prev;
      return new Category({ id, icon, title, isExpense, isDefault });
    });
  };

  return (
    <div className={classes.container}>
      <div className={classes.inputs}>
        <EmojiInput
          className={classes.icon}
          value={defaultCategory?.icon}
          onChange={defaultIconHandler}
          required={true}
        ></EmojiInput>
        <input
          className={classes.title}
          type="text"
          value={defaultCategory?.title}
          onChange={defaultTitleHandler}
          required
        />
      </div>
      <span className={classes.label}>기본</span>
    </div>
  );
};

export default DefaultCategoryEdit;
