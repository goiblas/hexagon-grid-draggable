import {
  createContext,
  useState,
  useContext,
  useCallback,
  useEffect,
} from "react";
import { Board, HexagonTile } from "../../types/HexagonTile";

type State = {
  selected: string | null;
  isDragging: boolean;
  onDrag: (coords: Coords) => void;
  onDragEnd: (coords: Coords, id?: string) => void;
  board: Board;
};

type Coords = {
  x: number;
  y: number;
  ref: HTMLElement;
};
const DragContext = createContext<State | null>(null);

type Props = {
  tiles: HexagonTile[];
  onChange: (h: HexagonTile[]) => void;
};

const createEmptyBoard = (x: number, y: number): Board => {
  const cells = Array.from({ length: x }).fill(null);
  const rows = Array.from({ length: y }).fill(cells);

  return rows as Board;
};

export const DragProvider: React.FC<Props> = ({
  children,
  tiles,
  onChange,
}) => {
  const [selected, setSelected] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [board, setBoard] = useState<Board>([]);

  useEffect(() => {
    const emptyBoard = createEmptyBoard(10, 10);
    setBoard(() => {
      return emptyBoard.map((row, y) => {
        return row.map((cell, x) => {
          return (
            tiles.find(
              ({ position }) => position.x === x && position.y === y
            ) ?? cell
          );
        });
      });
    });
  }, [tiles]);

  const onDrag = useCallback((coords: Coords) => {
    setIsDragging(true);
    coords.ref.hidden = true;
    const elemBelow = document.elementFromPoint(coords.x, coords.y);
    coords.ref.hidden = false;

    if (elemBelow) {
      const attrId = elemBelow.getAttribute("data-tile-id");
      setSelected(attrId);
    }
  }, []);

  const onDragEnd = useCallback(
    (coords: Coords, id) => {
      if (!id) {
        return;
      }
      coords.ref.hidden = true;
      let elemBelow = document.elementFromPoint(coords.x, coords.y);
      coords.ref.hidden = false;

      if (elemBelow) {
        const attrId = elemBelow.getAttribute("data-tile-id");

        if (attrId) {
          const [x, y] = attrId.split("-").map(Number);
          const match = tiles.find((tile) => tile.id === id);
          if (match && (match.position.x !== x || match.position.y !== y)) {
            const tilesUpdated = tiles.map((tile) => {
              if (tile.id === id) {
                return {
                  ...tile,
                  position: { x, y },
                };
              }
              return tile;
            });
            onChange(tilesUpdated);
          }

          setSelected(null);
        }
      }
      setIsDragging(false);
    },
    [tiles, onChange]
  );

  return (
    <DragContext.Provider
      value={{ selected, onDrag, onDragEnd, board, isDragging }}
    >
      {children}
    </DragContext.Provider>
  );
};

export const useDrag = (): State => {
  const drag = useContext(DragContext);
  if (!drag) {
    throw new Error("Should be inside drag provider");
  }
  return drag;
};
