import Button from './Button';
import classes from './ConfirmCancelButtons.module.css';

export interface ConfirmCancelButtonsProps {
  onClose?: () => void;
  onConfirm?: () => {};
  closeMsg?: string;
  confirmMsg?: string;
  className?: string;
  disabled?: boolean;
  hideCancle?: boolean;
  isClose?: boolean;
  isPending?: boolean;
}

function ConfirmCancelButtons({
  onClose,
  onConfirm,
  closeMsg,
  confirmMsg,
  className,
  disabled,
  hideCancle,
  isClose,
  isPending,
}: ConfirmCancelButtonsProps) {
  return (
    <div
      className={`${classes.confirmCancel} ${isClose ? classes.close : ''} ${
        className || ''
      }`}
    >
      {!hideCancle && (
        <Button
          className={classes.cancel}
          styleClass="extra"
          onClick={onClose}
          disabled={isPending}
        >
          {closeMsg || '취소'}
        </Button>
      )}
      <Button
        type="submit"
        styleClass="primary"
        onClick={onConfirm}
        isPending={isPending}
        disabled={isPending || disabled}
      >
        {confirmMsg || '완료'}
      </Button>
    </div>
  );
}

export default ConfirmCancelButtons;
