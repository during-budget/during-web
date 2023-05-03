import classes from './AssetFields.module.css';

interface AssetFieldsProps {
  amount: number;
  setAmount: (value: number) => void;
}

// TODO: NumberInput 개발 후 원 표시라던지 그런 거 수정
const AssetFields = ({ amount, setAmount }: AssetFieldsProps) => {
  const amountHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(+event.target.value);
  };

  return (
    <div className={classes.fields}>
      <label htmlFor="asset-field-amount" className={classes.label}>
        잔액
      </label>
      <input
        id="asset-field-amount"
        className={classes.amount}
        type="number"
        value={amount}
        onChange={amountHandler}
        placeholder="잔액을 입력하세요"
      />
    </div>
  );
};

export default AssetFields;
