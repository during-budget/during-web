import { PropsWithChildren } from 'react';
import { Draggable } from 'react-beautiful-dnd';
import Button from './Button';
import classes from './DraggableItem.module.css';

interface DraggableItemProps {
  id: string;
  idx: number;
  onRemove?: (idx: number) => void;
  onEdit?: (idx: number) => void;
  onCheck?: (idx: number) => void;
  checked?: boolean;
  className?: string;
}

const DraggableItem = ({
  id,
  idx,
  onRemove,
  onEdit,
  onCheck,
  checked,
  className,
  children,
}: PropsWithChildren<DraggableItemProps>) => {
  const removeHandler = () => {
    if (confirm('정말 삭제할까요?') === false) return;
    onRemove && onRemove(idx);
  };

  const editHandler = () => {
    onEdit && onEdit(idx);
  };

  const checkHandler = () => {
    onCheck && onCheck(idx);
  };

  let buttonAreaClass = classes.sm;
  if (onRemove && onEdit) {
    buttonAreaClass = classes.lg;
  } else if (onRemove || onEdit) {
    buttonAreaClass = classes.md;
  }

  return (
    <Draggable draggableId={id} key={id} index={idx}>
      {(provided, snapshot) => {
        const lockedProvided = lockXAxis(provided);
        return (
          <li
            key={idx}
            {...lockedProvided.draggableProps}
            ref={lockedProvided.innerRef}
            className={`${classes.draggableItem} ${
              snapshot.isDragging ? classes.dragging : ''
            } ${className}`}
          >
            <div className={classes.head}>
              {onCheck && (
                <input
                  id={`draggable-check-${id}`}
                  className={classes.check}
                  type="checkbox"
                  name="category-setting"
                  checked={checked}
                  onChange={checkHandler}
                  value={id}
                />
              )}
              {onCheck ? (
                <label htmlFor={`draggable-check-${id}`} className={classes.info}>
                  {children}
                </label>
              ) : (
                <div className={classes.childrenWrapper}>{children}</div>
              )}
            </div>
            <div className={`${classes.buttons} ${buttonAreaClass}`}>
              {onEdit && (
                <Button
                  className={classes.pencil}
                  styleClass="extra"
                  onClick={editHandler}
                />
              )}
              {onRemove && (
                <Button
                  className={classes.trash}
                  styleClass="extra"
                  onClick={removeHandler}
                />
              )}
              <div {...provided.dragHandleProps} className={classes.handle} />
            </div>
          </li>
        );
      }}
    </Draggable>
  );
};

export const lockXAxis = (provided: any) => {
  const transform = provided.draggableProps!.style!.transform;
  if (transform) {
    var t = transform.split(',')[1];
    provided.draggableProps!.style!.transform = 'translate(0px,' + t;
  }
  return provided;
};

export default DraggableItem;
