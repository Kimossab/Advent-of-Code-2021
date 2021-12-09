import { readFileSync } from "fs";

enum Movement {
  Forward = "forward",
  Up = "up",
  Down = "down"
}

const parseInput = (): { mov: Movement; distance: number }[] => {
  const input = readFileSync("input/2").toString();
  return input.split("\n").map(l => {
    const [mov, distance] = l.split(" ");
    return { mov: mov as unknown as Movement, distance: Number(distance) };
  });
};

const data = parseInput();

export const movePart1 = () => {
  let x = 0;
  let depth = 0;

  for (const mov of data) {
    switch (mov.mov) {
      case Movement.Forward:
        x += mov.distance;
        break;
      case Movement.Up:
        depth -= mov.distance;
        break;
      case Movement.Down:
        depth += mov.distance;
        break;
    }
  }

  return x * depth;
};

export const movePart2 = () => {
  let x = 0;
  let depth = 0;
  let aim = 0;

  for (const mov of data) {
    switch (mov.mov) {
      case Movement.Forward:
        x += mov.distance;
        depth += aim * mov.distance;
        break;
      case Movement.Up:
        aim -= mov.distance;
        break;
      case Movement.Down:
        aim += mov.distance;
        break;
    }
  }

  return x * depth;
};
