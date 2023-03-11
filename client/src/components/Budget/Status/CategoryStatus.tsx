import { useState } from 'react';
import Amount from '../../../models/Amount';
import Category from '../../../models/Category';
import StatusHeader from './StatusHeader';
import AmountBars from '../Amount/AmountBars';
import AmountDetail from '../Amount/AmountDetail';
import CategoryStatusNav from './CategoryStatusNav';

function CategoryStatus(props: { categories: Category[] }) {
    const [isExpense, setIsExpense] = useState(true);
    const [currentCategoryIdx, setCurrentCategoryIdx] = useState(0);

    const categories = props.categories.filter((item: Category) =>
        isExpense ? item.isExpense : !item.isExpense
    );

    const tabs = [
        {
            label: '지출',
            value: 'expense',
            onChange: () => {
                setIsExpense(true);
                setCurrentCategoryIdx(0);
            },
            defaultChecked: isExpense,
        },
        {
            label: '수입',
            value: 'income',
            onChange: () => {
                setIsExpense(false);
                setCurrentCategoryIdx(0);
            },
            defaultChecked: !isExpense,
        },
    ];

    return (
        <>
            <StatusHeader
                id="category-status-type"
                title="카테고리별 현황"
                values={tabs}
            />
            <AmountBars
                amountData={categories.map((item: Category, i) => {
                    return {
                        amount: item.amount || new Amount(0, 0, 0),
                        label: item.icon,
                        isOver: item.amount?.state
                            .map((state) => state.isOver)
                            .includes(true),
                        onClick: () => {
                            setCurrentCategoryIdx(i);
                        },
                    };
                })}
            />
            <AmountDetail
                id="category"
                amount={categories[currentCategoryIdx].amount!}
            />
            <CategoryStatusNav
                idx={currentCategoryIdx}
                setIdx={setCurrentCategoryIdx}
                categories={categories}
            />
        </>
    );
}

export default CategoryStatus;
