import { readFileSync } from "fs";

const parseInput = (): number[] => {
  const input = readFileSync("input/1").toString();
  return input.split("\n").map(Number);
};

const data = parseInput();

export const countIncreases = () => {
  let count = 0;
  for (let i = 1; i < data.length; i++) {
    if (data[i] > data[i - 1]) {
      count++;
    }
  }
  return count;
};

export const countIncreasesPart2 = () => {
  const reduced = data.reduce<number[]>((acc, current, index) => {
    if (index + 2 < data.length) {
      return [...acc, current + data[index + 1] + data[index + 2]];
    }
    return acc;
  }, []);

  let count = 0;
  for (let i = 1; i < reduced.length; i++) {
    if (reduced[i] > reduced[i - 1]) {
      count++;
    }
  }
  return count;
};
