import { PropsWithChildren } from 'react';
import {
  DragDropContext,
  DraggableChildrenFn,
  Droppable,
  OnDragEndResponder,
} from 'react-beautiful-dnd';

interface DraggableListProps {
  id: string;
  className?: string;
  list: any[];
  setList: (list: any[]) => void;
  onDragEnd?: (list: any[]) => void;
  isInOverlay?: boolean;
}

const DraggableList = ({
  id,
  className,
  children,
  list,
  setList,
  onDragEnd,
  isInOverlay,
}: PropsWithChildren<DraggableListProps>) => {
  const sortHandler: OnDragEndResponder = (result) => {
    if (!result.destination) return;
    const items = [...list!];

    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setList!(items);
    onDragEnd && onDragEnd(items);
  };

  const renderItem = getRenderItem(list);

  return (
    <DragDropContext onDragEnd={sortHandler}>
      <Droppable droppableId={id} renderClone={isInOverlay ? renderItem : undefined}>
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

const getRenderItem: (items: any[]) => DraggableChildrenFn =
  (items) => (provided, snapshot, rubric) =>
    (
      <div
        {...provided.draggableProps}
        {...provided.dragHandleProps}
        ref={provided.innerRef}
      >
        Item id: {items[rubric.source.index].id}
      </div>
    );

export default DraggableList;
