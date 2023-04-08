import { v4 as uuid } from 'uuid';
import classes from './BudgetCategorySetting.module.css';
import Category from '../../../models/Category';
import Overlay from '../../UI/Overlay';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import Icon from '../../UI/Icon';
import ConfirmCancelButtons from '../../UI/ConfirmCancelButtons';
import Button from '../../UI/Button';
import EmojiInput from '../Input/EmojiInput';
import { updateCategories } from '../../../util/api/categoryAPI';
import category, { categoryActions } from '../../../store/category';
import { useDispatch } from 'react-redux';
import { budgetActions } from '../../../store/budget';
import Budget from '../../../models/Budget';
import { updateBudgetCategories } from '../../../util/api/budgetAPI';
import { transactionActions } from '../../../store/transaction';
import { getTransactions } from '../../../util/api/transactionAPI';

function BudgetCategorySetting(props: {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    budgetId: string;
    isExpense: boolean;
    sendRequest?: boolean;
    setCategoryPlans?: (plans: any[]) => void;
}) {
    const dispatch = useDispatch();

    // Set category data
    const allCategories = useSelector((state: any) => state.category);

    const budgets = useSelector((state: any) => state.budget.data);
    const budget = budgets.find((item: Budget) => item.id === props.budgetId);
    const budgetCategories = budget?.categories || [];

    const [isEdit, setIsEdit] = useState(false);
    const [categories, setCategories] = useState<Category[]>([]);
    const [defaultCategory, setDefaultCategory] = useState<
        Category | undefined
    >(undefined);
    const [checkedCategoryIds, setCheckedCategoryIds] = useState<
        Map<string, boolean>
    >(new Map());

    // Set categories
    useEffect(() => {
        // current categories
        const categories = allCategories.filter(
            (item: Category) =>
                item.isExpense === props.isExpense && !item.isDefault
        );
        setCategories(categories);

        // default category
        const currentDefault = allCategories.find(
            (item: Category) =>
                item.isDefault && item.isExpense === props.isExpense
        );
        setDefaultCategory(currentDefault);

        // checked categories
        const checkedIds = budgetCategories.map((item: Category) => item.id);
        setCheckedCategoryIds(
            new Map(
                categories.map((item: Category) => [
                    item.id,
                    checkedIds?.includes(item.id),
                ])
            )
        );

        // init edit mode
        if (props.isOpen) {
            setIsEdit(false);
        }
    }, [allCategories, props.isExpense, props.isOpen]);

    // Form handlers (checked)
    const submitHandler = async (event?: React.FormEvent) => {
        event?.preventDefault();

        if (isEdit) {
            // gather category data
            const otherCategories = allCategories.filter(
                (item: Category) =>
                    item.isExpense === !props.isExpense && !item.isDefault
            );

            const updatingCategories = [...categories, ...otherCategories];
            if (defaultCategory) {
                updatingCategories.push(defaultCategory);
            }

            // send requeset
            const {
                categories: updatedCategories,
                removed: removedCategories,
            } = await updateCategories(updatingCategories);

            // update transaction state (removed category -> default category)
            if (removedCategories.length > 0) {
                const { transactions } = await getTransactions(props.budgetId);

                dispatch(
                    transactionActions.setBudgetTransactions({
                        budgetId: props.budgetId,
                        transactions,
                    })
                );
            }

            // update state
            dispatch(categoryActions.setCategories(updatedCategories));
            dispatch(
                budgetActions.updateCategoryFromSetting({
                    budgetId: props.budgetId,
                    categories: updatedCategories,
                })
            );
        } else {
            // checkedId -> checkedCategories
            const checkedCategories: Category[] = [];

            checkedCategoryIds.forEach((isChecked, key) => {
                if (isChecked) {
                    const category = categories.find(
                        (item: Category) => item.id === key
                    );
                    category && checkedCategories.push(category);
                }
            });

            // checkedCategories -> update budget categories (include / exclude)
            const updatingCategories: Category[] = [];
            checkedCategories.forEach((checkedItem: Category) => {
                const existingItem = budgetCategories.find(
                    (item: Category) => item.id === checkedItem.id
                );
                if (existingItem) {
                    updatingCategories.push(existingItem);
                } else {
                    updatingCategories.push(checkedItem);
                }
            });

            // update budgetCategory state
            if (props.setCategoryPlans) {
                const updatingPlans = updatingCategories.map((category) => {
                    const { id, icon, title, amount } = category;
                    return { id, icon, title, plan: amount.planned };
                });
                props.setCategoryPlans(updatingPlans);
            } else {
                dispatch(
                    budgetActions.updateCategory({
                        isExpense: props.isExpense,
                        budgetId: props.budgetId,
                        categories: updatingCategories,
                    })
                );
            }

            if (props.sendRequest) {
                // consist request data - {categoryId, amountPlanned}[]
                const categoryReqData = updatingCategories.map((item) => {
                    const { id, amount } = item;
                    return {
                        categoryId: id,
                        amountPlanned: amount.planned,
                    };
                });

                // send request
                const {
                    categories: updatedCategories,
                    excluded: excludedCategories,
                } = await updateBudgetCategories(
                    props.budgetId,
                    props.isExpense,
                    categoryReqData
                );

                // set state - updated category
                dispatch(
                    budgetActions.setCategories({
                        budgetId: props.budgetId,
                        categories: updatedCategories,
                    })
                );

                // set state - transactions updated category (excluded -> default)
                if (excludedCategories.length > 0) {
                    const { transactions } = await getTransactions(
                        props.budgetId
                    );

                    dispatch(
                        transactionActions.setBudgetTransactions({
                            budgetId: props.budgetId,
                            transactions,
                        })
                    );
                }
            }

            // close overlay
            closeHandler();
        }
    };

    const closeHandler = () => {
        props.setIsOpen(false);
    };

    // Checked handler
    const checkedHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        const id = event.target.value;
        const isChecked = event.target.checked;

        setCheckedCategoryIds((prev) => {
            const next = new Map(prev);

            next.set(id, isChecked);

            return next;
        });
    };

    // Edit handlers
    const editHandler = async () => {
        if (isEdit) {
            submitHandler();
            setIsEdit(false);
        } else {
            setIsEdit(true);
        }
    };

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

    const addHandler = async () => {
        const id = uuid();
        await setCategories((prev) => {
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

    // Default Handlers
    const defaultIconHandler = (icon: string) => {
        setDefaultCategory((prev: Category | undefined) => {
            if (prev) {
                const { id, title, isExpense, isDefault } = prev;
                return new Category({ id, icon, title, isExpense, isDefault });
            }
        });
    };

    const defaultTitleHandler = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const title = event.target.value;

        setDefaultCategory((prev: Category | undefined) => {
            if (prev) {
                const { id, icon, isExpense, isDefault } = prev;
                return new Category({ id, icon, title, isExpense, isDefault });
            }
        });
    };

    return (
        <Overlay
            className={`${classes.container} ${isEdit ? classes.edit : ''}`}
            isOpen={props.isOpen}
            isShowBackdrop={true}
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
                    {categories.map((item, i) => (
                        <li
                            key={i}
                            id={item.id}
                            className={`${classes.item} ${
                                isEdit ? classes.edit : ''
                            }`}
                        >
                            {!isEdit && (
                                <input
                                    className={classes.check}
                                    type="checkbox"
                                    name="category-setting"
                                    checked={checkedCategoryIds.get(item.id)}
                                    onChange={checkedHandler}
                                    value={item.id}
                                />
                            )}
                            {isEdit ? (
                                <div className={classes.info}>
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
                                        onChange={(
                                            event: React.ChangeEvent<HTMLInputElement>
                                        ) => {
                                            editTitleHandler(
                                                i,
                                                event.target.value
                                            );
                                        }}
                                        required
                                    />
                                </div>
                            ) : (
                                <div className={classes.info}>
                                    <Icon className={classes.icon}>
                                        {item.icon}
                                    </Icon>
                                    <span className={classes.title}>
                                        {item.title}
                                    </span>
                                </div>
                            )}
                            {isEdit && (
                                <Button
                                    className={classes.trash}
                                    styleClass="extra"
                                    onClick={() => {
                                        removeHandler(i);
                                    }}
                                />
                            )}
                        </li>
                    ))}
                </ul>
                {isEdit && (
                    <>
                        {/* Add Category Button */}
                        <Button
                            styleClass="extra"
                            className={classes.add}
                            onClick={addHandler}
                        >
                            카테고리 추가
                        </Button>
                        {/* Default category input */}
                        <div className={classes.default}>
                            <div className={classes.inputs}>
                                <EmojiInput
                                    className={classes.icon}
                                    value={defaultCategory?.icon}
                                    onChange={defaultIconHandler}
                                    isDark={true}
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
}

export default BudgetCategorySetting;
