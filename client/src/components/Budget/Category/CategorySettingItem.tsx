import classes from './CategorySettingItem.module.css';
import Button from '../../UI/Button';
import EmojiInput from '../Input/EmojiInput';

// NOTE: UserCategorySetting에도 본 컴포넌트 사용 (isChecked === undefined)
function CategorySettingItem(props: {
    idx: number;
    id: string;
    icon: string;
    title: string;
    isDefault?: boolean;
    isChecked?: boolean;
    setIsChecked?: (id: string, checked: boolean) => void;
}) {
    const isCheckItem = props.isChecked !== undefined;
    const checkedHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        props.setIsChecked &&
            props.setIsChecked(event.target.value, event.target.checked);
    };

    const removeHandler = () => {};

    const removeClass = props.isDefault ? classes.default : classes.trash;

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
                    <EmojiInput
                        className={classes.icon}
                        defaultValue={props.icon}
                    ></EmojiInput>
                    <input
                        className={classes.title}
                        type="text"
                        defaultValue={props.title}
                    />
                </div>
                <div className={classes.buttons}>
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
