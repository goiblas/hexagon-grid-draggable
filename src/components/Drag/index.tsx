import styled from "@emotion/styled";
import React, { MouseEvent, useRef, useState } from "react";
import { Global, css } from "@emotion/react";
import { useDrag } from "./DragProvider";

const disableSelection = css`
  body {
    user-select: none;
  }
`;

const Container = styled.div<{ dragging: Boolean }>`
  width: 200px;
  height: 200px;
  cursor: pointer;
  background-image: url("https://source.unsplash.com/random/150x150");
  background-size: cover;
  clip-path: polygon(50% 0, 100% 25%, 100% 75%, 50% 100%, 0 75%, 0 25%);
  position: absolute;
  z-index: ${({ dragging }) => (dragging ? 2 : 1)};
  transition: ${({ dragging }) => (dragging ? "none" : "transform .2s")};
`;

const Drag: React.FC<{ id: string }> = ({ children, id }) => {
  const { onDrag, onDragEnd } = useDrag();
  const dragRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const timer = useRef<NodeJS.Timeout>();
  const [start, setStart] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);

  const onMouseMove = (ev: MouseEvent<HTMLDivElement>) => {
    if (!isDragging) return;

    onDrag(ev);

    setPosition({
      x: ev.clientX - start.x,
      y: ev.clientY - start.y,
    });
  };

  const onMouseDown = (ev: MouseEvent<HTMLDivElement>) => {
    setIsDragging(true);

    const refPosition = dragRef.current?.getBoundingClientRect();
    if (refPosition) {
      setStart({ x: ev.clientX, y: ev.clientY });
    }
  };

  const reset = () => {
    setIsDragging(false);
    setStart({ x: 0, y: 0 });
    setPosition({ x: 0, y: 0 });
  };

  const onMouseUp = (ev: MouseEvent<HTMLDivElement>) => {
    onDragEnd(ev, id);
    reset();
  };

  const onMouseOver = () => {
    if (isDragging && timer.current) {
      clearTimeout(timer.current);
    }
  };

  const onMouseOut = () => {
    if (isDragging) {
      timer.current = setTimeout(reset, 300);
    }
  };

  return (
    <>
      <Global styles={isDragging && disableSelection} />

      <Container
        ref={dragRef}
        style={{
          transform: `translate(${position.x}px, ${position.y}px)`,
        }}
        onMouseUp={onMouseUp}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseOut={onMouseOut}
        onMouseOver={onMouseOver}
        dragging={isDragging}
      >
        {children}
      </Container>
    </>
  );
};

export default Drag;
