import React, { useState } from "react";
import { DragProvider } from "./components/Drag/DragProvider";
import DashBoard from "./pages/Dashboard";
import { HexagonTile } from "./types/HexagonTile";

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

  const addTile = (tile: Omit<HexagonTile, "id">) => {
    const getId = () => "_" + Math.random().toString(36).substr(2, 9);
    setTiles([...tiles, { ...tile, id: getId() }]);
  };

  return (
    <DragProvider tiles={tiles} onChange={setTiles}>
      <DashBoard addTile={addTile} />
    </DragProvider>
  );
}

export default App;
