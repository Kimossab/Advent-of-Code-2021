import { readFileSync } from "fs";

const parseInput = (): string[] => {
  const input = readFileSync("input/10").toString();
  return input.split("\n");
};

enum ChunkLimits {
  RoundOpen = "(",
  SquareOpen = "[",
  CurlyOpen = "{",
  AngledOpen = "<",
  RoundClose = ")",
  SquareClose = "]",
  CurlyClose = "}",
  AngledClose = ">"
}

enum ChunkType {
  Round = "round",
  Square = "square",
  Curly = "curly",
  Angled = "angled"
}

const openerCloserMap: { [key: string]: ChunkLimits } = {
  [ChunkLimits.RoundOpen]: ChunkLimits.RoundClose,
  [ChunkLimits.SquareOpen]: ChunkLimits.SquareClose,
  [ChunkLimits.CurlyOpen]: ChunkLimits.CurlyClose,
  [ChunkLimits.AngledOpen]: ChunkLimits.AngledClose
};
const typeMap: { [key: string]: ChunkType } = {
  [ChunkLimits.RoundOpen]: ChunkType.Round,
  [ChunkLimits.RoundClose]: ChunkType.Round,
  [ChunkLimits.SquareOpen]: ChunkType.Square,
  [ChunkLimits.SquareClose]: ChunkType.Square,
  [ChunkLimits.CurlyOpen]: ChunkType.Curly,
  [ChunkLimits.CurlyClose]: ChunkType.Curly,
  [ChunkLimits.AngledOpen]: ChunkType.Angled,
  [ChunkLimits.AngledClose]: ChunkType.Angled
};

const invalidPoints = {
  [ChunkLimits.RoundClose]: 3,
  [ChunkLimits.SquareClose]: 57,
  [ChunkLimits.CurlyClose]: 1197,
  [ChunkLimits.AngledClose]: 25137
};

const missingPoints = {
  [ChunkLimits.RoundClose]: 1,
  [ChunkLimits.SquareClose]: 2,
  [ChunkLimits.CurlyClose]: 3,
  [ChunkLimits.AngledClose]: 4
};

const data = parseInput();

const isString = (str: any): str is string => {
  return typeof str === "string";
};

export const validateChunks = (chunks: string): number | string => {
  if (chunks.length === 0) {
    return 0;
  }
  const opener = chunks.charAt(0) as ChunkLimits;

  const chunkCounter = {
    [ChunkType.Round]: 0,
    [ChunkType.Square]: 0,
    [ChunkType.Curly]: 0,
    [ChunkType.Angled]: 0
  };

  chunkCounter[typeMap[opener]]++;

  if (
    ![
      ChunkLimits.RoundOpen,
      ChunkLimits.SquareOpen,
      ChunkLimits.CurlyOpen,
      ChunkLimits.AngledOpen
    ].includes(opener)
  ) {
    return invalidPoints[opener as keyof typeof invalidPoints];
  }

  for (let i = 1; i < chunks.length; i++) {
    const current = chunks.charAt(i);

    chunkCounter[typeMap[current]] += Object.keys(openerCloserMap).includes(current) ? 1 : -1;

    if (chunkCounter[typeMap[opener]] === 0) {
      const inside = validateChunks(chunks.substring(1, i));

      if (inside > 0) {
        return inside;
      }

      if (isString(inside)) {
        return invalidPoints[current as keyof typeof invalidPoints];
      }

      const outside = validateChunks(chunks.substring(i + 1));
      if (outside > 0) {
        return outside;
      }

      return outside;
    }
  }
  const inside = validateChunks(chunks.substring(1));
  if (isString(inside)) {
    return inside + openerCloserMap[opener];
  }
  if (inside > 0) {
    return inside;
  }
  return openerCloserMap[opener];
};

export const day10Part1 = () => {
  return data.reduce((acc, line) => {
    const val = validateChunks(line);
    if (isString(val)) {
      return acc;
    }
    return acc + val;
  }, 0);
};

const countMissingPoints = (chunk: string): number => {
  let sum = 0;
  for (const missing of chunk) {
    sum *= 5;
    sum += missingPoints[missing as keyof typeof missingPoints];
  }

  return sum;
};

export const day10Part2 = () => {
  const sorted = data
    .reduce<number[]>((acc, line) => {
      const val = validateChunks(line);
      if (isString(val)) {
        return [...acc, countMissingPoints(val)];
      }
      return acc;
    }, [])
    .sort((a, b) => a - b);

  return sorted[Math.floor(sorted.length / 2)];
};
