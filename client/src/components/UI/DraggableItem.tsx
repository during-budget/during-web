import { PropsWithChildren } from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { useAppDispatch } from '../../hooks/useRedux';
import { uiActions } from '../../store/ui';
import Button from './button/Button';
import classes from './DraggableItem.module.css';

interface DraggableItemProps {
  id: string;
  idx: number;
  onRemove?: (idx: number, id?: string) => void;
  onEdit?: (idx: number, id?: string) => void;
  onCheck?: (idx: number, id?: string, checked?: boolean) => void;
  checked?: boolean;
  preventDrag?: boolean;
  className?: string;
}

const DraggableItem = ({
  id,
  idx,
  onRemove,
  onEdit,
  onCheck,
  checked,
  preventDrag,
  className,
  children,
}: PropsWithChildren<DraggableItemProps>) => {
  const dispatch = useAppDispatch();

  const removeHandler = () => {
    dispatch(
      uiActions.showModal({
        title: '정말 삭제할까요?',
        onConfirm: () => {
          onRemove && onRemove(idx, id);
        },
      })
    );
  };

  const editHandler = () => {
    onEdit && onEdit(idx, id);
  };

  const checkHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = event.target;
    onCheck && onCheck(idx, value, checked);
  };

  let buttonAreaClass = classes.sm;
  if (onRemove && onEdit) {
    buttonAreaClass = preventDrag ? classes.md : classes.lg;
  } else if (onRemove || onEdit) {
    buttonAreaClass = preventDrag ? classes.sm : classes.md;
  }

  return (
    <Draggable draggableId={id} key={id} index={idx} isDragDisabled={preventDrag}>
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
                  checked={checked || false}
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
              {!preventDrag && (
                <div {...provided.dragHandleProps} className={classes.handle} />
              )}
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
