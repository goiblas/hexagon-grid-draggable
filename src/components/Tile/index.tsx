import styled from "@emotion/styled";
import React, { MouseEvent, useRef, useState } from "react";
import { useDrag } from "../Drag/DragProvider";

const Container = styled.div``;

const EmptyButtom = styled.button`
  background: transparent;
  border: 0;
  cursor: pointer;
  clip-path: polygon(50% 0, 100% 25%, 100% 75%, 50% 100%, 0 75%, 0 25%);
`;
const Wrapper = styled.div`
  display: grid;
  width: 200px;
  height: 200px;
  > * {
    grid-area: 1/ -1;
  }
`;
const Background = styled.div<{ actived: boolean }>`
  clip-path: polygon(50% 0, 100% 25%, 100% 75%, 50% 100%, 0 75%, 0 25%);
  background-color: ${({ actived }) => (actived ? "#D8FBFE" : "#ddd")};
`;

type Props = {
  dragId: string;
  onCreate: (content: string) => void;
};

const Tile: React.FC<Props> = ({ dragId, children, onCreate }) => {
  const { selected, isDragging } = useDrag();
  const handleClick = () => onCreate("nuevo contenido");

  return (
    <Wrapper>
      <Background data-tile-id={dragId} actived={selected === dragId} />
      {children ? (
        <Container>{children}</Container>
      ) : (
        !isDragging && <EmptyButtom onClick={handleClick} />
      )}
    </Wrapper>
  );
};

export default Tile;
