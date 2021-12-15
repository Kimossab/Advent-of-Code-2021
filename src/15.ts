import { readFileSync } from "fs";

interface Cell {
  risk: number;
  shortestPath: number;
}

const parseInput = (): Cell[][] => {
  const input = readFileSync("input/15").toString();
  return input.split("\n").reduce<Cell[][]>((acc, line) => {
    acc.push(
      line.split("").reduce<Cell[]>(
        (acc, risk) => [
          ...acc,
          {
            risk: parseInt(risk, 10),
            shortestPath: Infinity
          }
        ],
        []
      )
    );
    return acc;
  }, []);
};

let shortest = Infinity;

const calculateShortestPath = (
  table: Cell[][],
  x: number,
  y: number,
  current: number = 0
): number => {
  if (x < 0 || y < 0 || x >= table.length || y >= table[0].length) {
    return Infinity;
  }

  const risk = table[x][y].risk + current;

  if (risk >= shortest) {
    return Infinity;
  }

  if (risk >= table[x][y].shortestPath) {
    return Infinity;
  }

  if (x === table.length - 1 && y === table[0].length - 1) {
    if (risk < shortest) {
      shortest = risk;
      return risk;
    }
    return Infinity;
  }

  table[x][y].shortestPath = risk;

  const topPath = calculateShortestPath(table, x, y - 1, risk);
  const rightPath = calculateShortestPath(table, x + 1, y, risk);
  const bottomPath = calculateShortestPath(table, x, y + 1, risk);
  const leftPath = calculateShortestPath(table, x - 1, y, risk);

  return Math.min(topPath, rightPath, bottomPath, leftPath);
};

export const day15Part1 = () => {
  const table = parseInput();

  return calculateShortestPath(table, 0, 0) - table[0][0].risk;
};

const extendTable = (table: Cell[][]) => {
  const newTable: Cell[][] = [];

  for (let i = 0; i < table.length; i++) {
    if (!newTable[i]) {
      newTable[i] = [];
    }
    for (let j = 0; j < table[i].length; j++) {
      newTable[i][j] = table[i][j];

      for (let k = 0; k < 5; k++) {
        if (!newTable[i + table.length * k]) {
          newTable[i + table.length * k] = [];
        }
        for (let l = 0; l < 5; l++) {
          if (k === 0 && l === 0) {
            continue;
          }

          let risk = table[i][j].risk + k + l;

          while (risk > 9) {
            risk -= 9;
          }

          newTable[i + table.length * k][j + table[i].length * l] = {
            risk,
            shortestPath: Infinity
          };
        }
      }
    }
  }

  return newTable;
};

export const day15Part2 = () => {
  shortest = Infinity;
  const table = parseInput();

  const newTable = extendTable(table);

  return calculateShortestPath(newTable, 0, 0) - newTable[0][0].risk;
};
