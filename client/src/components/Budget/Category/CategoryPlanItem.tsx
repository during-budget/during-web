import { useEffect, useState } from 'react';
import Amount from '../../../models/Amount';
import DraggableItem from '../../UI/DraggableItem';
import Icon from '../../UI/Icon';
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
  const [plan, setPlan] = useState(Amount.getAmountStr(amount.planned));

  useEffect(() => {
    setPlan(Amount.getAmountStr(amount.planned));
  }, [amount.planned]);

  useEffect(() => {
    if (isDefault) {
      setPlan(Amount.getAmountStr(amount.planned));
    }
  }, [amount.planned]);

  // Change - Set number
  const changeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.replace(/[^0-9]+/g, '');

    setPlan(value);

    onChange && onChange(idx, +value);
  };

  // Focus - Conver to number
  const focusHandler = (event: React.FocusEvent<HTMLInputElement>) => {
    const value = event.target.value.replace(/[^0-9]+/g, '');

    if (value === '0') {
      setPlan('');
    } else {
      setPlan(value);
    }

    event.target.scrollIntoView({
      block: 'start',
      behavior: 'smooth',
    });
  };

  // Blur - Set AmountStr
  const blurHandler = (event: React.FocusEvent<HTMLInputElement>) => {
    const value = event.target.value;

    if (value === '' || +value <= 0) {
      setPlan('0원');
    } else {
      setPlan(Amount.getAmountStr(+value));
    }
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
          <input
            type="text"
            value={plan}
            onChange={changeHandler}
            onFocus={focusHandler}
            onBlur={blurHandler}
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
