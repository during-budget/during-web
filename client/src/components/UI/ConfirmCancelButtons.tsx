import Button from './Button';
import classes from './ConfirmCancelButtons.module.css';

function ConfirmCancelButtons(props: {
    onClose?: () => void;
    onConfirm?: () => {};
    className?: string;
}) {
    return (
        <div className={`${classes.container} ${props.className}`}>
            <Button
                className={classes.cancel}
                styleClass="extra"
                onClick={props.onClose}
            >
                취소
            </Button>
            <Button
                type="submit"
                styleClass="primary"
                onClick={props.onConfirm}
            >
                완료
            </Button>
        </div>
    );
}

export default ConfirmCancelButtons;
