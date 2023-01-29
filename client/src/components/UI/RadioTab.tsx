import classes from './RadioTab.module.css';

function RadioTab(props: {
    className?: string;
    name: string;
    values: {
        label: string;
        value: string;
        defaultChecked?: boolean;
        checked?: boolean,
        disabled?: boolean,
        onClick?: () => void;
        onChange?: () => void
    }[];
}) {
    const { className, name, values } = props;
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
                            checked={item.checked}
                            disabled={item.disabled}
                            onClick={item.onClick}
                            onChange={item.onChange}
                        ></input>
                        <label htmlFor={`${name}-${item.value}`}>
                            {item.label}
                        </label>
                    </li>
                );
            })}
        </ul>
    );
}

export default RadioTab;
