import React, { useEffect, useRef } from "react";
import { Droppable } from "@shopify/draggable";

const useDrag = () => {
  const containerRef = useRef();
  useEffect(() => {
    let droppable; 

    if (containerRef.current) {
      droppable = new Droppable(document.querySelectorAll('.container'), {
        draggable: '.item',
        dropzone: '.dropzone'
      });

      droppable.on('droppable:stop', (ev) => console.log(ev.dragEvent.source.parentNode));
    }

    return () => droppable?.destroy();
  }, [containerRef]);

  return {ref : containerRef};
};


export default useDrag