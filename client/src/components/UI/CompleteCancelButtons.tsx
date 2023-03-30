import Button from './Button';
import classes from './CompleteCancelButtons.module.css';

function CompleteCancelButtons(props: {
    onClose: () => void;
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
            <Button type="submit" styleClass="primary">
                완료
            </Button>
        </div>
    );
}

export default CompleteCancelButtons;
