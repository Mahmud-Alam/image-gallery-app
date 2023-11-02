import "./App.css";
import React, { useState } from "react";
import { data } from "./data/data";
import { closestCenter, DndContext } from "@dnd-kit/core";
import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const SortableImg = ({ img, firstImg }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: img.id });
  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  let cName = "";
  if (img.id === firstImg) {
    cName = "firstImg-size";
  } else {
    cName = "img-size";
  }

  return (
    <section ref={setNodeRef} style={style} {...attributes} {...listeners} className={cName}>
      <div className="img-div">
        <img src={img.path} alt="" />
        <input className="img-checkbox" type="checkbox" name="checkbox" id="checkbox"/>
      </div>
    </section>
  );
};

const App = () => {
  const [images, setImages] = useState(data);
  const addImg = (e) => {
    const selectedImg = e.target.files;
    const path = URL.createObjectURL(selectedImg[0]);

    const newImg = {
      id: Date.now().toString(),
      path: path,
    };
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

  let firstImg = images[0].id;

  return (
    <main className="container">
      <div className="text-div">Total Images: {images.length}</div>
      <div className="img-grid-section">
        <DndContext collisionDetection={closestCenter} onDragEnd={onDragEnd}>
          <SortableContext items={images} strategy={verticalListSortingStrategy}>
            {
              images.map((img) => (
                <SortableImg key={img.id} img={img} firstImg={firstImg} />
              ))
            }
          </SortableContext>
        </DndContext>

        <label className="add-images-label img-size">
          <img src="img/icon.jpg" alt="" />
          Add Images
          <input className="add-images-input" type="file" name="images" onChange={addImg} accept="image/png, image/jpeg"/>
        </label>
      </div>
    </main>
  );
};

export default App;
