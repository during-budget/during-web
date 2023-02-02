import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import AmountBars from '../Amount/AmountBars';
import Amount from '../../models/Amount';
import RadioTab from '../UI/RadioTab';
import { useState } from 'react';
import Category from '../../models/Category';

function CategoryStatus() {
    const [isExpense, setIsExpense] = useState(true);
    const categories = useSelector((state: any) => state.categories);

    const filteredCategories = categories.filter((category: Category) =>
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
                amountData={filteredCategories.map((item: any) => {
                    return {
                        // TODO: get amount from budget data
                        amount: new Amount(10000, 50000, 100000),
                        label: item.icon,
                    };
                })}
            />
        </div>
    );
}

export default CategoryStatus;
