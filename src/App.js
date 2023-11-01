import "./App.css";
import React, { useState } from "react";
import { data } from "./data/data";
import { closestCenter, DndContext } from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const SortableImg = ({ img }) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: img.id });
  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="img"
    >
      {img.name}
      <img src={img.path} alt=""/>
    </div>
  );
};

const App = () => {
  const [images, setImages] = useState(data);
  const [inputValue, setInputValue] = useState("");
  const addImg = () => {
    const newImg = {
      id: Date.now().toString(),
      name: inputValue,
    };
    setInputValue("");
    setImages((images) => [...images, newImg]);
  };

  const onDragEnd = (event) => {
    const { active, over } = event;
    if (active.id === over.id) {
      return;
    }
    setImages((images) => {
      const oldIndex = images.findIndex((img) => img.id === active.id);
      const newIndex = images.findIndex((img) => img.id === over.id);
      return arrayMove(images, oldIndex, newIndex);
    });
  };

  return (
    <div className="images">
      <div>Total: {images.length}</div>
      <div className="images-form">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <button onClick={addImg}>Add Image</button>
      </div>
      <div>
        <DndContext collisionDetection={closestCenter} onDragEnd={onDragEnd}>
          <SortableContext items={images} strategy={verticalListSortingStrategy}>
            {images.map((img) => (
              <SortableImg key={img.id} img={img} />
            ))}
          </SortableContext>
        </DndContext>
      </div>
    </div>
  );
};

export default App;
