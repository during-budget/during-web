import { useDispatch, useSelector } from 'react-redux';
import classes from './BudgetCategorySetting.module.css';
import ConfirmCancelButtons from '../../UI/ConfirmCancelButtons';
import Overlay from '../../UI/Overlay';
import StatusHeader from '../Status/StatusHeader';
import { useEffect, useState } from 'react';
import Category from '../../../models/Category';
import CategorySettingItem from './CategorySettingItem';
import Button from '../../UI/Button';
import { categoryActions } from '../../../store/category';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import { budgetActions } from '../../../store/budget';

function BudgetCategorySetting(props: {
    budgetId: string;
    isOpen: boolean;
    setIsOpen: (value: boolean) => void;
    setCheckedCategories?: (checked: Category[]) => void;
    checkedIds?: string[];
    isExpense?: boolean;
}) {
    const dispatch = useDispatch();

    const allCategories = useSelector((state: any) => state.category);

    const [categories, setCategories] = useState<Category[]>([]);
    const [checkedCategoryIds, setCheckedCategoryIds] = useState<
        Map<string, boolean>
    >(new Map());

    // Set categories
    useEffect(() => {
        // current categories
        const categories = allCategories.filter(
            (item: Category) => item.isExpense === props.isExpense
        );
        setCategories(categories);

        // checked categories
        setCheckedCategoryIds(
            new Map(
                categories.map((item: Category) => [
                    item.id,
                    props.checkedIds?.includes(item.id),
                ])
            )
        );
    }, [allCategories, props.isExpense, props.isOpen]);

    // Set checked from setting items
    const setCheckedId = (id: string, checked: boolean) => {
        setCheckedCategoryIds((prev) => {
            const next = new Map(prev);

            next.set(id, checked);

            return next;
        });
    };

    // Handlers - form
    const submitHandler = (event: React.FormEvent) => {
        event.preventDefault();

        // edited
        dispatch(
            categoryActions.updateCategories({
                isExpense: props.isExpense,
                categories,
            })
        );
        dispatch(
            budgetActions.updateCategoryFromSetting({
                budgetId: props.budgetId,
                categories,
            })
        );

        // checked
        const checkedCategories: Category[] = [];

        checkedCategoryIds.forEach((value, key) => {
            if (value) {
                const category = allCategories.find(
                    (item: Category) => item.id === key
                );
                category && checkedCategories.push(category);
            }
        });

        props.setCheckedCategories &&
            props.setCheckedCategories(checkedCategories);
        props.setIsOpen(false);
    };

    const closeHandler = () => {
        props.setIsOpen(false);
    };

    // Hanlders - item
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
        const id = (+new Date()).toString();
        await setCategories((prev) => {
            const newCategory = new Category({
                id,
                title: '',
                icon: props.isExpense ? '💸' : '💰',
                isExpense:
                    props.isExpense === undefined || props.isExpense
                        ? true
                        : false,
                isDefault: false,
            });

            setCheckedCategoryIds((prev) => {
                const nextMap = new Map(prev);
                nextMap.set(newCategory.id, true); // id 개선.. uuid 같은 거 써야할듯..?
                return nextMap;
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

    const sortHandler = (result: any) => {
        if (!result.destination) return;
        const items = [...categories];
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);
        setCategories(items);
    };

    return (
        <Overlay
            className={classes.container}
            isOpen={props.isOpen}
            isShowBackdrop={true}
            closeHandler={closeHandler}
        >
            <form onSubmit={submitHandler}>
                <StatusHeader id="category-setting" title="카테고리 설정" />
                <DragDropContext onDragEnd={sortHandler}>
                    <Droppable droppableId="budget-category-setting-droppable">
                        {(provided) => {
                            return (
                                <ul
                                    ref={provided.innerRef}
                                    className={`${classes.list} budget-category-setting-droppable`}
                                    {...provided.droppableProps}
                                >
                                    {categories.map((category, i) => (
                                        <Draggable
                                            draggableId={`draggable-${i}`}
                                            index={i}
                                            key={`draggable-${i}`}
                                        >
                                            {(provided, snapshot) => {
                                                var transform =
                                                    provided.draggableProps!
                                                        .style!.transform;
                                                if (transform) {
                                                    var t =
                                                        transform.split(',')[1];
                                                    provided.draggableProps!.style!.transform =
                                                        'translate(0px,' + t;
                                                }
                                                return (
                                                    <div
                                                        {...provided.draggableProps}
                                                        ref={provided.innerRef}
                                                    >
                                                        <CategorySettingItem
                                                            handleProps={
                                                                provided.dragHandleProps
                                                            }
                                                            isDragging={
                                                                snapshot.isDragging
                                                            }
                                                            key={i}
                                                            idx={i}
                                                            id={category.id}
                                                            icon={category.icon}
                                                            title={
                                                                category.title
                                                            }
                                                            isDefault={
                                                                category.isDefault
                                                            }
                                                            setIcon={
                                                                editIconHandler
                                                            }
                                                            setTitle={
                                                                editTitleHandler
                                                            }
                                                            isChecked={checkedCategoryIds.get(
                                                                category.id
                                                            )}
                                                            onRemove={
                                                                removeHandler
                                                            }
                                                            setIsChecked={
                                                                props.setCheckedCategories &&
                                                                setCheckedId
                                                            }
                                                        />
                                                    </div>
                                                );
                                            }}
                                        </Draggable>
                                    ))}
                                    {provided.placeholder}
                                </ul>
                            );
                        }}
                    </Droppable>
                </DragDropContext>
                <Button
                    className={classes.add}
                    styleClass="extra"
                    onClick={addHandler}
                >
                    카테고리 추가
                </Button>
                <ConfirmCancelButtons
                    onClose={closeHandler}
                    confirmMsg="카테고리 설정 완료"
                />
            </form>
        </Overlay>
    );
}

export default BudgetCategorySetting;
