import classes from './SettingList.module.css';
import SettingItem from './SettingItem';

function SettingList(props: {
    title: string;
    items: { icon: string; label: string; to: string }[];
}) {
    return (
        <ul className={classes.container}>
            <h5>{props.title}</h5>
            {props.items.map((item) => (
                <SettingItem icon={item.icon} label={item.label} to={item.to} />
            ))}
        </ul>
    );
}

export default SettingList;
