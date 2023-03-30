import classes from './CategoryPlanItem.module.css';
import Icon from '../../UI/Icon';

function CategoryPlanItem(props: {
    item?: any;
    icon: string;
    title: string;
    plan: number | undefined;
}) {
    return (
        <li className={classes.container}>
            <div className={classes.info}>
                <Icon>{props.icon}</Icon>
                <p>{props.title}</p>
            </div>
            {/* TODO: number input으로 대체 */}
            <input type="number" defaultValue={props.plan}></input>
        </li>
    );
}

export default CategoryPlanItem;
