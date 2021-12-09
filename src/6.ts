import { readFileSync } from "fs";

const parseInput = (): number[] => {
  const input = readFileSync("input/6").toString();
  return input.split(",").map(Number);
};

const countChildrenForDay = (
  bornDay: number,
  days: number,
  data: { [key: number]: number }
): number => {
  if (data[bornDay] !== undefined) {
    return data[bornDay];
  }

  let count = 1;
  for (let i = bornDay + 9; i <= days; i += 7) {
    data[i] = countChildrenForDay(i, days, data);
    count += data[i];
  }

  return count;
};

const getChildrenByBornDay = (bornDay: number, days: number): { [key: number]: number } => {
  let children: { [key: number]: number } = {};
  for (let i = bornDay; i <= days; i++) {
    if (children[i] === undefined) {
      children[i] = countChildrenForDay(i, days, children);
    }
  }

  return children;
};

export const day6Part1 = () => {
  const fishClocks = [...parseInput()].reduce<{ [key: number]: number }>((acc, curr) => {
    acc[curr] ? acc[curr]++ : (acc[curr] = 1);
    return acc;
  }, {});
  let count = 0;

  const data = getChildrenByBornDay(-8, 80);

  for (const fishDays of Object.keys(fishClocks)) {
    count += data[Number(fishDays) - 8] * fishClocks[Number(fishDays)];
  }
  return count;
};

export const day6Part2 = () => {
  const fishClocks = [...parseInput()].reduce<{ [key: number]: number }>((acc, curr) => {
    acc[curr] ? acc[curr]++ : (acc[curr] = 1);
    return acc;
  }, {});
  let count = 0;
  const data = getChildrenByBornDay(-8, 256);
  for (const fishDays of Object.keys(fishClocks)) {
    count += data[Number(fishDays) - 8] * fishClocks[Number(fishDays)];
  }
  return count;
};
