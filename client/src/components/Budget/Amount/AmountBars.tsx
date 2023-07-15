import Amount from '../../../models/Amount';
import classes from './AmountBars.module.css';

interface AmountBarsProps {
  data: {
    id: string;
    amount: Amount;
    label: string;
    onClick?: () => void;
  }[];
}

const AmountBars = ({ data }: AmountBarsProps) => {
  const max = getMaxAmount(data.map((item) => item.amount));
  console.log(max);

  return (
    <ul className={classes.bars}>
      {data.map((item) => {
        const { id, amount, label, onClick } = item;
        const current = max && (amount.current / max) * 100;
        const scheduled = max && ((amount.scheduled + amount.current) / max) * 100;
        const planned = max && (amount.planned / max) * 100;

        const amountBarData = [
          {
            height: planned,
            className: classes.planned,
          },
          {
            height: scheduled,
            className: classes.scheduled,
          },
          {
            height: current,
            className: classes.current,
          },
        ];

        amountBarData.sort((prev, next) => next.height - prev.height);

        return (
          <li key={`amount-bars-${id}`} onClick={onClick}>
            <ul className={classes.grouped}>
              {amountBarData.map((item, i) => (
                <li
                  key={`amount-bars-${id}-${i}`}
                  className={`${classes.bar} ${item.className}`}
                  style={{
                    height: item.height + '%',
                    zIndex: i,
                  }}
                />
              ))}
            </ul>
            <span className={classes.label}>{label}</span>
          </li>
        );
      })}
    </ul>
  );
};

export default AmountBars;

const getMaxAmount = (amounts: Amount[]) => {
  let max = 0;

  amounts.forEach((amount) => {
    const scheduledCurrent = amount.current + amount.scheduled;
    if (amount.planned <= scheduledCurrent && scheduledCurrent > max) {
      max = scheduledCurrent;
    } else if (scheduledCurrent <= amount.planned && amount.planned > max) {
      max = amount.planned;
    }
  });

  return max;
};
