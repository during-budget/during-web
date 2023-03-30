import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import classes from './CategoryPlan.module.css';
import Category from '../../../models/Category';
import { uiActions } from '../../../store/ui';
import CompleteCancelButtons from '../../UI/CompleteCancelButtons';
import Overlay from '../../UI/Overlay';
import StatusHeader from '../Status/StatusHeader';
import ExpenseTab from '../UI/ExpenseTab';
import CategoryPlanItem from './CategoryPlanItem';

function CategoryPlan(props: { title: string; categories: Category[] }) {
    const dispatch = useDispatch();

    const isOpen = useSelector((state: any) => state.ui.category.isOpen);

    const [isExpense, setIsExpense] = useState(true);
    const [categories, setCategories] = useState<Category[]>([]);

    useEffect(() => {
        setCategories(
            props.categories.filter(
                (item: Category) => item.isExpense === isExpense
            )
        );
    }, [props.categories, isExpense]);

    const closeHandler = () => {
        dispatch(uiActions.showCategory(false));
    };

    return (
        <Overlay
            className={`${classes.container} ${isOpen ? classes.open : ''}`}
            isOpen={isOpen}
            isShowBackdrop={true}
            closeHandler={closeHandler}
        >
            <StatusHeader
                id="category-plan-type"
                className={classes.header}
                title={`${props.title} 카테고리별 목표`}
                tab={
                    <ExpenseTab
                        id="category-plan-type-tab"
                        isExpense={isExpense}
                        setIsExpense={setIsExpense}
                    />
                }
            />
            <ul className={classes.list}>
                <h6>목표 예산</h6>
                <div>
                    {categories.map((item, i) => (
                        <CategoryPlanItem
                            item={item}
                            key={i}
                            icon={item.icon}
                            title={item.title}
                            plan={item.amount?.planned}
                        />
                    ))}
                </div>
            </ul>
            <CompleteCancelButtons onClose={closeHandler} />
        </Overlay>
    );
}

export default CategoryPlan;
