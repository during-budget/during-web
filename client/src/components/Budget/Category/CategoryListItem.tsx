import Amount from '../../../models/Amount';
import Icon from '../../UI/component/Icon';
import classes from './CategoryPlanItem.module.css';

interface CategoryPlanItemProps {
  id: string;
  icon: string;
  title: string;
  amount: Amount;
}

function CategoryPlanItem({ id, icon, title, amount }: CategoryPlanItemProps) {
  return (
    <li id={id}>
      <div className={classes.content}>
        <div className={classes.info}>
          <Icon>{icon}</Icon>
          <div>
            <p className={classes.title}>{title}</p>
            <div className={classes.detail}>
              <p>
                <span className={classes.label}>예정</span>
                <span className={classes.amount}>{amount.getScheduledStr()}</span>
              </p>
              <p>
                <span className={classes.label}>목표</span>
                <span className={classes.amount}>{amount.getPlannedStr()}</span>
              </p>
            </div>
          </div>
        </div>
        <div className="text-right">
          <p className="text-lg bold">{amount.getCurrentStr()}</p>
          {amount.planned - amount.current ? (
            amount.planned - amount.current < 0 ? (
              <p className="text-sm text-error">
                {(amount.planned - amount.current) * -1}원 초과
              </p>
            ) : (
              <p className="text-sm text-gray-300">
                {amount.planned - amount.current}원 남음
              </p>
            )
          ) : (
            <></>
          )}
        </div>
      </div>
    </li>
  );
}

const lockXAxis = (provided: any) => {
  const transform = provided.draggableProps!.style!.transform;
  if (transform) {
    var t = transform.split(',')[1];
    provided.draggableProps!.style!.transform = 'translate(0px,' + t;
  }
  return provided;
};

export default CategoryPlanItem;
