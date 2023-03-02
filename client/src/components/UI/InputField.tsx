import classes from './InputField.module.css';

function InputField(props: {
    id: string;
    isFloatLabel?: boolean;
    className?: string;
    children?: React.ReactNode;
}) {
    const className = `${classes.field} ${
        props.isFloatLabel ? classes.floating : ''
    }`;

    return (
        <div id={props.id} className={`${className} ${props.className}`}>
            {props.children}
        </div>
    );
}

export default InputField;
