import { readFileSync } from "fs";

const parseInput = (): Line[] => {
  const input = readFileSync("input/5").toString();
  const lines: Line[] = [];
  for (const line of input.split("\n")) {
    const match = /(?<x1>\d*),(?<y1>\d*)\s->\s(?<x2>\d*),(?<y2>\d*)/gm.exec(line);

    if (match?.groups) {
      lines.push({
        x1: parseInt(match.groups["x1"]),
        y1: parseInt(match.groups["y1"]),
        x2: parseInt(match.groups["x2"]),
        y2: parseInt(match.groups["y2"])
      });
    }
  }
  return lines;
};

interface Line {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

const data = parseInput();

export const day5Part1 = () => {
  const allPoints: { [key: string]: number } = {};
  for (const line of data) {
    let startX = Math.min(line.x1, line.x2);
    let endX = Math.max(line.x1, line.x2);
    let startY = Math.min(line.y1, line.y2);
    let endY = Math.max(line.y1, line.y2);

    if (startX === endX) {
      for (let y = startY; y <= endY; y++) {
        if (!allPoints[`${startX},${y}`]) {
          allPoints[`${startX},${y}`] = 1;
        } else {
          allPoints[`${startX},${y}`]++;
        }
      }
    } else if (startY === endY) {
      for (let x = startX; x <= endX; x++) {
        if (!allPoints[`${x},${startY}`]) {
          allPoints[`${x},${startY}`] = 1;
        } else {
          allPoints[`${x},${startY}`]++;
        }
      }
    }
  }

  return Object.values(allPoints).filter(p => p > 1).length;
};

export const day5Part2 = () => {
  const allPoints: { [key: string]: number } = {};

  for (const line of data) {
    if (line.x1 === line.x2) {
      let startX = Math.min(line.x1, line.x2);
      let startY = Math.min(line.y1, line.y2);
      let endY = Math.max(line.y1, line.y2);

      for (let y = startY; y <= endY; y++) {
        if (!allPoints[`${startX},${y}`]) {
          allPoints[`${startX},${y}`] = 1;
        } else {
          allPoints[`${startX},${y}`]++;
        }
      }
    } else if (line.y1 === line.y2) {
      let startX = Math.min(line.x1, line.x2);
      let endX = Math.max(line.x1, line.x2);
      let startY = Math.min(line.y1, line.y2);

      for (let x = startX; x <= endX; x++) {
        if (!allPoints[`${x},${startY}`]) {
          allPoints[`${x},${startY}`] = 1;
        } else {
          allPoints[`${x},${startY}`]++;
        }
      }
    } else {
      let xDiff = line.x2 - line.x1 > 0 ? 1 : -1;
      let yDiff = line.y2 - line.y1 > 0 ? 1 : -1;

      for (let x = line.x1, y = line.y1; x !== line.x2; x += xDiff, y += yDiff) {
        if (!allPoints[`${x},${y}`]) {
          allPoints[`${x},${y}`] = 1;
        } else {
          allPoints[`${x},${y}`]++;
        }
      }
      if (!allPoints[`${line.x2},${line.y2}`]) {
        allPoints[`${line.x2},${line.y2}`] = 1;
      } else {
        allPoints[`${line.x2},${line.y2}`]++;
      }
    }
  }

  return Object.values(allPoints).filter(p => p > 1).length;
};
