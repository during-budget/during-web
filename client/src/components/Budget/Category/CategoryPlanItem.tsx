import { useState } from 'react';
import Amount from '../../../models/Amount';
import DraggableItem from '../../UI/DraggableItem';
import Icon from '../../UI/Icon';
import classes from './CategoryPlanItem.module.css';

function CategoryPlanItem(props: {
  id: string;
  idx: number;
  icon: string;
  title: string;
  amount: Amount;
  onChange?: (i: number, value: number) => void;
  hideCurrent?: boolean;
}) {
  const [plan, setPlan] = useState(Amount.getAmountStr(props.amount.planned));

  // Change - Set number
  const changeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.replace(/[^0-9]+/g, '');

    setPlan(value);

    props.onChange && props.onChange(props.idx, +value);
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
    <DraggableItem id={props.id} idx={props.idx}>
      <div className={classes.content}>
        <div className={classes.info}>
          <Icon>{props.icon}</Icon>
          <div>
            <p className={classes.title}>{props.title}</p>
            <div className={classes.detail}>
              <p>
                <span className={classes.label}>예정</span>
                <span className={classes.amount}>{props.amount.getScheduledStr()}</span>
              </p>
              {!props.hideCurrent && (
                <p>
                  <span className={classes.label}>현재</span>
                  <span className={classes.amount}>{props.amount.getCurrentStr()}</span>
                </p>
              )}
            </div>
          </div>
        </div>
        {/* TODO: number input으로 대체 */}
        <input
          type="text"
          value={plan}
          onChange={changeHandler}
          onFocus={focusHandler}
          onBlur={blurHandler}
        ></input>
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
