import Amount from '../../../models/Amount';
import AmountBar from './AmountBar';
import classes from './AmountBars.module.css';

const getLabel = (label: string, width: string) => (
  <span className={classes.label}>{label}</span>
);

function AmountBars(props: {
  amountData: {
    amount: Amount | number;
    label: string;
    isOver?: boolean;
    onClick?: (i: number) => void;
  }[];
  borderRadius?: string;
  isTop?: boolean;
  isExpense?: boolean;
  className?: string;
}) {
  const containerAmount = props.amountData.map((data) => {
    if (typeof data.amount === 'number') {
      return data.amount;
    } else {
      return data.amount.planned;
    }
  });
  const total = containerAmount.reduce((curr, next) => curr + next, 0);
  const widths = containerAmount.map((data) => {
    if (!total) {
      return '0';
    } else {
      return (data / total) * 90 + '%';
    }
  });

  return (
    <ul className={`${classes.container} ${props.className}`}>
      {props.amountData.map((data, i) => {
        const width = widths[i];

        const amountData = data.amount;
        const amount =
          typeof amountData === 'number'
            ? new Amount(amountData, amountData, amountData)
            : amountData;
        return (
          (typeof amount === 'number' ? amount : amount.planned) > 0 && (
            <li
              key={i}
              className={classes.bar}
              onClick={() => {
                data.onClick && data.onClick(i);
              }}
              style={{ width }}
            >
              {/* over mark */}
              {data.isOver && (
                <i className={`fa-solid fa-circle-exclamation ${classes.mark}`}></i>
              )}

              {/* bar */}
              {props.isTop && getLabel(data.label, width)}
              <AmountBar amount={amount} borderRadius={props.borderRadius} />
              {!props.isTop && getLabel(data.label, width)}
            </li>
          )
        );
      })}
    </ul>
  );
}

export default AmountBars;
