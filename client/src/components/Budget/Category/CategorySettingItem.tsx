import classes from './CategorySettingItem.module.css';
import Button from '../../UI/Button';
import EmojiInput from '../Input/EmojiInput';

// NOTE: UserCategorySetting에도 본 컴포넌트 사용 (isChecked === undefined)
function CategorySettingItem(props: {
    handleProps?: any;
    isDragging?: boolean;
    idx: number;
    id: string;
    icon: string;
    title: string;
    isDefault?: boolean;
    isChecked?: boolean;
    setIcon: (idx: number, icon: string) => void;
    setTitle: (idx: number, title: string) => void;
    setIsChecked?: (id: string, checked: boolean) => void;
    onRemove: (idx: number) => void;
}) {
    const isCheckItem = props.isChecked !== undefined;
    const checkedHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        props.setIsChecked &&
            props.setIsChecked(event.target.value, event.target.checked);
    };

    const editIconHandler = (icon: string) => {
        props.setIcon(props.idx, icon);
    };

    const editTitleHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        props.setTitle(props.idx, event.target.value);
    };

    const removeHandler = () => {
        props.onRemove(props.idx);
    };

    const removeClass = props.isDefault ? classes.default : classes.trash;

    return (
        <li
            id={props.id}
            className={`${classes.container} ${
                props.isDragging ? classes.dragging : ''
            }`}
        >
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
                        value={props.icon}
                        onChange={editIconHandler}
                        required={true}
                    ></EmojiInput>
                    <input
                        className={classes.title}
                        type="text"
                        value={props.title}
                        onChange={editTitleHandler}
                        required
                    />
                </div>
                <div className={classes.buttons}>
                    <Button
                        className={removeClass}
                        styleClass="extra"
                        onClick={removeHandler}
                    />
                    <div {...props.handleProps} className={classes.handle} />
                </div>
            </div>
        </li>
    );
}

export default CategorySettingItem;
