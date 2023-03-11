import classes from './Overlay.module.css';

function Overlay(props: {
    onClose?: () => void;
    isShowBackdrop?: boolean;
    children?: React.ReactNode;
    className?: string;
}) {
    return (
        <>
            <div
                className={`${classes.backdrop} ${
                    props.isShowBackdrop && classes.show
                }`}
                onClick={props.onClose}
            ></div>
            <div className={`${classes.overlay} ${props.className}`}>
                {props.children}
            </div>
        </>
    );
}

export default Overlay;
