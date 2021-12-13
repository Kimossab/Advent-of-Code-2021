import { readFileSync } from "fs";

interface Dot {
  x: number;
  y: number;
}

interface Fold {
  x?: number;
  y?: number;
}

interface Data {
  dots: Dot[];
  folds: Fold[];
}

const parseInput = (): Data => {
  const input = readFileSync("input/13").toString();
  return input.split("\n").reduce<Data>(
    (acc, line) => {
      if (line === "") {
        return acc;
      }

      const dotMatch = /^(?<x>\d*),(?<y>\d*)$/.exec(line);

      if (dotMatch) {
        const dot: Dot = {
          x: parseInt(dotMatch.groups?.["x"] || ""),
          y: parseInt(dotMatch.groups?.["y"] || "")
        };
        acc.dots.push(dot);
      }

      const foldMatch = /^fold\salong\s(?<axis>.)=(?<value>\d*)$/.exec(line);

      if (foldMatch) {
        const fold: Fold = {
          [foldMatch.groups?.["axis"] as "x" | "y"]: parseInt(foldMatch.groups?.["value"] || "")
        };
        acc.folds.push(fold);
      }

      return acc;
    },
    { dots: [], folds: [] }
  );
};

const drawThing = (dots: Dot[]) => {
  const width = dots.reduce((acc, dot) => Math.max(acc, dot.x), -Infinity);
  const height = dots.reduce((acc, dot) => Math.max(acc, dot.y), -Infinity);

  const canvas = Array.from(Array(height + 1), () => Array.from(Array(width + 1), () => "."));

  dots.forEach(dot => {
    canvas[dot.y][dot.x] = "#";
  });

  return canvas.map(row => row.join("")).join("\n");
};

export const day13Part1 = () => {
  let { dots, folds } = parseInput();
  const fold = folds[0];

  if (fold.x) {
    let auxDots = dots.filter(dot => dot.x < fold.x!);

    for (let i = 0; i < fold.x; i++) {
      const ds = dots.filter(dot => dot.x === fold.x! * 2 - i);

      for (const d of ds) {
        if (!auxDots.find(dot => dot.y === d.y && dot.x === i)) {
          auxDots.push({ x: i, y: d.y });
        }
      }
    }

    dots = auxDots;
  }

  if (fold.y) {
    let auxDots = dots.filter(dot => dot.y < fold.y!);

    for (let i = 0; i < fold.y; i++) {
      const ds = dots.filter(dot => dot.y === fold.y! * 2 - i);

      for (const d of ds) {
        if (!auxDots.find(dot => dot.x === d.x && dot.y === i)) {
          auxDots.push({ x: d.x, y: i });
        }
      }
    }

    dots = auxDots;
  }

  return dots.length;
};

export const day13Part2 = () => {
  let { dots, folds } = parseInput();

  for (const fold of folds) {
    if (fold.x) {
      let auxDots = dots.filter(dot => dot.x < fold.x!);

      for (let i = 0; i < fold.x; i++) {
        const ds = dots.filter(dot => dot.x === fold.x! * 2 - i);

        for (const d of ds) {
          if (!auxDots.find(dot => dot.y === d.y && dot.x === i)) {
            auxDots.push({ x: i, y: d.y });
          }
        }
      }

      dots = auxDots;
    }

    if (fold.y) {
      let auxDots = dots.filter(dot => dot.y < fold.y!);

      for (let i = 0; i < fold.y; i++) {
        const ds = dots.filter(dot => dot.y === fold.y! * 2 - i);

        for (const d of ds) {
          if (!auxDots.find(dot => dot.x === d.x && dot.y === i)) {
            auxDots.push({ x: d.x, y: i });
          }
        }
      }

      dots = auxDots;
    }
  }

  return `\n${drawThing(dots)}`;
};
