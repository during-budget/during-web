import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import AmountBars from '../Amount/AmountBars';
import Amount from '../../models/Amount';

function CategoryStatus() {
    const categories = useSelector((state: any) => state.categories);

    return (
        <div className="status-container">
            <div className="status-header">
                <h2>카테고리별 예산</h2>
                <Link to="">{'더보기 >'}</Link>
            </div>
            <AmountBars
                amountData={categories.map((item: any) => {
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
