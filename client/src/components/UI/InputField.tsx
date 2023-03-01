import classes from './InputField.module.css';

function InputField(props: {
    isFloatLabel?: boolean;
    className?: string;
    children?: React.ReactNode;
}) {
    const className = `${classes.field} ${
        props.isFloatLabel ? classes.floating : ''
    }`;

    return (
        <div className={`${className} ${props.className}`}>
            {props.children}
        </div>
    );
}

export default InputField;
