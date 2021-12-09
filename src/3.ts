import { readFileSync } from "fs";

const parseInput = (): string[] => {
  const input = readFileSync("input/3").toString();
  return input.split("\n");
};

const data = parseInput();

const mostCommonBit = (input: string[]): number[] => {
  const length = input[0].length;
  const count = Array(length).fill(0);

  for (const line of input) {
    for (let i = 0; i < length; i++) {
      count[i] += Number(line.charAt(i));
    }
  }
  return count.map(x => (x >= input.length / 2 ? 1 : 0));
};

export const part1 = () => {
  const mcBit = mostCommonBit(data);
  const gamma = parseInt(mcBit.join(""), 2);
  const epsilon = parseInt(mcBit.map(x => (x === 0 ? 1 : 0)).join(""), 2);

  return gamma * epsilon;
};

const getOxygen = (input: string[]): number => {
  let leftNumbers: string[] = JSON.parse(JSON.stringify(input));
  let index = 0;
  let subString = "";
  while (leftNumbers.length > 1 && index < leftNumbers[0].length) {
    const mcBit = mostCommonBit(leftNumbers);
    subString += mcBit[index].toString();
    leftNumbers = leftNumbers.filter(num => num.startsWith(subString));
    index++;
  }
  return parseInt(leftNumbers[0], 2);
};
const getScrubberRate = (input: string[]): number => {
  let leftNumbers: string[] = JSON.parse(JSON.stringify(input));
  let index = 0;
  let subString = "";
  while (leftNumbers.length > 1 && index < leftNumbers[0].length) {
    const mcBit = mostCommonBit(leftNumbers);
    subString += mcBit[index] === 1 ? "0" : "1";
    leftNumbers = leftNumbers.filter(num => num.startsWith(subString));
    index++;
  }
  return parseInt(leftNumbers[0], 2);
};

export const part2 = () => {
  const oxygen = getOxygen(data);
  const scrubberRate = getScrubberRate(data);
  return oxygen * scrubberRate;
};
