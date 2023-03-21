import classes from './Overlay.module.css';

function Overlay(props: {
    isOpen: boolean;
    isClip?: boolean;
    closeHandler?: () => void;
    isShowBackdrop?: boolean;
    children?: React.ReactNode;
    className?: string;
}) {
    return (
        <div
            className={`${classes.container} ${
                props.isOpen ? classes.open : ''
            } ${props.isClip ? classes.clip : ''}`}
        >
            <div
                className={`${classes.backdrop} ${
                    props.isShowBackdrop ? classes.show : ''
                }`}
                onClick={props.closeHandler}
            ></div>
            <div className={`${classes.overlay} ${props.className}`}>
                {props.children}
            </div>
        </div>
    );
}

export default Overlay;
