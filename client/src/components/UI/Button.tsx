import classes from './Button.module.css';

function Button(props: {
    type?: 'button' | 'submit' | 'reset';
    className?: string;
    onClick?: (event?: React.MouseEvent) => void;
    disabled?: boolean;
    styleClass?: 'primary' | 'secondary' | 'extra' | 'gray';
    sizeClass?: 'lg' | 'md' | 'sm';
    children?: React.ReactNode;
}) {
    const styleClass = classes[props.styleClass!] || classes.primary;
    const sizeClass = classes[props.sizeClass!] || classes.lg;

    return (
        <button
            type={props.type || 'button'}
            className={`${classes.button} ${styleClass} ${sizeClass} ${
                props.className || ''
            }`}
            onClick={props.onClick}
            disabled={props.disabled}
        >
            {props.children}
        </button>
    );
}

export default Button;
