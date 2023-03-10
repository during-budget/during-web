import classes from './OverlayForm.module.css';

function OverlayForm(props: {
    onSubmit?: (event: React.FormEvent) => void;
    onClose?: () => void;
    isShowBackdrop?: boolean;
    children?: React.ReactNode;
    className?: string;
}) {
    const preventEnterSubmitHandler = (event: React.KeyboardEvent) => {
        if (event.key === 'Enter') {
            event.preventDefault();
        }
    };

    return (
        <>
            <div
                className={`${classes.backdrop} ${
                    props.isShowBackdrop && classes.show
                }`}
                onClick={props.onClose}
            ></div>
            <form
                className={`${classes.overlay} ${props.className}`}
                onSubmit={props.onSubmit}
                onKeyDown={preventEnterSubmitHandler}
            >
                {props.children}
            </form>
        </>
    );
}

export default OverlayForm;
