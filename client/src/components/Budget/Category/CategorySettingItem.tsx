import classes from './CategorySettingItem.module.css';
import Icon from '../../UI/Icon';
import Button from '../../UI/Button';

// NOTE: UserCategorySetting에도 본 컴포넌트 사용 (isChecked === undefined)
function CategorySettingItem(props: {
    id: string;
    icon: string;
    title: string;
    isDefault?: boolean;
    isChecked?: boolean;
    setIsChecked?: (id: string, checked: boolean) => void;
}) {
    const removeClass = props.isDefault ? classes.default : classes.trash;
    const isCheckItem = props.isChecked !== undefined;

    const checkedHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        props.setIsChecked &&
            props.setIsChecked(event.target.value, event.target.checked);
    };

    const editHandler = () => {};

    const removeHandler = () => {};

    return (
        <li className={classes.container}>
            {isCheckItem && (
                <input
                    className={classes.check}
                    type="checkbox"
                    name="category-setting"
                    checked={props.isChecked}
                    onChange={checkedHandler}
                    value={props.id}
                    disabled={props.isDefault}
                ></input>
            )}
            <div
                className={classes.content}
                style={{
                    width: isCheckItem ? '90%' : '100%',
                }}
            >
                <div className={classes.info}>
                    <Icon>{props.icon}</Icon>
                    <span>{props.title}</span>
                </div>
                <div className={classes.buttons}>
                    <Button
                        className={classes.pencil}
                        styleClass="extra"
                        onClick={editHandler}
                    ></Button>
                    <Button
                        className={removeClass}
                        styleClass="extra"
                        onClick={removeHandler}
                    ></Button>
                    <Button
                        className={classes.bars}
                        styleClass="extra"
                    ></Button>
                </div>
            </div>
        </li>
    );
}

export default CategorySettingItem;
