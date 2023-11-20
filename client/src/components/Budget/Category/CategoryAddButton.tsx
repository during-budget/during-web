import { v4 as uuid } from 'uuid';
import Category from '../../../models/Category';
import Button from '../../UI/button/Button';

const CategoryAddButton = (props: {
  isExpense: boolean;
  setCategories: React.Dispatch<React.SetStateAction<Category[]>>;
  onAdd?: (category: Category) => void;
  afterAdd?: () => void;
}) => {
  const addHandler = async () => {
    const id = uuid();

    // 스크롤을 위한 await
    await props.setCategories((prev) => {
      const newCategory = new Category({
        id,
        title: '',
        icon: props.isExpense ? '💸' : '💰',
        isExpense: props.isExpense ? true : false,
        isDefault: false,
      });
      props.onAdd && props.onAdd(newCategory);
      return [...prev, newCategory];
    });

    props.afterAdd && props.afterAdd();

    // 스크롤
    const newCategory = document.getElementById(id);
    newCategory?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <Button styleClass="extra" style={{ height: '4rem' }} onClick={addHandler}>
      카테고리 추가
    </Button>
  );
};

export default CategoryAddButton;
