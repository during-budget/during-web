import { PropsWithChildren } from 'react';
import { DragDropContext, Droppable, OnDragEndResponder } from 'react-beautiful-dnd';

interface DraggableListProps {
  id: string;
  sortHandler: OnDragEndResponder;
  className?: string;
}

const DraggableList = ({
  id,
  sortHandler,
  className,
  children,
}: PropsWithChildren<DraggableListProps>) => {
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
