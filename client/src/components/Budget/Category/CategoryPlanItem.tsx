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
  autoPlanned: boolean;
  onChange: (i: number, value: number, autoPlanned: boolean) => void;
  hideCurrent?: boolean;
  preventDrag?: boolean;
  resetAutoPlan?: boolean;
}

function CategoryPlanItem({
  id,
  idx,
  icon,
  title,
  amount,
  isDefault,
  autoPlanned,
  onChange,
  hideCurrent,
  preventDrag,
  resetAutoPlan,
}: CategoryPlanItemProps) {
  const [autoPlanChecked, setAutoPlanChecked] = useState(autoPlanned);
  const [plan, setPlan] = useState(amount.planned.toString());

  useEffect(() => {
    setPlan(amount.planned.toString());
  }, [amount.planned]);

  useEffect(() => {
    if (autoPlanChecked && !isDefault) {
      onChange(idx, amount.current + amount.scheduled, autoPlanChecked);
    }
  }, [autoPlanChecked]);

  console.log(title, autoPlanned, autoPlanChecked);

  useEffect(() => {
    if (resetAutoPlan) {
      setAutoPlanChecked(autoPlanned);
    }
  }, [resetAutoPlan]);

  // Change - Set number
  const confirmHandler = (value: string) => {
    setPlan(value);
    onChange(idx, +value, autoPlanChecked);
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
        {isDefault ? (
          <p className={classes.default}>{Amount.getAmountStr(+plan)}</p>
        ) : (
          <AmountInput
            id={`category-plan-item-amount-input-${id}`}
            defaultValue={
              autoPlanChecked ? (amount.current + amount.scheduled).toString() : plan
            }
            onClick={() => {
              setAutoPlanChecked(false);
            }}
            onConfirm={confirmHandler}
          />
        )}
      </div>
      {!isDefault && (
        <>
          <label htmlFor={`auto-planned-${id}`} className={classes.auto}>
            <i
              className="fa-solid fa-wand-magic-sparkles"
              style={{ opacity: autoPlanChecked ? 1 : 0.3 }}
            ></i>
          </label>
          <input
            id={`auto-planned-${id}`}
            type="checkbox"
            checked={autoPlanChecked}
            onChange={() => {
              setAutoPlanChecked((prev) => !prev);
            }}
            style={{ display: 'none' }}
          />
        </>
      )}
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
