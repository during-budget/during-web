import Button from '../../UI/Button';
import Icon from '../../UI/Icon';
import classes from './SettingItem.module.css';

function SettingItem(props: {
  icon?: string;
  src?: string;
  label: string;
  onClick: () => void;
}) {
  return (
    <li className={classes.container}>
      <Button
        styleClass="extra"
        onClick={() => {
          props.onClick();
        }}
      >
        {props.icon && <Icon>{props.icon}</Icon>}
        {props.src && <img style={{ width: '3rem' }} src={props.src} />}
        <p>{props.label}</p>
      </Button>
    </li>
  );
}

export default SettingItem;
