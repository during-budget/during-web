import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Amount from '../../models/Amount';
import AmountBars from '../Amount/AmountBars';

function CategoryStatus() {
    const categoryData = useSelector(
        (state: any) => state.budget.category
    );

    return (
        <div className="status-container">
            <div className="status-header">
                <h2>카테고리별 예산</h2>
                <Link to="">{'더보기 >'}</Link>
            </div>
            <AmountBars
                amountData={categoryData.map((item: any) => {
                    return { amount: item.amount, label: item.icon };
                })}
            />
        </div>
    );
}

export default CategoryStatus;
