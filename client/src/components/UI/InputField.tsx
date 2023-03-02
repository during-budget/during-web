import { useEffect } from 'react';
import classes from './InputField.module.css';

function InputField(props: {
    id: string;
    isFloatLabel?: boolean;
    className?: string;
    children?: React.ReactNode;
}) {
    // NOTE: For scroll on focus
    useEffect(() => {
        const inputs: NodeListOf<HTMLInputElement> = document.querySelectorAll(
            `#${props.id} input`
        );
        inputs.forEach((input) => {
            input.addEventListener('click', () => {
                input.scrollIntoView({ block: 'center', behavior: 'smooth' });
            });
        });
    });

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
