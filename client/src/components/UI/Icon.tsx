import classes from './Icon.module.css';

const DEFAULT_SIZE = '3rem';
const DEFUALT_FONT_SIZE = '1.75rem';

function Icon(props: {
    size?: string;
    fontSize?: string;
    className?: string;
    children?: React.ReactNode;
}) {
    const width = props.size ? props.size : DEFAULT_SIZE;
    const height = props.size ? props.size : DEFAULT_SIZE;
    const fontSize = props.fontSize ? props.fontSize : DEFUALT_FONT_SIZE;
    return (
        <span
            className={`${classes.container} ${classes.className ? classes.className : ''}`}
            style={{ width, height, fontSize }}
        >
            {props.children}
        </span>
    );
}

export default Icon;
