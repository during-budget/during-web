import SettingItem from './SettingItem';
import classes from './SettingList.module.css';

function SettingList(props: {
  title: string;
  items: { icon?: string; src?: string; label: string; onClick: () => void }[];
}) {
  return (
    <ul className={classes.container}>
      <h5>{props.title}</h5>
      {props.items.map((item, i) => (
        <SettingItem
          key={i}
          icon={item.icon}
          src={item.src}
          label={item.label}
          onClick={item.onClick}
        />
      ))}
    </ul>
  );
}

export default SettingList;
