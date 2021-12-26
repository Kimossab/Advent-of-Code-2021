import { readFileSync } from "fs";

enum Direction {
  East = ">",
  South = "v",
  Empty = "."
}

const printMap = (map: Direction[][], step = 0): void => {
  console.log(`Step ${step}`);
  for (const line of map) {
    console.log(line.join(""));
  }

  console.log("\n");
};

const doMovement = (map: Direction[][]): { map: Direction[][]; movements: number } => {
  let newMap = JSON.parse(JSON.stringify(map));
  let movements = 0;

  // do east
  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[y].length; x++) {
      const nextX = x === map[y].length - 1 ? 0 : x + 1;

      const current = map[y][x];
      const next = map[y][nextX];

      if (current === Direction.East && next === Direction.Empty) {
        newMap[y][x] = Direction.Empty;
        newMap[y][nextX] = Direction.East;
        movements++;
      }
    }
  }

  // do south
  for (let y = 0; y < map.length; y++) {
    const nextY = y === map.length - 1 ? 0 : y + 1;
    for (let x = 0; x < map[y].length; x++) {
      const current = map[y][x];
      const nextOldMap = map[nextY][x];
      const nextNewMap = newMap[nextY][x];

      const actualNext =
        nextNewMap === Direction.East
          ? Direction.East
          : nextOldMap === Direction.South
          ? Direction.South
          : Direction.Empty;

      if (current === Direction.South && actualNext === Direction.Empty) {
        newMap[y][x] = Direction.Empty;
        newMap[nextY][x] = Direction.South;
        movements++;
      }
    }
  }

  return {
    map: newMap,
    movements
  };
};

const parseInput = (): Direction[][] => {
  const input = readFileSync("input/25").toString();
  return input.split("\n").map(line => line.split("").map(c => c as Direction));
};

export const day25Part1 = () => {
  let map = parseInput();
  let step = 0;

  while (true) {
    const result = doMovement(map);
    step++;

    if (result.movements === 0) {
      break;
    }

    map = result.map;
  }

  return step;
};

export const day25Part2 = () => {
  return "Finally it's over (there's no part 2)";
};
