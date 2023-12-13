import { PropsWithChildren } from 'react';
import { DragDropContext, Droppable, OnDragEndResponder } from 'react-beautiful-dnd';
import { useAppDispatch } from '../../../hooks/useRedux';
import { uiActions } from '../../../store/ui';
import { ERROR_MESSAGE } from '../../../constants/error';
import { getErrorMessage } from '../../../util/error';

interface DraggableListProps {
  id: string;
  className?: string;
  list: any[];
  setList: (list: any[]) => void;
  onDragEnd?: (list: any[]) => void;
}

const DraggableList = ({
  id,
  className,
  children,
  list,
  setList,
  onDragEnd,
}: PropsWithChildren<DraggableListProps>) => {
  const dispatch = useAppDispatch();

  const sortHandler: OnDragEndResponder = async (result) => {
    if (!result.destination) return;
    const items = [...list!];

    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setList!(items);

    try {
      onDragEnd && (await onDragEnd(items));
    } catch (error) {
      const message = getErrorMessage(error);
      dispatch(
        uiActions.showErrorModal({
          description: message || '다시 시도해주세요.',
        })
      );
      setList(list);
      if (!message) throw error;
    }
  };

  return (
    <DragDropContext onDragEnd={sortHandler}>
      <Droppable droppableId={id}>
        {(provided) => (
          <ul
            ref={provided.innerRef}
            className={`${id} ${className}`}
            {...provided.droppableProps}
          >
            {children}
            {provided.placeholder}
          </ul>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default DraggableList;
