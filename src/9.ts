import { readFileSync } from "fs";

const parseInput = (): number[][] => {
  const input = readFileSync("input/9").toString();
  return input.split("\n").map(line => line.split("").map(Number));
};
const data = parseInput();

const getLowestPoints = () => {
  const lowestPoints = [];
  for (const [indexLine, line] of data.entries()) {
    for (const [indexCol, col] of line.entries()) {
      const top = data[indexLine - 1] !== undefined ? data[indexLine - 1][indexCol] : 10;
      const right =
        data[indexLine][indexCol + 1] !== undefined ? data[indexLine][indexCol + 1] : 10;
      const bottom = data[indexLine + 1] !== undefined ? data[indexLine + 1][indexCol] : 10;
      const left = data[indexLine][indexCol - 1] !== undefined ? data[indexLine][indexCol - 1] : 10;

      if (col < top && col < right && col < bottom && col < left) {
        lowestPoints.push([indexLine, indexCol, col]);
      }
    }
  }
  return lowestPoints;
};

export const day9Part1 = () => {
  let sum = 0;
  const lowestPoints = getLowestPoints();

  for (const [li, ci, col] of lowestPoints) {
    sum += col + 1;
  }
  return sum;
};

interface Point {
  x: number;
  y: number;
  value: number;
  isChecked: boolean;
}

const getSize = (points: Point[], line: number, col: number, compare = -1): number => {
  const point = points.find(p => p.x === col && p.y === line);

  if (!point || point.isChecked || point.value === 9 || point.value < compare) {
    return 0;
  }

  point.isChecked = true;

  const top = getSize(points, line - 1, col, point.value);
  const right = getSize(points, line, col + 1, point.value);
  const bottom = getSize(points, line + 1, col, point.value);
  const left = getSize(points, line, col - 1, point.value);

  return top + right + bottom + left + 1;
};

const getBasinSizes = () => {
  const points: Point[] = data.reduce<Point[]>((acc, line, lineIdex) => {
    return [
      ...acc,
      ...line.map((col, index) => ({ x: index, y: lineIdex, value: col, isChecked: false }))
    ];
  }, []);

  const lowestPoints = getLowestPoints();
  const sizes = [];

  for (const [li, ci, col] of lowestPoints) {
    const pointsCopy = JSON.parse(JSON.stringify(points));
    const size = getSize(pointsCopy, li, ci);
    sizes.push(size);
  }

  return sizes;
};

export const day9Part2 = () => {
  const basins = getBasinSizes().sort((a, b) => b - a);

  return basins[0] * basins[1] * basins[2];
};
