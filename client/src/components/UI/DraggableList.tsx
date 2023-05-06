import { PropsWithChildren } from 'react';
import { DragDropContext, Droppable, OnDragEndResponder } from 'react-beautiful-dnd';

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
  const sortHandler: OnDragEndResponder = (result) => {
    if (!result.destination) return;
    const items = [...list!];

    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setList!(items);
    onDragEnd && onDragEnd(items);
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
