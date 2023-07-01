import { useEffect, useState } from 'react';
import Amount from '../../../models/Amount';
import DraggableItem from '../../UI/DraggableItem';
import Icon from '../../UI/Icon';
import AmountInput from '../Input/AmountInput';
import classes from './CategoryPlanItem.module.css';

interface CategoryPlanItemProps {
  id: string;
  idx: number;
  icon: string;
  title: string;
  amount: Amount;
  isDefault: boolean;
  onChange?: (i: number, value: number) => void;
  hideCurrent?: boolean;
  preventDrag?: boolean;
}

function CategoryPlanItem({
  id,
  idx,
  icon,
  title,
  amount,
  isDefault,
  onChange,
  hideCurrent,
  preventDrag,
}: CategoryPlanItemProps) {
  const [plan, setPlan] = useState(amount.planned.toString());

  useEffect(() => {
    setPlan(amount.planned.toString());
  }, [amount.planned]);

  useEffect(() => {
    if (isDefault) {
      setPlan(Amount.getAmountStr(amount.planned));
    }
  }, [amount.planned]);

  // Change - Set number
  const confirmHandler = (value: string) => {
    setPlan(value);
    onChange && onChange(idx, +value);
  };

  return (
    <DraggableItem id={id} idx={idx} preventDrag={preventDrag}>
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
              {!hideCurrent && (
                <p>
                  <span className={classes.label}>현재</span>
                  <span className={classes.amount}>{amount.getCurrentStr()}</span>
                </p>
              )}
            </div>
          </div>
        </div>
        {/* TODO: number input으로 대체 */}
        {isDefault ? (
          <p className={classes.default}>{plan}</p>
        ) : (
          <AmountInput
            id={`category-plan-item-amount-input-${id}`}
            defaultValue={plan}
            onConfirm={confirmHandler}
          />
        )}
      </div>
    </DraggableItem>
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
