import { v4 as uuid } from 'uuid';
import Category from '../../../models/Category';
import EmojiInput from '../../Budget/Input/EmojiInput';
import Button from '../../UI/Button';
import DraggableItem from '../../UI/DraggableItem';
import DraggableList from '../../UI/DraggableList';
import classes from './UserCategoryList.module.css';

function UserCategoryList(props: {
  isExpense: boolean;
  categories: Category[];
  defaultCategory?: Category;
  setCategories: (func: any) => void;
  setDefaultCategory: (func: any) => void;
}) {
  const editIconHandler = (idx: number, icon: string) => {
    props.setCategories((prev: Category[]) => {
      const next = [...prev];
      next[idx].icon = icon;
      return next;
    });
  };

  const editTitleHandler = (idx: number, title: string) => {
    props.setCategories((prev: Category[]) => {
      const next = [...prev];
      next[idx].title = title;
      return next;
    });
  };

  const addHandler = async () => {
    const id = uuid();
    await props.setCategories((prev: Category[]) => {
      const newCategory = new Category({
        id,
        title: '',
        icon: props.isExpense ? '💸' : '💰',
        isExpense: props.isExpense ? true : false,
        isDefault: false,
      });

      return [...prev, newCategory];
    });

    const newCategory = document.getElementById(id);
    newCategory?.scrollIntoView({ behavior: 'smooth' });
  };

  const removeHandler = (idx: number) => {
    props.setCategories((prev: Category[]) => {
      return [...prev.slice(0, idx), ...prev.slice(idx + 1, prev.length)];
    });
  };

  const defaultIconHandler = (icon: string) => {
    props.setDefaultCategory((prev: Category) => {
      return Category.clone(prev, { icon });
    });
  };

  const defaultTitleHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const title = event.target.value;

    props.setDefaultCategory((prev: Category) => {
      return Category.clone(prev, { title });
    });
  };

  return (
    <>
      <DraggableList
        id="user-category-setting-list"
        className={classes.list}
        list={props.categories}
        setList={props.setCategories}
      >
        {props.categories.map((item, i) => (
          <DraggableItem
            key={item.id}
            idx={i}
            id={item.id}
            className={classes.info}
            onRemove={removeHandler}
          >
            <EmojiInput
              className={classes.icon}
              value={item.icon}
              onChange={(value: string) => {
                editIconHandler(i, value);
              }}
              required={true}
            ></EmojiInput>
            <input
              className={classes.title}
              type="text"
              value={item.title}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                editTitleHandler(i, event.target.value)
              }
              required
            />
          </DraggableItem>
        ))}
      </DraggableList>
      {/* TODO: 카테고리 추가 / 디폴트 에디팅 모두 컴포넌트로 빼내서 정리하기 */}
      {/* add category button */}
      <Button styleClass="extra" className={classes.add} onClick={addHandler}>
        카테고리 추가
      </Button>
      {/* default category input */}
      <div className={classes.default}>
        <div className={classes.inputs}>
          <EmojiInput
            className={classes.icon}
            value={props.defaultCategory?.icon || ''}
            onChange={defaultIconHandler}
            isDark={true}
            required={true}
          ></EmojiInput>
          <input
            className={classes.title}
            type="text"
            value={props.defaultCategory?.title || ''}
            onChange={defaultTitleHandler}
            required
          />
        </div>
        <span className={classes.label}>기본</span>
      </div>
    </>
  );
}

export default UserCategoryList;
