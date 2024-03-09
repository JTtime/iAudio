// components/SortableList.js
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { useState } from "react";
// import { v4 as uuidv4 } from "uuid";
// import styled from "@emotion/styled";
import styled from "styled-components";
import "./styles.css";

function SortableList({ items, setItems, enabled }) {
  const onDragEnd = (result) => {
    if (
      !result.destination ||
      result.destination.index === result.source.index
      // result.destination.droppableId === result.source.droppableId
    )
      return;

    const reorderedItems = [...items];
    const [removed] = reorderedItems.splice(result.source.index, 1);
    reorderedItems.splice(result.destination.index, 0, removed);

    setItems(reorderedItems);
  };

  const grid = 8;

  const AudioItem = styled.div`
    width: 100%;
    border: 1px solid grey;
    margin-bottom: ${grid}px;
    background-color: lightblue;
    padding: ${grid}px;
  `;

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      {enabled ? (
        <Droppable
          droppableId={"droppable"}
          type="group"
          // renderClone={(provided, snapshot, rubric) => (
          //   <div
          //     {...provided.draggableProps}
          //     {...provided.dragHandleProps}
          //     ref={provided.innerRef}
          //   >
          //     Item id: {items[rubric.source.index].id}
          //   </div>
          // )}
        >
          {(provided) => (
            <div
              // key={uuidv4}
              className="sortable-list"
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {items.map((item, index) => (
                <Draggable key={item.id} draggableId={item.id} index={index}>
                  {(provided) => (
                    <AudioItem
                      id="audio-item"
                      className="draggable-item"
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      {item.file.name}
                    </AudioItem>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      ) : null}
    </DragDropContext>
  );
}

export default SortableList;
