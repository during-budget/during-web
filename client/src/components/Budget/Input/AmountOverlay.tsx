import { Parser } from 'expr-eval';
import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../hooks/useRedux';
import { uiActions } from '../../../store/ui';
import Button from '../../UI/button/Button';
import OverlayForm from '../../UI/overlay/OverlayForm';
import classes from './AmountOverlay.module.css';

const parser = new Parser();
const getEvaluatedValue = (value: string) => {
  if (value) {
    const expr = parser.parse(value.replace(/,/g, ''));
    return expr.evaluate();
  } else {
    return 0;
  }
};

const AmountOverlay = () => {
  const { isOpen, value, onConfirm, hash } = useAppSelector((state) => state.ui.amount);
  const dispatch = useAppDispatch();

  const [isEvaluated, setIsEvaluated] = useState(true);

  useEffect(() => {
    if (isOpen) {
      setIsEvaluated(true);
    }
  }, [isOpen]);

  const submitHandler = async () => {
    const amount = getEvaluatedValue(value);
    onConfirm && onConfirm(amount);
    dispatch(uiActions.closeAmountInput());
  };

  const clearHandler = () => {
    dispatch(uiActions.setAmountValue(''));
    setIsEvaluated(false);
  };

  const equalHandler = () => {
    dispatch(uiActions.setAmountValue(getEvaluatedValue(value).toLocaleString()));
    setIsEvaluated(true);
  };

  const backspaceHandler = () => {
    const amount = value.slice(0, value.length - 1).replace(/,/g, '');
    dispatch(uiActions.setAmountValue((+amount).toLocaleString()));
    setIsEvaluated(false);
  };

  const getButtons = (values: string[]) => {
    return values.map((item) => (
      <Button
        key={item}
        styleClass="extra"
        onClick={() => {
          if (
            (isEvaluated && !(value === '0' && item === '.')) ||
            value === '' ||
            (value === '0' && item !== '.') ||
            value === '00'
          ) {
            if (['+', '/', '*', '00', '^', '.'].includes(item)) {
              return;
            } else {
              dispatch(uiActions.setAmountValue(item));
            }
          } else {
            const expr = (value + item).replace(/,/g, '');
            dispatch(
              uiActions.setAmountValue(
                expr.replace(/[0-9]+/g, (num) => (+num).toLocaleString())
              )
            );
          }
          setIsEvaluated(false);
        }}
      >
        {item}
      </Button>
    ));
  };

  return (
    <OverlayForm
      overlayOptions={{
        id: 'amount-calculator-overlay',
        isOpen,
        onClose: () => {
          dispatch(uiActions.closeAmountInput());
        },
        hash,
      }}
      onSubmit={submitHandler}
    >
      <div className={classes.calc}>
        <div className={classes.display}>
          <input
            placeholder="금액을 입력하세요"
            value={value}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              const amount = +event?.target.value.replace(/\D/g, '');
              dispatch(uiActions.setAmountValue(amount.toLocaleString()));
            }}
          />
        </div>

        <div className={classes.marks}>
          <Button styleClass="extra" onClick={clearHandler}>
            C
          </Button>
          {getButtons(['^', '.', '(', ')'])}
        </div>
        <div className={classes.buttons}>
          <div className={classes.numbers}>
            {getButtons(['1', '2', '3', '4', '5', '6', '7', '8', '9', '00', '0'])}
            <Button
              styleClass="extra"
              className={classes.arrow}
              onClick={backspaceHandler}
            >
              ←
            </Button>
          </div>
          <div className={classes.operators}>
            {getButtons(['+', '-', '*', '/'])}
            <Button styleClass={'secondary'} onClick={equalHandler}>
              =
            </Button>
          </div>
        </div>
      </div>
    </OverlayForm>
  );
};

export default AmountOverlay;
