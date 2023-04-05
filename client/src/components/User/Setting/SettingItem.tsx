import classes from './SettingItem.module.css';
import Icon from '../../UI/Icon';
import Button from '../../UI/Button';

function SettingItem(props: {
    icon: string;
    label: string;
    show: (isShow: boolean) => void;
}) {
    return (
        <li className={classes.container}>
            <Button
                styleClass="extra"
                onClick={() => {
                    props.show(true);
                }}
            >
                <Icon>{props.icon}</Icon>
                <p>{props.label}</p>
            </Button>
        </li>
    );
}

export default SettingItem;
