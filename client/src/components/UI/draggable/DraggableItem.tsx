import { css } from '@emotion/react';
import { PropsWithChildren } from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { useAppDispatch } from '../../../hooks/useRedux';
import { uiActions } from '../../../store/ui';
import Button from '../button/Button';

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

  let buttonAreaWidth = '10%';
  if (onRemove && onEdit) {
    buttonAreaWidth = preventDrag ? '20%' : '30%';
  } else if (onRemove || onEdit) {
    buttonAreaWidth = preventDrag ? '10%' : '20%';
  }

  const draggingStyle = css({
    backgroundColor: '#fff',
    // padding: '0.5rem',
    borderRadius: '0.5rem',
    boxShadow: 'var(--shadow-0.2)',
  });

  const buttonsStyle = css({
    width: buttonAreaWidth,
    // TODO: !important 없애기... 어디서 뭐가 잘못된걸까
    '& > *': { fontSize: 'var(--text-sm) !important', font: 'var(--fa-font-solid)' },
    '& .draggable-button-pencil::before': {
      content: '"\\f303"',
    },
    '& .draggable-button-confirm::before': {
      content: '"\\f00c"',
    },
    '& .draggable-button-trash::before': {
      content: '"\\f2ed"',
    },
    '& .draggable-button-handle::before': {
      content: '"\\f0c9"',
    },
  });

  return (
    <Draggable draggableId={id} key={id} index={idx} isDragDisabled={preventDrag}>
      {(provided, snapshot) => {
        const lockedProvided = lockXAxis(provided);
        return (
          <li
            key={idx}
            {...lockedProvided.draggableProps}
            ref={lockedProvided.innerRef}
            className={`flex j-between i-center ${className}`}
            css={snapshot.isDragging ? itemStyle : draggingStyle}
          >
            <div className="w-100 flex i-center" css={css({ gap: '3vw' })}>
              {onCheck && (
                <input
                  id={`draggable-check-${id}`}
                  type="checkbox"
                  name="category-setting"
                  checked={checked || false}
                  onChange={checkHandler}
                  value={id}
                />
              )}
              {onCheck ? (
                <label htmlFor={`draggable-check-${id}`}>{children}</label>
              ) : (
                <div className="w-100 flex" css={css({ gap: '3vw' })}>
                  {children}
                </div>
              )}
            </div>
            <div className="flex j-between shrink-0" css={buttonsStyle}>
              {onEdit && (
                <Button
                  className="draggable-button-pencil"
                  styleClass="extra"
                  onClick={editHandler}
                />
              )}
              {onRemove && (
                <Button
                  className="draggable-button-trash"
                  styleClass="extra"
                  onClick={removeHandler}
                />
              )}
              {!preventDrag && (
                <div
                  {...provided.dragHandleProps}
                  className="draggable-button-handle w-100 flex-center semi-bold round-sm"
                />
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
