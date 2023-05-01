import { PropsWithChildren } from 'react';
import { Draggable } from 'react-beautiful-dnd';
import Button from './Button';
import classes from './DraggableItem.module.css';

interface DraggableItemProps {
  id: string;
  idx: number;
  onRemove?: (idx: number) => void;
  className?: string;
}

const DraggableItem = ({
  id,
  idx,
  onRemove,
  className,
  children,
}: PropsWithChildren<DraggableItemProps>) => {
  const removeHandler = () => {
    onRemove && onRemove(idx);
  };

  return (
    <Draggable draggableId={id} key={id} index={idx}>
      {(provided, snapshot) => {
        const lockedProvided = lockXAxis(provided);
        return (
          <li
            key={idx}
            {...lockedProvided.draggableProps}
            ref={lockedProvided.innerRef}
            className={`${classes.container} ${
              snapshot.isDragging ? classes.dragging : ''
            } ${className}`}
          >
            {children}
            <div className={`${classes.buttons} ${onRemove ? classes.md : classes.sm}`}>
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

const lockXAxis = (provided: any) => {
  const transform = provided.draggableProps!.style!.transform;
  if (transform) {
    var t = transform.split(',')[1];
    provided.draggableProps!.style!.transform = 'translate(0px,' + t;
  }
  return provided;
};

export default DraggableItem;