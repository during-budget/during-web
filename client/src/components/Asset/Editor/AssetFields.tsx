import AmountInput from '../../Budget/Input/AmountInput';
import classes from './AssetFields.module.css';

interface AssetFieldsProps {
  amount: number;
  setAmount: (value: number) => void;
}

const AssetFields = ({ amount, setAmount }: AssetFieldsProps) => {
  const confirmHandler = (value: string) => {
    setAmount(+value);
  };

  return (
    <div className={classes.fields}>
      <label htmlFor="asset-field-amount" className={classes.label}>
        잔액
      </label>
      <AmountInput
        id="asset-field-amount"
        className={classes.amount}
        defaultValue={amount.toString()}
        onConfirm={confirmHandler}
      />
    </div>
  );
};

export default AssetFields;
