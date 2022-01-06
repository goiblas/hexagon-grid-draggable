export interface HexagonTile {
    id: string,
    position: {
        x: number,
        y: number
    },
    content: string
}

export type Board = Array<Array<HexagonTile | null>>;

const hexagon: HexagonTile = {
    id: "a1",
    position: {
        x: 1,
        y: 0
    },
    content: "contenido"
};

export const board: Board = [
    [null, null, hexagon, null],
    [null, null, hexagon, null],
    [null, null, hexagon, null],
]