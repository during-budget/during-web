import { useEffect, useState } from 'react';
import classes from './CategoryPlan.module.css';
import Category from '../../../models/Category';
import { uiActions } from '../../../store/ui';
import ConfirmCancelButtons from '../../UI/ConfirmCancelButtons';
import Overlay from '../../UI/Overlay';
import Amount from '../../../models/Amount';
import Button from '../../UI/Button';
import EditInput from '../Input/EditInput';
import { budgetActions } from '../../../store/budget';
import {
    updateBudgetFields,
    updateBudgetCategories,
} from '../../../util/api/budgetAPI';
import AmountBars from '../Amount/AmountBars';
import BudgetCategorySetting from './BudgetCategorySetting';
import { DragDropContext } from 'react-beautiful-dnd';
import { getTransactions } from '../../../util/api/transactionAPI';
import { transactionActions } from '../../../store/transaction';
import CategoryPlanList from './CategoryPlanList';
import { useAppDispatch, useAppSelector } from '../../../hooks/redux-hook';

function CategoryPlan(props: {
    budgetId: string;
    title: string;
    total: any;
    categories: Category[];
}) {
    const dispatch = useAppDispatch();

    // Boolean state
    const isOpen = useAppSelector(
        (state) => state.ui.budget.category.isEditPlan
    );
    const isExpense = useAppSelector((state) => state.ui.budget.isExpense);
    const [isEditSetting, setIsEditSetting] = useState(false);

    // Amount state
    const [totalPlan, setTotalPlan] = useState<number>(-1);
    const [categoryPlans, setCategoryPlans] = useState<
        { id: string; icon: string; title: string; plan: number }[]
    >([]);
    const [leftAmount, setLeftAmountState] = useState(0);
    const [defaultCategory, setDefaultCategory] = useState<Category | null>(
        null
    );

    useEffect(() => {
        setTotalPlan(props.total[isExpense ? 'expense' : 'income']);
    }, [isExpense]);

    // Set state - categoryPlan
    useEffect(() => {
        // category plan
        setCategoryPlans([]);

        props.categories.forEach((item: Category) => {
            const isSameType = item.isExpense === isExpense;
            const isDefault = item.isDefault;

            if (isSameType) {
                if (isDefault) {
                    setDefaultCategory(item);
                } else {
                    setCategoryPlans((prev: any) => {
                        const { id, icon, title, amount } = item;

                        const newItem = {
                            id,
                            icon,
                            title,
                            plan: amount?.planned || 0,
                        };

                        // NOTE: 이미 존재하는 경우(편집중인 경우) 기존 값 사용
                        const isExist = categoryPlans.find(
                            (plan) => plan.id === id
                        );

                        if (isExist && !isOpen) {
                            newItem.plan = isExist.plan;
                        }

                        return [...prev, newItem];
                    });
                }
            }
        });

        // left
        setLeftAmount();
    }, [props.categories, isExpense, isOpen]);

    // Set state - leftAmount
    useEffect(() => {
        setLeftAmount();
    }, [totalPlan, categoryPlans]);

    const setLeftAmount = () => {
        const totalCategoryPlan = categoryPlans.reduce(
            (prev, curr) => prev + curr.plan,
            0
        );
        setLeftAmountState(totalPlan - totalCategoryPlan);
    };

    // Handlers for Overlay
    const closeHandler = () => {
        dispatch(
            uiActions.showCategoryPlanEditor({ isExpense, isEditPlan: false })
        );
    };

    const submitHandler = async (event: React.FormEvent) => {
        event.preventDefault();

        // total - request
        const key = isExpense ? 'expensePlanned' : 'incomePlanned';

        updateBudgetFields(props.budgetId, {
            [key]: +totalPlan,
        });

        // total - set
        dispatch(
            budgetActions.updateTotalPlan({
                budgetId: props.budgetId,
                isExpense,
                amount: +totalPlan,
            })
        );

        // category - request
        const categoryReqData = categoryPlans.map((item) => {
            const { id, plan } = item;
            return {
                categoryId: id,
                amountPlanned: plan,
            };
        });

        const { categories, excluded } = await updateBudgetCategories(
            props.budgetId,
            isExpense,
            categoryReqData
        );

        // category - set category
        dispatch(
            budgetActions.setCategories({
                budgetId: props.budgetId,
                categories,
            })
        );

        // category - set transactions updated category
        if (excluded.length > 0) {
            const { transactions } = await getTransactions(props.budgetId);
            dispatch(transactionActions.setTransactions(transactions));
        }

        // close
        dispatch(
            uiActions.showCategoryPlanEditor({ isExpense, isEditPlan: false })
        );
    };

    // Handlers for total plan
    const confirmTotalHandler = (total: string) => {
        setTotalPlan(+total.replace(/[^0-9]+/g, ''));
    };

    const focusTotalHandler = (event: React.FocusEvent<HTMLInputElement>) => {
        const value = event.target.value.replace(/[^0-9]+/g, '');
        event.target.value = value;
    };

    // Handler for category plan
    const changeCategoryPlanHandler = (i: number, value: number) => {
        const newPlan = { ...categoryPlans[i], plan: value };
        setCategoryPlans(
            (
                prev: {
                    id: string;
                    icon: string;
                    title: string;
                    plan: number;
                }[]
            ) => {
                if (i === 0) {
                    return [newPlan, ...prev.slice(1, prev.length)];
                } else {
                    return [
                        ...prev.slice(0, i),
                        newPlan,
                        ...prev.slice(i + 1, prev.length),
                    ];
                }
            }
        );
    };

    const sortHandler = (result: any) => {
        if (!result.destination) return;
        const items = [...categoryPlans];
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);
        setCategoryPlans(items);
    };

    return (
        <>
            <Overlay
                className={`${classes.container} ${isOpen ? classes.open : ''}`}
                isOpen={isOpen}
                isShowBackdrop={true}
                closeHandler={closeHandler}
            >
                <form className={classes.content} onSubmit={submitHandler}>
                    {/* header */}
                    <h5>{`${props.title} 카테고리별 ${
                        isExpense ? '지출' : '수입'
                    } 목표`}</h5>
                    {/* total */}
                    <EditInput
                        className={classes.total}
                        editClass={classes.totalEdit}
                        cancelClass={classes.totalCancel}
                        value={Amount.getAmountStr(+totalPlan)}
                        onFocus={focusTotalHandler}
                        confirmHandler={confirmTotalHandler}
                    />
                    <AmountBars
                        className={classes.bars}
                        borderRadius="0.4rem"
                        amountData={[
                            ...categoryPlans.map((item) => {
                                return { label: item.icon, amount: item.plan };
                            }),
                            {
                                label: defaultCategory?.icon || '',
                                amount: leftAmount,
                            },
                        ]}
                    />
                    {/* categories */}
                    <ul className={classes.list}>
                        <h5>목표 예산</h5>
                        <DragDropContext onDragEnd={sortHandler}>
                            <CategoryPlanList
                                categoryPlans={categoryPlans}
                                changeCategoryPlanHandler={
                                    changeCategoryPlanHandler
                                }
                            />
                        </DragDropContext>
                    </ul>
                    {/* left */}
                    <div className={classes.left}>
                        <h6>{`${defaultCategory?.icon} ${defaultCategory?.title} (남은 금액)`}</h6>
                        <p>{Amount.getAmountStr(leftAmount)}</p>
                    </div>
                    <Button
                        className={classes.edit}
                        styleClass="extra"
                        onClick={() => {
                            setIsEditSetting(true);
                        }}
                    >
                        카테고리 목록 편집
                    </Button>
                    <ConfirmCancelButtons
                        onClose={closeHandler}
                        confirmMsg="목표 설정 완료"
                    />
                </form>
            </Overlay>
            <BudgetCategorySetting
                budgetId={props.budgetId}
                isExpense={isExpense}
                isOpen={isEditSetting}
                setIsOpen={setIsEditSetting}
                setCategoryPlans={setCategoryPlans}
            />
        </>
    );
}

export default CategoryPlan;
