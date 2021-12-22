import { readFileSync } from "fs";

const parseInput = (): [number, number] => {
  const input = readFileSync("input/21").toString();

  const [p1, p2] = input.split("\n");

  const p1Split = p1.split(" ");
  const p2Split = p2.split(" ");

  return [Number(p1Split[p1Split.length - 1]), Number(p2Split[p2Split.length - 1])];
};

const getDeterministicDiceValue = (rolls: number): number => {
  return rolls - 100 * Math.floor((rolls - 1) / 100);
};

const playDeterministicDice = (p1: number, p2: number): number => {
  let rolls = 0;
  let p1Score = 0;
  let p2Score = 0;

  let turnP1 = true;

  while (p1Score < 1000 && p2Score < 1000) {
    const diceValue1 = getDeterministicDiceValue(++rolls);
    const diceValue2 = getDeterministicDiceValue(++rolls);
    const diceValue3 = getDeterministicDiceValue(++rolls);

    const diceValue = diceValue1 + diceValue2 + diceValue3;

    if (turnP1) {
      p1 += diceValue;

      while (p1 > 10) {
        p1 -= 10;
      }

      p1Score += p1;
    } else {
      p2 += diceValue;

      while (p2 > 10) {
        p2 -= 10;
      }

      p2Score += p2;
    }

    turnP1 = !turnP1;
  }

  if (p1Score >= p2Score) {
    return p2Score * rolls;
  } else {
    return p1Score * rolls;
  }
};

export const day21Part1 = () => {
  const [p1, p2] = parseInput();

  return playDeterministicDice(p1, p2);
};

// all combinations of 3 dice and the number they happen
const dieFreq = {
  3: 1,
  4: 3,
  5: 6,
  6: 7,
  7: 6,
  8: 3,
  9: 1
};

const playDiracDice = (
  p1: number,
  p2: number,
  pt1: number,
  pt2: number,
  maxPt: number,
  cache: Record<string, [number, number]> = {}
): [number, number] => {
  if (cache[`${p1}-${p2}-${pt1}-${pt2}`]) {
    return cache[`${p1}-${p2}-${pt1}-${pt2}`];
  }

  const sum: [number, number] = [0, 0];

  if (pt2 >= 21) {
    return [0, 1];
  }

  for (const value of Object.keys(dieFreq)) {
    const valueNum = Number(value);
    const valueFreq = dieFreq[valueNum as keyof typeof dieFreq];

    let np = p1 + valueNum;
    if (np > 10) {
      np -= 10;
    }
    const npt = pt1 + np;

    // swap player 2 and player 1, it doesn't really matter, this way we don't need to check whose turn it is,
    // it's always the player 1's turn, that way we only need to check for player 2's points
    const res = playDiracDice(p2, np, pt2, npt, maxPt, cache);

    sum[0] += res[1] * valueFreq;
    sum[1] += res[0] * valueFreq;
  }

  cache[`${p1}-${p2}-${pt1}-${pt2}`] = sum;

  return sum;
};

export const day21Part2 = () => {
  const [p1, p2] = parseInput();

  return Math.max(...playDiracDice(p1, p2, 0, 0, 21));
};
