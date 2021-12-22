import { readFileSync } from "fs";

interface Input {
  algo: string;
  image: string[];
}

const parseInput = (): Input => {
  const input = readFileSync("input/20").toString();

  const lines = input.split("\n");

  return {
    algo: lines[0],
    image: lines.slice(2)
  };
};

const getNeighbors = (image: string[], i: number, j: number, border: boolean): string => {
  const neighbors = [
    [i - 1, j - 1],
    [i - 1, j],
    [i - 1, j + 1],
    [i, j - 1],
    [i, j],
    [i, j + 1],
    [i + 1, j - 1],
    [i + 1, j],
    [i + 1, j + 1]
  ];

  return neighbors.reduce<string>((acc, [y, x]) => {
    if (y < 0 || x < 0 || y >= image.length || x >= image[0].length) {
      return acc + (border ? "1" : "0");
    }

    return acc + (image[y].charAt(x) === "#" ? "1" : "0");
  }, "");
};

const getNewPixel = (algo: string, neighbors: string): string => {
  const index = parseInt(neighbors, 2);

  return algo.charAt(index);
};

const enhance = (algo: string, image: string[], border: boolean): string[] => {
  const enhanced: string[] = [];

  for (let i = -1; i < image.length + 1; i++) {
    let line: string = "";
    for (let j = -1; j < image[0].length + 1; j++) {
      const neighbors = getNeighbors(image, i, j, border);
      const pixel = getNewPixel(algo, neighbors);
      line += pixel;
    }
    enhanced.push(line);
  }

  return enhanced;
};

export const day20Part1 = () => {
  const input = parseInput();

  // this means that every odd row there's a border of #
  const toggle = input.algo.charAt(0) === "#";

  let image = input.image;

  for (let i = 0; i < 2; i++) {
    image = enhance(input.algo, image, toggle && i % 2 === 1);
  }

  const lights = image.reduce(
    (sum, row) =>
      sum + row.split("").reduce<number>((sum, cell) => sum + (cell === "#" ? 1 : 0), 0),
    0
  );

  return lights;
};

export const day20Part2 = () => {
  const input = parseInput();

  // this means that every odd row there's a border of #
  const toggle = input.algo.charAt(0) === "#";

  let image = input.image;

  for (let i = 0; i < 50; i++) {
    image = enhance(input.algo, image, toggle && i % 2 === 1);
  }

  const lights = image.reduce(
    (sum, row) =>
      sum + row.split("").reduce<number>((sum, cell) => sum + (cell === "#" ? 1 : 0), 0),
    0
  );

  return lights;
};
