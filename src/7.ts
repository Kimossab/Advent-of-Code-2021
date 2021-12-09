import { readFileSync } from "fs";

const parseInput = (): number[] => {
  const input = readFileSync("input/7").toString();
  return input.split(",").map(Number);
};

const data = parseInput();

export const day7Part1 = () => {
  const highest = Math.max(...data);
  let maxCost = 999999999;

  for (let i = 0; i < highest; i++) {
    let cost = 0;
    for (const crab of data) {
      cost += Math.abs(crab - i);
      if (cost > maxCost) {
        break;
      }
    }

    if (cost < maxCost) {
      maxCost = cost;
    }
  }

  return maxCost;
};

const summation = (value: number): number => {
  return (value * (value + 1)) / 2;
};

export const day7Part2 = () => {
  const highest = Math.max(...data);
  let maxCost = 999999999;

  for (let i = 0; i < highest; i++) {
    let cost = 0;
    for (const crab of data) {
      cost += summation(Math.abs(crab - i));
      if (cost > maxCost) {
        break;
      }
    }

    if (cost < maxCost) {
      maxCost = cost;
    }
  }

  return maxCost;
};
