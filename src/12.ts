import { readFileSync } from "fs";

interface Segment {
  key: string;
  isCapital: boolean;
  connections: string[];
}

const parseInput = (): { [key: string]: Segment } => {
  const input = readFileSync("input/12").toString();
  const data: { [key: string]: Segment } = {};
  input.split("\n").forEach(element => {
    const [seg1, seg2] = element.split("-");
    if (!data[seg1]) {
      data[seg1] = {
        key: seg1,
        isCapital: seg1 === seg1.toUpperCase(),
        connections: [seg2]
      };
    } else {
      data[seg1].connections.push(seg2);
    }

    if (!data[seg2]) {
      data[seg2] = {
        key: seg2,
        isCapital: seg2 === seg2.toUpperCase(),
        connections: [seg1]
      };
    } else {
      data[seg2].connections.push(seg1);
    }
  });

  return data;
};

const data = parseInput();

const checkPaths = (key: string, data: { [key: string]: Segment }, visited: string[]): string[] => {
  if (key === "end") {
    return ["end"];
  }

  const possible = data[key].connections.filter(conn => {
    return data[conn].isCapital || !visited.includes(conn);
  });

  let paths: string[] = [];

  for (const p of possible) {
    const pa = checkPaths(p, data, [...visited, key]);
    paths.push(...pa.map(path => `${key}-${path}`));
  }

  return paths;
};

export const day12Part1 = () => {
  const dataCopy: { [key: string]: Segment } = JSON.parse(JSON.stringify(data));

  const smallCaves = Object.values(data)
    .filter(seg => seg.isCapital)
    .map(seg => `-${seg.key}-`);

  const paths = checkPaths("start", dataCopy, []);

  let count = 0;

  for (const path of paths) {
    let smallCaveCount = 0;
    for (const cave of smallCaves) {
      if (path.includes(cave)) {
        smallCaveCount++;
        break;
      }
    }

    if (smallCaveCount < 2) {
      count++;
    }
  }

  return count;
};

const checkPathsPart2 = (
  key: string,
  data: { [key: string]: Segment },
  visited: string[],
  exception: string
): string[] => {
  if (key === "end") {
    return ["end"];
  }

  const exceptionAvailable = visited.filter(v => v === exception).length < 2;

  const possible = data[key].connections.filter(conn => {
    return (
      data[conn].isCapital || !visited.includes(conn) || (exceptionAvailable && conn === exception)
    );
  });

  let paths: string[] = [];

  for (const p of possible) {
    const pa = checkPathsPart2(p, data, [...visited, key], exception);
    paths.push(...pa.map(path => `${key}-${path}`));
  }

  return paths;
};

const mergeIfNotInArray = (arr: string[], arr2: string[]): string[] => {
  return arr.concat(arr2.filter(e => !arr.includes(e)));
};

export const day12Part2 = () => {
  const smallCaves = Object.values(data)
    .filter(seg => !seg.isCapital && seg.key !== "start" && seg.key !== "end")
    .map(seg => seg.key);

  let paths: string[] = [];

  for (const smallCave of smallCaves) {
    paths = mergeIfNotInArray(paths, checkPathsPart2("start", data, [], smallCave));
  }

  return paths.length;
};
