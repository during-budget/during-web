import Button from './Button';
import classes from './ConfirmCancelButtons.module.css';

interface ConfirmCancelButtonsProps {
  onClose?: () => void;
  onConfirm?: () => {};
  closeMsg?: string;
  confirmMsg?: string;
  className?: string;
  disabled?: boolean;
  hideCancle?: boolean;
}

function ConfirmCancelButtons({
  onClose,
  onConfirm,
  closeMsg,
  confirmMsg,
  className,
  disabled,
  hideCancle,
}: ConfirmCancelButtonsProps) {
  return (
    <div className={`${classes.container} ${className}`}>
      {!hideCancle && (
        <Button className={classes.cancel} styleClass="extra" onClick={onClose}>
          {closeMsg || '취소'}
        </Button>
      )}
      <Button type="submit" styleClass="primary" onClick={onConfirm} disabled={disabled}>
        {confirmMsg || '완료'}
      </Button>
    </div>
  );
}

export default ConfirmCancelButtons;
