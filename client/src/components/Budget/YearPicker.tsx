import classes from './YearPicker.module.css';

function YearPicker(props: {
    fontSize: string;
    onSelect?: (value: string) => void;
}) {
    const currentYear = new Date().getFullYear();
    const options = [];

    for (let i = 2020; i <= currentYear; i++) {
        options.push(i);
    }

    const changeHandler = (event: React.ChangeEvent<HTMLSelectElement>) => {
        if (props.onSelect) {
            props.onSelect(event.target.value);
        }
    };

    return (
        <select
            className={classes.select}
            onChange={changeHandler}
            defaultValue={currentYear}
            style={{ fontSize: props.fontSize }}
        >
            {options.map((option) => {
                return (
                    <option key={option} value={option}>
                        {option}
                    </option>
                );
            })}
        </select>
    );
}

export default YearPicker;
