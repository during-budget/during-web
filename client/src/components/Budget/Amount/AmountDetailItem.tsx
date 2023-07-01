import EditInput from '../Input/EditInput';
import classes from './AmountDetailItem.module.css';

function AmountDetailItem(props: {
  className?: string;
  label: string;
  amountStr: string;
  labelColor: string;
  fontSize: string;
  fontWeight: number;
  editHandler?: (amount: string) => void;
  editDefaultValue?: number;
}) {
  const style = {
    '--label-color': props.labelColor,
    '--font-weight': props.fontWeight,
    '--font-size': props.fontSize,
  } as React.CSSProperties;

  const convertToAmountNum = (value: string) => {
    return value.replace(/[^0-9]/g, '');
  };

  return (
    <li className={`${classes.container} ${props.className}`} style={style}>
      <span className={classes.label}>{props.label}</span>
      {props.editHandler ? (
        <EditInput
          id="total-status-detail-edit-input"
          className={classes.edit}
          editClass={classes.editButton}
          cancelClass={classes.cancelButton}
          value={props.amountStr}
          onConfirm={props.editHandler}
          convertDefaultValue={convertToAmountNum}
        />
      ) : (
        <span className={classes.amount}>{props.amountStr}</span>
      )}
    </li>
  );
}

export default AmountDetailItem;
