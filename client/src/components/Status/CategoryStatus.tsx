import { useState } from 'react';
import StatusHeader from './StatusHeader';

function CategoryStatus() {
    const [isExpense, setIsExpense] = useState(true);
    const [currentCategoryIdx, setCurrentCategoryIdx] = useState(0);

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
                title="카테고리별 예산"
                values={tabs}
            />
        </>
    );
}

export default CategoryStatus;
