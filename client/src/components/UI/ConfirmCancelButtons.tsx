import Button from './Button';
import classes from './ConfirmCancelButtons.module.css';
import LoadingSpinner from './LoadingSpinner';

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
        disabled={isPending || disabled}
      >
        {isPending ? <LoadingSpinner size="1.5rem" /> : confirmMsg || '완료'}
      </Button>
    </div>
  );
}

export default ConfirmCancelButtons;
