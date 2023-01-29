import classes from './RadioTab.module.css';

function RadioTab(props: {
    className?: string;
    name: string;
    values: {
        label: string;
        value: string;
        defaultChecked?: boolean;
        onClick: () => void;
    }[];
}) {
    const { className, name, values } = props;
    return (
        <ul className={`${classes.tab} ${className}`}>
            {values.map((item) => {
                return (
                    <li>
                        <input
                            id={`${name}-${item.value}`}
                            type="radio"
                            name={name}
                            defaultChecked={item.defaultChecked}
                            onClick={item.onClick}
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
