import { useDispatch, useSelector } from 'react-redux';
import { useState } from 'react';
import classes from './CategoryStatus.module.css';
import Category from '../../models/Category';
import Budget from '../../models/Budget';
import RadioTab from '../UI/RadioTab';
import Amount from '../../models/Amount';
import AmountDetail from '../Amount/AmountDetail';
import AmountBars from '../Amount/AmountBars';
import { categoryActions } from '../../store/category';

const DUMMY_AMOUNT = [
    new Amount(20000, 80000, 100000),
    new Amount(180000, 260000, 300000),
    new Amount(22000, 30000, 50000),
    new Amount(60000, 100000, 150000),
    new Amount(120000, 140000, 200000),
    new Amount(12000, 74000, 80000),
    new Amount(430000, 500000, 500000),
    new Amount(40000, 80000, 100000),
];

function CategoryStatus(props: { budgetId: string }) {
    const dispatch = useDispatch();

    const [isExpense, setIsExpense] = useState(true);
    const [currentCategoryIdx, setCurrentCategoryIdx] = useState(1);

    const budgets = useSelector((state: any) => state.budgets);
    const budget = budgets.find((item: Budget) => item.id === props.budgetId);
    const categories = budget.categories.filter((category: Category) =>
        isExpense ? category.isExpense : category.isIncome
    );

    const editPlanHandler = (amount: number) => {
        // TODO: implement editPlan
        dispatch(categoryActions.updateAmount);
    };

    const plusCategoryIdx = () => {
        setCurrentCategoryIdx((prevIdx) => {
            const lastIdx = categories.length - 1;
            const nextIdx = prevIdx === lastIdx ? 0 : prevIdx + 1;
            return nextIdx;
        });
    };

    const minusCategoryIdx = () => {
        setCurrentCategoryIdx((prevIdx) => {
            const lastIdx = categories.length - 1;
            const nextIdx = prevIdx === 0 ? lastIdx : prevIdx - 1;
            return nextIdx;
        });
    };

    return (
        <div className="status-container">
            <div className="status-header">
                <h2>카테고리별 예산</h2>
                <RadioTab
                    name="category-status-type"
                    values={[
                        {
                            label: '지출',
                            value: 'expense',
                            onChange: () => {
                                setIsExpense(true);
                                setCurrentCategoryIdx(0);
                            },
                            checked: isExpense,
                        },
                        {
                            label: '수입',
                            value: 'income',
                            onChange: () => {
                                setIsExpense(false);
                                setCurrentCategoryIdx(0);
                            },
                            checked: !isExpense,
                        },
                    ]}
                />
            </div>
            <div className={classes.bars}>
                <AmountBars
                    amountData={categories.map((item: any, i: number) => {
                        return {
                            // TODO: get amount from budget data
                            amount: DUMMY_AMOUNT[i],
                            label: item.icon,
                        };
                    })}
                />
            </div>
            <div className={classes.detail}>
                <AmountDetail
                    id="category"
                    amount={DUMMY_AMOUNT[currentCategoryIdx]}
                    onEdit={editPlanHandler}
                />
            </div>
            <div className={classes.title}>
                <button type="button" onClick={minusCategoryIdx}>
                    <i className="fa-solid fa-chevron-left"></i>
                </button>
                <div>
                    <span className={classes.icon}>
                        {categories[currentCategoryIdx].icon}
                    </span>
                    <span>{categories[currentCategoryIdx].title}</span>
                </div>
                <button type="button" onClick={plusCategoryIdx}>
                    <i className="fa-solid fa-chevron-right"></i>
                </button>
            </div>
        </div>
    );
}

export default CategoryStatus;
