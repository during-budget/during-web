import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import AmountBars from '../Amount/AmountBars';

function CategoryStatus(props: { budgetId: string }) {
    const categories = useSelector((state: any) => state.categories);
    const filteredCategories = categories.filter(
        (item: any) => props.budgetId in item.amounts
    );

    return (
        <div className="status-container">
            <div className="status-header">
                <h2>카테고리별 예산</h2>
                <Link to="">{'더보기 >'}</Link>
            </div>
            <AmountBars
                amountData={filteredCategories.map((item: any) => {
                    return {
                        amount: item.amounts[props.budgetId],
                        label: item.icon,
                    };
                })}
            />
        </div>
    );
}

export default CategoryStatus;
