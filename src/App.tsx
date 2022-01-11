import React, { useCallback, useState } from "react";
import { DragProvider } from "./components/Drag/DragProvider";
import DashBoard from "./pages/Dashboard";
import CanvasDrag from "./pages/CanvasDrag";
import { HexagonTile } from "./types/HexagonTile";
import Pinch from "./pages/Pinch";

const initialTiles: HexagonTile[] = [
  {
    id: "a1",
    position: {
      x: 2,
      y: 1,
    },
    content: "primera",
  },
  {
    id: "a2",
    position: {
      x: 3,
      y: 2,
    },
    content: "segunda",
  },
];

function App() {
  const [tiles, setTiles] = useState(initialTiles);

  const getId = useCallback(
    () => "_" + Math.random().toString(36).substr(2, 9),
    []
  );

  const addTile = (tile: Omit<HexagonTile, "id">) => {
    setTiles([...tiles, { ...tile, id: getId() }]);
  };

  return (
    <DragProvider tiles={tiles} onChange={setTiles}>
      {/* <DashBoard addTile={addTile} /> */}
      {/* <Pinch actived={false}>
        <DashBoard addTile={addTile} />
      </Pinch> */}
      <CanvasDrag enabled={true}>
        <DashBoard addTile={addTile} />
      </CanvasDrag>
    </DragProvider>
  );
}

export default App;
