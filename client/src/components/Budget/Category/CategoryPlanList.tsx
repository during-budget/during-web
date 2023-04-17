import { Droppable } from 'react-beautiful-dnd';
import CategoryPlanItem from './CategoryPlanItem';

function CategoryPlanList(props: {
    categoryPlans: any;
    changeCategoryPlanHandler: any;
    isDefault?: boolean;
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
                            key={item.id}
                            idx={i}
                            id={item.id}
                            icon={item.icon}
                            title={item.title}
                            amount={item.amount}
                            onChange={props.changeCategoryPlanHandler}
                            isDefault={props.isDefault}
                        />
                    ))}
                    {provided.placeholder}
                </div>
            )}
        </Droppable>
    );
}

export default CategoryPlanList;
