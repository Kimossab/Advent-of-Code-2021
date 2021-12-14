import { readFileSync } from "fs";

interface Insertions {
  [key: string]: string;
}

interface Table {
  template: string;
  insertions: Insertions;
}

const parseInput = (): Table => {
  const input = readFileSync("input/14").toString();
  const split = input.split("\n");

  return {
    template: split[0],
    insertions: split.slice(2).reduce<Insertions>((acc, curr) => {
      const [key, value] = curr.split(" -> ");
      acc[key as string] = value;
      return acc;
    }, {})
  };
};

const polymerStepCount: { [key: string]: { [key: string]: number } } = {};

const countPolymer = (
  polymer: string,
  insertions: Insertions,
  steps: number
): { [key: string]: number } => {
  if (polymerStepCount[polymer + steps]) {
    return polymerStepCount[polymer + steps];
  }

  if (steps === 0) {
    const data = {
      [polymer[1]]: 1
    };

    polymerStepCount[polymer + steps] = data;

    return data;
  }

  const value = insertions[polymer];
  const countLeft = countPolymer(polymer[0] + value, insertions, steps - 1);
  const countRight = countPolymer(value + polymer[1], insertions, steps - 1);

  const data = mergeElementCount(countLeft, countRight);

  polymerStepCount[polymer + steps] = data;

  return data;
};

const mergeElementCount = (
  count: { [key: string]: number },
  count2: { [key: string]: number }
): { [key: string]: number } => {
  const copy = { ...count };
  for (const elem in count2) {
    copy[elem] = (count[elem] ?? 0) + count2[elem];
  }

  return copy;
};

export const day14Part1 = () => {
  const data = parseInput();
  const { template, insertions } = data;

  let count: { [key: string]: number } = {};
  for (let i = 0; i < template.length - 1; i++) {
    count = mergeElementCount(count, countPolymer(template[i] + template[i + 1], insertions, 10));
  }
  count[template[0]]++;

  const value = Math.max(...Object.values(count)) - Math.min(...Object.values(count));
  return value;
};

export const day14Part2 = () => {
  const data = parseInput();
  const { template, insertions } = data;

  let count: { [key: string]: number } = {};
  for (let i = 0; i < template.length - 1; i++) {
    count = mergeElementCount(count, countPolymer(template[i] + template[i + 1], insertions, 40));
  }
  count[template[0]]++;

  const value = Math.max(...Object.values(count)) - Math.min(...Object.values(count));

  return `${value} = ${value === 2158894777814}`;
};
