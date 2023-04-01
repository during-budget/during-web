import Icon from '../../UI/Icon';

function CategorySettingItem(props: {
    id: string;
    icon: string;
    title: string;
    onChecked?: (id: string) => void;
}) {
    return (
        <li>
            <Icon>{props.icon}</Icon>
            <span>{props.title}</span>
            <div></div>
        </li>
    );
}

export default CategorySettingItem;
