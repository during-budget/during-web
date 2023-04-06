import classes from './RadioTab.module.css';

function RadioTab(props: {
    className?: string;
    name: string;
    values: {
        label: string;
        value: string;
        checked?: boolean;
        onChange?: () => void;
        disabled?: boolean;
    }[];
    isBold?: boolean;
    isLine?: boolean;
}) {
    const { className, name, values } = props;
    const boldStyle = props.isBold === false ? {} : { fontWeight: '600' };
    const lineClass = props.isLine ? classes.line : '';

    return (
        <ul className={`${classes.tab} ${lineClass} ${className}`}>
            {values.map((item) => (
                <li key={item.value}>
                    <input
                        id={`${name}-${item.value}`}
                        type="radio"
                        name={name}
                        checked={
                            item.checked === undefined ? false : item.checked
                        }
                        onChange={item.onChange}
                        disabled={item.disabled}
                    ></input>
                    <label htmlFor={`${name}-${item.value}`} style={boldStyle}>
                        {item.label}
                    </label>
                </li>
            ))}
        </ul>
    );
}

export default RadioTab;
