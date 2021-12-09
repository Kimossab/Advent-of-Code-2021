import { readFileSync } from "fs";

interface Cell {
  x: number;
  y: number;
  value: number;
  isSelected: boolean;
}

interface Board {
  cells: Cell[];
  x: [number, number, number, number, number];
  y: [number, number, number, number, number];
}

const parseInput = (): string[] => {
  const input = readFileSync("input/4").toString();
  return input.split("\n");
};

const parseBoards = (input: string[]): Board[] => {
  const boards: Board[] = [];

  let board: Board | undefined = undefined;
  let posY = 0;

  for (const line of input) {
    if (!board) {
      board = {
        cells: [],
        x: [5, 5, 5, 5, 5],
        y: [5, 5, 5, 5, 5]
      };
      posY = 0;
    }

    if (line === "") {
      boards.push(board);
      board = undefined;
      continue;
    }

    for (let x = 0; x < 5; x++) {
      const cell: Cell = {
        x,
        y: posY,
        value: parseInt(line.slice(x * 3, x * 3 + 2)),
        isSelected: false
      };
      board.cells.push(cell);
    }
    posY++;
  }

  return boards;
};

const split = parseInput();
const data: Board[] = parseBoards(split.slice(2));
const selections = split[0].split(",").map(Number);

const sumUnselected = (board: Board): number => {
  let sum = 0;
  for (const cell of board.cells) {
    if (!cell.isSelected) {
      sum += cell.value;
    }
  }
  return sum;
};

export const day4Part1 = () => {
  let winner: Board | undefined = undefined;
  let lastSelection: number | undefined = undefined;

  for (const selection of selections) {
    lastSelection = selection;
    for (const board of data) {
      const cell = board.cells.find(c => c.value === selection);
      if (cell && !cell.isSelected) {
        cell.isSelected = true;
        board.x[cell.x]--;
        board.y[cell.y]--;

        if (board.x.some(x => x === 0) || board.y.some(y => y === 0)) {
          winner = board;
          break;
        }
      }
    }
    if (winner) {
      break;
    }
  }

  const sum = sumUnselected(winner!);
  return sum * lastSelection!;
};

export const day4Part2 = () => {
  let dataCopy = [...data];
  let winner: Board | undefined = undefined;
  let lastSelection: number | undefined = undefined;

  for (const selection of selections) {
    dataCopy = dataCopy.filter(board => !board.x.some(x => x === 0) && !board.y.some(y => y === 0));
    if (dataCopy.length === 0) {
      break;
    }

    for (const board of dataCopy) {
      const cell = board.cells.find(c => c.value === selection);

      if (cell && !cell.isSelected) {
        cell.isSelected = true;
        board.x[cell.x]--;
        board.y[cell.y]--;

        if (board.x.some(x => x === 0) || board.y.some(y => y === 0)) {
          winner = board;
          lastSelection = selection;
        }
      }
    }
  }

  const sum = sumUnselected(winner!);
  return sum * lastSelection!;
};
