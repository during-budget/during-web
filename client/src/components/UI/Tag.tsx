import classes from './Tag.module.css';

function Tag(props: { isDark?: boolean; children: React.ReactNode }) {
    return (
        <span className={`${classes.tag} ${props.isDark ? classes.dark : ''}`}>
            {props.children}
        </span>
    );
}

export default Tag;
