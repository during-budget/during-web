import classes from './UserCategorySetting.module.css';
import ExpenseTab from '../../Budget/UI/ExpenseTab';
import Overlay from '../../UI/Overlay';
import { useEffect, useState } from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import { useDispatch, useSelector } from 'react-redux';
import Category from '../../../models/Category';
import UserCategoryList from './UserCategoryList';
import ConfirmCancelButtons from '../../UI/ConfirmCancelButtons';
import { updateCategories } from '../../../util/api/categoryAPI';
import { categoryActions } from '../../../store/category';

function UserCategorySetting(props: {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
}) {
    const dispatch = useDispatch();

    const allCategories = useSelector((state: any) => state.category);

    const [isExpense, setIsExpense] = useState(true);
    const [expenseCategories, setExpenseCategories] = useState<Category[]>([]);
    const [incomeCategories, setIncomeCategories] = useState<Category[]>([]);

    // Set categories
    useEffect(() => {
        setExpenseCategories([]);
        setIncomeCategories([]);

        allCategories.forEach((item: Category) => {
            if (item.isDefault) {
                return;
            }

            if (item.isExpense) {
                setExpenseCategories((prev) => [...prev, item]);
            } else {
                setIncomeCategories((prev) => [...prev, item]);
            }
        });
    }, [allCategories, props.isOpen]);

    // Form handlers
    const submitHandler = async (event: React.FormEvent) => {
        event.preventDefault();

        const { categories } = await updateCategories([
            ...expenseCategories,
            ...incomeCategories,
        ]);

        dispatch(categoryActions.setCategories(categories));

        props.setIsOpen(false);
    };

    const closeHandler = () => {
        props.setIsOpen(false);
    };

    // Sort handler (reorder result)
    const sortHandler = (result: any) => {
        if (!result.destination) return;

        if (isExpense) {
            setExpenseCategories((prev) => {
                return getSortedCategories(result, prev);
            });
        } else {
            setIncomeCategories((prev) => {
                return getSortedCategories(result, prev);
            });
        }
    };

    const getSortedCategories = (result: any, prev: Category[]) => {
        const items = [...prev];
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);
        return items;
    };

    return (
        <Overlay
            className={classes.container}
            isOpen={props.isOpen}
            closeHandler={closeHandler}
            isShowBackdrop={true}
        >
            <form onSubmit={submitHandler}>
                <div className={classes.header}>
                    <h5>카테고리 설정</h5>
                    <ExpenseTab
                        id="user-cateogry-setting-type"
                        isExpense={isExpense}
                        setIsExpense={setIsExpense}
                    />
                </div>
                <DragDropContext onDragEnd={sortHandler}>
                    <UserCategoryList
                        isExpense={isExpense}
                        categories={
                            isExpense ? expenseCategories : incomeCategories
                        }
                        setCategories={
                            isExpense
                                ? setExpenseCategories
                                : setIncomeCategories
                        }
                    />
                </DragDropContext>
                <ConfirmCancelButtons
                    onClose={closeHandler}
                    confirmMsg="완료"
                />
            </form>
        </Overlay>
    );
}

export default UserCategorySetting;
