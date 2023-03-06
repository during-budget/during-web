import classes from './RadioTab.module.css';

function RadioTab(props: {
    className?: string;
    name: string;
    values: {
        label: string;
        value: string;
        defaultChecked?: boolean;
        onChange?: () => void;
        disabled?: boolean;
    }[];
    isBold?: boolean;
}) {
    const { className, name, values } = props;
    const boldStyle = props.isBold === false ? {} : { fontWeight: '600' };
    return (
        <ul className={`${classes.tab} ${className}`}>
            {values.map((item) => {
                return (
                    <li key={item.value}>
                        <input
                            id={`${name}-${item.value}`}
                            type="radio"
                            name={name}
                            defaultChecked={item.defaultChecked}
                            onChange={item.onChange}
                            disabled={item.disabled}
                        ></input>
                        <label
                            htmlFor={`${name}-${item.value}`}
                            style={boldStyle}
                        >
                            {item.label}
                        </label>
                    </li>
                );
            })}
        </ul>
    );
}

export default RadioTab;
