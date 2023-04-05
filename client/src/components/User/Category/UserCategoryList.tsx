import Category from '../../../models/Category';
import EmojiInput from '../../Budget/Input/EmojiInput';
import Button from '../../UI/Button';
import UserCategoryItem from './UserCategoryItem';
import classes from './UserCategoryList.module.css';
import { Droppable } from 'react-beautiful-dnd';
import { v4 as uuid } from 'uuid';

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
            const { id, title, isExpense, isDefault } = prev;
            return new Category({ id, icon, title, isExpense, isDefault });
        });
    };

    const defaultTitleHandler = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const title = event.target.value;

        props.setDefaultCategory((prev: Category) => {
            const { id, icon, isExpense, isDefault } = prev;
            return new Category({ id, icon, title, isExpense, isDefault });
        });
    };

    return (
        <Droppable droppableId="user-category-setting-droppable">
            {(provided) => {
                return (
                    <>
                        {/* current category list */}
                        <ul
                            ref={provided.innerRef}
                            className={`${classes.container} budget-category-setting-droppable`}
                            {...provided.droppableProps}
                        >
                            {props.categories.map((item, i) => (
                                <UserCategoryItem
                                    key={i}
                                    index={i}
                                    id={item.id}
                                    icon={item.icon}
                                    title={item.title}
                                    onRemove={removeHandler}
                                    setIcon={editIconHandler}
                                    setTitle={editTitleHandler}
                                />
                            ))}
                            {provided.placeholder}
                        </ul>
                        {/* add category button */}
                        <Button
                            styleClass="extra"
                            className={classes.add}
                            onClick={addHandler}
                        >
                            카테고리 추가
                        </Button>
                        {/* default category input */}
                        <div className={classes.default}>
                            <div className={classes.inputs}>
                                <EmojiInput
                                    className={classes.icon}
                                    value={props.defaultCategory?.icon}
                                    onChange={defaultIconHandler}
                                    isDark={true}
                                    required={true}
                                ></EmojiInput>
                                <input
                                    className={classes.title}
                                    type="text"
                                    value={props.defaultCategory?.title}
                                    onChange={defaultTitleHandler}
                                    required
                                />
                            </div>
                            <span className={classes.label}>기본</span>
                        </div>
                    </>
                );
            }}
        </Droppable>
    );
}

export default UserCategoryList;
