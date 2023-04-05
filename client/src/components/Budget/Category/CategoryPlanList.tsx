import { Droppable } from 'react-beautiful-dnd';
import Amount from '../../../models/Amount';
import CategoryPlanItem from './CategoryPlanItem';

function CategoryPlanList(props: {
    categoryPlans: any;
    changeCategoryPlanHandler: any;
}) {
    return (
        <Droppable droppableId="category-plan-droppable">
            {(provided) => (
                <div
                    ref={provided.innerRef}
                    className="category-plan-droppable"
                    {...provided.droppableProps}
                >
                    {props.categoryPlans.map((item: any, i: number) => (
                        <CategoryPlanItem
                            key={i}
                            idx={i}
                            id={item.id}
                            icon={item.icon}
                            title={item.title}
                            plan={Amount.getAmountStr(item.plan)}
                            onChange={props.changeCategoryPlanHandler}
                        />
                    ))}
                    {provided.placeholder}
                </div>
            )}
        </Droppable>
    );
}

export default CategoryPlanList;
