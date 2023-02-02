import { useSelector } from 'react-redux';
import AmountBars from '../Amount/AmountBars';
import RadioTab from '../UI/RadioTab';
import { useState } from 'react';
import Category from '../../models/Category';
import Budget from '../../models/Budget';
import Amount from '../../models/Amount';

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
    const [isExpense, setIsExpense] = useState(true);

    const budgets = useSelector((state: any) => state.budgets);
    const budget = budgets.find((item: Budget) => item.id === props.budgetId);
    const categories = budget.categories.filter((category: Category) =>
        isExpense ? category.isExpense : category.isIncome
    );

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
                            },
                            checked: isExpense,
                        },
                        {
                            label: '수입',
                            value: 'income',
                            onChange: () => {
                                setIsExpense(false);
                            },
                            checked: !isExpense,
                        },
                    ]}
                />
            </div>
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
    );
}

export default CategoryStatus;
