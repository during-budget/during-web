import { useEffect, useState } from 'react';
import classes from './CategoryStatus.module.css';
import Amount from '../../../models/Amount';
import Category from '../../../models/Category';
import StatusHeader from './StatusHeader';
import AmountBars from '../Amount/AmountBars';
import AmountDetail from '../Amount/AmountDetail';
import IndexNav from '../../UI/IndexNav';
import Button from '../../UI/Button';
import { useDispatch, useSelector } from 'react-redux';
import { budgetActions } from '../../../store/budget';
import { updateCategoryPlan } from '../../../util/api/budgetAPI';
import { uiActions } from '../../../store/ui';
import ExpenseTab from '../UI/ExpenseTab';

function CategoryStatus(props: { budgetId: string; categories: Category[] }) {
    const dispatch = useDispatch();

    const isExpense = useSelector((state: any) => state.ui.budget.isExpense);

    const filteredCategories = props.categories.filter((item: Category) =>
        isExpense ? item.isExpense : !item.isExpense
    );

    const [currentCategoryIdx, setCurrentCategoryIdx] = useState(0);
    const [categories, setCategories] = useState(filteredCategories);

    const categoryNames = categories.map((item) => {
        return `${item.icon} ${item.title}`;
    });

    const updatePlan = async (amountStr: string) => {
        const amount = +amountStr;
        const categoryId = categories[currentCategoryIdx].id;

        // Send request
        const { budget } = await updateCategoryPlan(
            props.budgetId,
            categoryId,
            amount
        );

        // Update budget state (for plan update)
        dispatch(
            budgetActions.updateBudget({ budgetId: props.budgetId, budget })
        );
    };

    useEffect(() => {
        // init index
        setCurrentCategoryIdx(0);

        // filter category
        const filteredCategories = props.categories.filter((item: Category) =>
            isExpense ? item.isExpense : !item.isExpense
        );

        // set category
        setCategories(filteredCategories);
    }, [props.categories, isExpense]);

    return (
        <>
            <StatusHeader
                id="category-status-type"
                title="카테고리별 현황"
                tab={
                    <ExpenseTab
                        id="category-status-type-tab"
                        isExpense={isExpense}
                        setIsExpense={(isExpense: boolean) => {
                            dispatch(uiActions.setIsExpense(isExpense));
                        }}
                    />
                }
            />
            <AmountBars
                amountData={categories.map((item: Category, i) => {
                    return {
                        amount: item.amount || new Amount(0, 0, 0),
                        label: item.icon,
                        isOver: item.amount?.overPlanned,
                        onClick: () => {
                            setCurrentCategoryIdx(i);
                        },
                    };
                })}
            />
            <AmountDetail
                id="category"
                amount={categories[currentCategoryIdx].amount}
                editPlanHandler={
                    !categories[currentCategoryIdx].isDefault
                        ? updatePlan
                        : undefined
                }
            />
            <IndexNav
                idx={currentCategoryIdx}
                setIdx={setCurrentCategoryIdx}
                data={categoryNames}
            />
            <div className={classes.buttons}>
                <Button
                    styleClass="extra"
                    onClick={() => {
                        dispatch(
                            uiActions.showCategoryPlanEditor({
                                isExpense: true,
                                isEditPlan: true,
                            })
                        );
                    }}
                >
                    <span className={classes.edit}>지출 목표 편집</span>
                </Button>
                <Button
                    styleClass="extra"
                    onClick={() => {
                        dispatch(
                            uiActions.showCategoryPlanEditor({
                                isExpense: false,
                                isEditPlan: true,
                            })
                        );
                    }}
                >
                    <span className={classes.edit}>수입 목표 편집</span>
                </Button>
            </div>
        </>
    );
}

export default CategoryStatus;
