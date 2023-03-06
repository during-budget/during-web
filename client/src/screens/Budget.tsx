import { useLoaderData } from 'react-router-dom';
import classes from './Budget.module.css';
import { getBudgetById } from '../util/api/budgetAPI';
import BudgetModel from '../models/Budget';
import Carousel from '../components/UI/Carousel';
import BudgetHeader from '../components/Budget/BudgetHeader';
import TotalStatus from '../components/Status/TotalStatus';
import DateStatus from '../components/Status/DateStatus';
import CategoryStatus from '../components/Status/CategoryStatus';

function Budget() {
    const loaderData: any = useLoaderData();

    const budget = BudgetModel.getBudgetFromData(loaderData.budget);
    const { title, date, total } = budget;

    return (
        <>
            <BudgetHeader
                startDate={new Date(date.start)}
                endDate={new Date(date.end)}
                title={title}
            />
            <main>
                <Carousel
                    id="status"
                    initialIndex={1}
                    itemClassName={classes.status}
                >
                    <DateStatus />
                    <TotalStatus total={total} />
                    <CategoryStatus />
                </Carousel>
                <hr />
            </main>
        </>
    );
}

export default Budget;

export const loader = async (data: any) => {
    const { params } = data;

    const budgetData = await getBudgetById(params.budgetId);

    return {
        budget: budgetData.budget,
    };
};
