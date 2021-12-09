import { readFileSync } from "fs";

const parseInput = (): string[] => {
  const input = readFileSync("input/10").toString();
  return input.split("\n");
};

const data = parseInput();

export const day10Part1 = () => {};

export const day10Part2 = () => {};
