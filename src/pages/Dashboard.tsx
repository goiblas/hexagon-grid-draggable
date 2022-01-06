import React, { useState, useRef, useEffect } from "react";
import Drag from "../components/Drag";
import { useDrag } from "../components/Drag/DragProvider";
import Tile from "../components/Tile";
import Row from "../components/Row";
import { HexagonTile } from "../types/HexagonTile";

type Props = {
  addTile: (t: Omit<HexagonTile, "id">) => void;
};

const App: React.FC<Props> = ({ addTile }) => {
  const { board } = useDrag();
  const add = ({
    x,
    y,
    content,
  }: {
    x: number;
    y: number;
    content: string;
  }) => {
    addTile({
      position: {
        x,
        y,
      },
      content,
    });
  };

  return (
    <div>
      <div className="container">
        {board.map((cells, y) => (
          <Row key={`row-${y}`} odd={Boolean(y % 2)}>
            {cells.map((tile, x) => (
              <Tile
                onCreate={(content) => {
                  add({ x: Number(x), y: Number(y), content });
                }}
                key={`tile-${x}`}
                dragId={`${x}-${y}`}
              >
                {tile && <Drag id={tile.id}>{tile.content}</Drag>}
              </Tile>
            ))}
          </Row>
        ))}
      </div>
    </div>
  );
};

export default App;
