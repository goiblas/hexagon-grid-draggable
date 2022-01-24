import React, { useCallback, useState } from "react";
import { DragProvider } from "./components/Drag/DragProvider";
import DashBoard from "./pages/Dashboard";
import CanvasDrag from "./pages/CanvasDrag";
import { HexagonTile } from "./types/HexagonTile";
import Pinch from "./pages/Pinch";
import CanvasSvg from "./pages/CanvasSvg";
import DashboardMovable from "./pages/DashboardMovable";
import ImageCanvas from "./pages/ImageCanvas";
import MobileCanvas from "./pages/MobileCanvas";
import CanvasScroll from "./pages/CanvasScroll";

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
  const [canvasState, setCanvasState] = useState({ x: 0, y: 0, scale: 1});

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
      {/* <CanvasSvg enabled={true}>
        <DashBoard addTile={addTile} />
      </CanvasSvg> */}
      {/* <CanvasDrag enabled={true}>
        <DashBoard addTile={addTile} />
      </CanvasDrag> */}
      {/* <DashboardMovable enabled={true}>
        <DashBoard addTile={addTile} />
      </DashboardMovable> */}
      {/* <MobileCanvas 
        state={canvasState}
        onChangeState={setCanvasState}
        >
        <DashBoard addTile={addTile} />
      </MobileCanvas> */}
      {/* <ImageCanvas 
        state={canvasState}
        onChangeState={setCanvasState}
        src="http://i3.ytimg.com/vi/bNDCFBIiAe8/maxresdefault.jpg"
      /> */}

      <CanvasScroll 
        // state={canvasState}
        // onChangeState={setCanvasState}
        >
        <DashBoard addTile={addTile} />
      </CanvasScroll>
    </DragProvider>
  );
}

export default App;
