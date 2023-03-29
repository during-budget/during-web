import classes from './GroupedBar.module.css';

function GroupedBar(props: {
    color: string[];
    data: string[];
    width?: string;
    height?: string;
    className?: string;
}) {
    return (
        <ul
            className={`${classes.container} ${props.className}`}
            style={{ height: props.height || '100%' }}
        >
            {props.data.map((item, i) => {
                return (
                    <li
                        key={i}
                        className={classes.sm}
                        style={{
                            height: item,
                            backgroundColor: props.color[i],
                        }}
                    ></li>
                );
            })}
        </ul>
    );
}

export default GroupedBar;
