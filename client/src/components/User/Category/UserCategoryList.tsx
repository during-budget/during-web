import Category from '../../../models/Category';
import Button from '../../UI/Button';
import UserCategoryItem from './UserCategoryItem';
import classes from './UserCategoryList.module.css';
import { Droppable } from 'react-beautiful-dnd';
import { v4 as uuid } from 'uuid';

function UserCategoryList(props: {
    isExpense: boolean;
    categories: Category[];
    setCategories: (func: any) => void;
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
        props.setCategories((prev: Category[]) => {
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

    return (
        <Droppable droppableId="user-category-setting-droppable">
            {(provided) => {
                return (
                    <>
                        <ul
                            ref={provided.innerRef}
                            className={`${classes.container} budget-category-setting-droppable`}
                            {...provided.droppableProps}
                        >
                            {props.categories.map((item, i) => (
                                <UserCategoryItem
                                    key={i}
                                    index={i}
                                    icon={item.icon}
                                    title={item.title}
                                    onRemove={removeHandler}
                                    setIcon={editIconHandler}
                                    setTitle={editTitleHandler}
                                />
                            ))}
                            {provided.placeholder}
                        </ul>
                        <Button styleClass="extra" onClick={addHandler}>
                            카테고리 추가
                        </Button>
                    </>
                );
            }}
        </Droppable>
    );
}

export default UserCategoryList;
