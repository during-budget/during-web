import { Link } from 'react-router-dom';
import classes from './SettingItem.module.css';
import Icon from '../../UI/Icon';

function SettingItem(props: { icon: string; label: string; to: string }) {
    return (
        <li className={classes.container}>
            <Link to={props.to}>
                <Icon>{props.icon}</Icon>
                <p>{props.label}</p>
            </Link>
        </li>
    );
}

export default SettingItem;
