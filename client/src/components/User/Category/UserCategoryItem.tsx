import { Draggable } from 'react-beautiful-dnd';
import classes from './UserCategoryItem.module.css';
import Button from '../../UI/Button';
import EmojiInput from '../../Budget/Input/EmojiInput';

function UserCategoryItem(props: {
    index: number;
    id: string;
    icon: string;
    title: string;
    onRemove: (idx: number) => void;
    setIcon: (idx: number, icon: string) => void;
    setTitle: (idx: number, title: string) => void;
}) {
    const editIconHandler = (icon: string) => {
        props.setIcon(props.index, icon);
    };

    const editTitleHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        props.setTitle(props.index, event.target.value);
    };

    const removeHandler = () => {
        props.onRemove(props.index);
    };

    return (
        <Draggable
            draggableId={`draggable-${props.index}`}
            index={props.index}
            key={`draggable-${props.index}`}
        >
            {(provided, snapshot) => {
                const lockedProvided = lockXAxis(provided);
                return (
                    <li
                        key={props.index}
                        id={props.id}
                        {...lockedProvided.draggableProps}
                        ref={lockedProvided.innerRef}
                        className={`${classes.container} ${
                            snapshot.isDragging ? classes.dragging : ''
                        }`}
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
                                className={classes.trash}
                                styleClass="extra"
                                onClick={removeHandler}
                            />
                            <div
                                {...provided.dragHandleProps}
                                className={classes.handle}
                            />
                        </div>
                    </li>
                );
            }}
        </Draggable>
    );
}

const lockXAxis = (provided: any) => {
    const transform = provided.draggableProps!.style!.transform;
    if (transform) {
        var t = transform.split(',')[1];
        provided.draggableProps!.style!.transform = 'translate(0px,' + t;
    }
    return provided;
};

export default UserCategoryItem;
