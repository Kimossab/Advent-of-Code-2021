import { readFileSync } from "fs";

const parseInput = (): { inputs: string[]; output: string[] }[] => {
  const input = readFileSync("input/8").toString();
  return input.split("\n").map(line => {
    const [inputs, output] = line.split(" | ");
    return {
      inputs: inputs.split(" "),
      output: output.split(" ")
    };
  });
};

enum Segment {
  A = "a",
  B = "b",
  C = "c",
  D = "d",
  E = "e",
  F = "f",
  G = "g"
}

enum Digits {
  Zero = "zero",
  One = "one",
  Two = "two",
  Three = "three",
  Four = "four",
  Five = "five",
  Six = "six",
  Seven = "seven",
  Eight = "eight",
  Nine = "nine"
}

const DigitNumerical = {
  [Digits.Zero]: 0,
  [Digits.One]: 1,
  [Digits.Two]: 2,
  [Digits.Three]: 3,
  [Digits.Four]: 4,
  [Digits.Five]: 5,
  [Digits.Six]: 6,
  [Digits.Seven]: 7,
  [Digits.Eight]: 8,
  [Digits.Nine]: 9
};

const segmentsForNumber = {
  [Digits.Zero]: [Segment.A, Segment.B, Segment.C, Segment.E, Segment.F, Segment.G],
  [Digits.One]: [Segment.C, Segment.F],
  [Digits.Two]: [Segment.A, Segment.C, Segment.D, Segment.E, Segment.G],
  [Digits.Three]: [Segment.A, Segment.C, Segment.D, Segment.F, Segment.G],
  [Digits.Four]: [Segment.B, Segment.C, Segment.D, Segment.F],
  [Digits.Five]: [Segment.A, Segment.B, Segment.D, Segment.F, Segment.G],
  [Digits.Six]: [Segment.A, Segment.B, Segment.D, Segment.E, Segment.F, Segment.G],
  [Digits.Seven]: [Segment.A, Segment.C, Segment.F],
  [Digits.Eight]: [Segment.A, Segment.B, Segment.C, Segment.D, Segment.E, Segment.F, Segment.G],
  [Digits.Nine]: [Segment.A, Segment.B, Segment.C, Segment.D, Segment.F, Segment.G]
};

const numberOfSegments = {
  [Digits.Zero]: segmentsForNumber[Digits.Zero].length,
  [Digits.One]: segmentsForNumber[Digits.One].length,
  [Digits.Two]: segmentsForNumber[Digits.Two].length,
  [Digits.Three]: segmentsForNumber[Digits.Three].length,
  [Digits.Four]: segmentsForNumber[Digits.Four].length,
  [Digits.Five]: segmentsForNumber[Digits.Five].length,
  [Digits.Six]: segmentsForNumber[Digits.Six].length,
  [Digits.Seven]: segmentsForNumber[Digits.Seven].length,
  [Digits.Eight]: segmentsForNumber[Digits.Eight].length,
  [Digits.Nine]: segmentsForNumber[Digits.Nine].length
};

const digitByNumberOfSegments = {
  [7]: [Digits.Eight],
  [6]: [Digits.Zero, Digits.Nine],
  [5]: [Digits.Two, Digits.Three, Digits.Five, Digits.Six],
  [4]: [Digits.Four],
  [3]: [Digits.Seven],
  [2]: [Digits.One]
};

const data = parseInput();

export const day8Part1 = () => {
  let result = 0;
  for (const { output } of data) {
    for (const digit of output) {
      if (
        [
          numberOfSegments[Digits.One],
          numberOfSegments[Digits.Four],
          numberOfSegments[Digits.Seven],
          numberOfSegments[Digits.Eight]
        ].includes(digit.length)
      ) {
        result++;
      }
    }
  }
  return result;
};

class Combinations {
  private next: Combinations[] | null = null;
  private value: string;

  constructor(value: string) {
    this.value = value;
  }

  public append(value: string[], inserted: string[] = []) {
    const auxInserted = [...inserted, this.value];
    if (!this.next) {
      this.next = [];
      for (const v of value) {
        if (!auxInserted.includes(v)) {
          this.next.push(new Combinations(v));
        }
      }
    } else {
      for (const next of this.next) {
        next.append(value, auxInserted);
      }
    }
  }

  public getValues(): string[] {
    if (!this.next) {
      return [this.value];
    } else {
      const values = [];
      for (const next of this.next) {
        for (const val of next.getValues()) {
          values.push(this.value + val);
        }
      }
      return values;
    }
  }
}

const isInArray = (array: string[], value: string) => {
  const split = value.split("");
  for (const entry of array) {
    let found = true;

    for (const letter of entry) {
      if (!split.includes(letter)) {
        found = false;
        break;
      }
    }

    if (found) {
      return true;
    }
  }

  return false;
};

const findDigitForSegments = (segments: string): Digits[] => {
  let auxSegments = [...Object.values(Digits)].filter(d => {
    return segmentsForNumber[d].length === segments.length;
  });

  for (const seg of segments) {
    const s = seg as Segment;

    auxSegments = auxSegments.filter(digit => {
      return segmentsForNumber[digit].includes(s);
    });
  }

  return auxSegments;
};

const checkIfStringsMatch = (str1: string, str2: string): boolean => {
  if (str1.length !== str2.length) {
    return false;
  }

  const split1 = str1.split("");
  const split2 = str2.split("");

  for (const letter of split1) {
    if (!split2.includes(letter)) {
      return false;
    }
  }

  return true;
};

const findDigitFromMap = (map: Record<Digits, string | undefined>, output: string): string => {
  for (const digit in map) {
    const input = map[digit as Digits];

    if (input && checkIfStringsMatch(input, output)) {
      return digit;
    }
  }

  return ""; // should never happen
};

export const day8Part2 = () => {
  let result = 0;
  for (const { inputs, output } of data) {
    // stores whether a segment was placed in the map
    const hasBeenPlaced: Record<Segment, boolean> = {
      [Segment.A]: false,
      [Segment.B]: false,
      [Segment.C]: false,
      [Segment.D]: false,
      [Segment.E]: false,
      [Segment.F]: false,
      [Segment.G]: false
    };
    // mapping of the segment of the real segment to the possible segments on the puzzle
    const lines: Record<Segment, Segment[]> = {
      [Segment.A]: [],
      [Segment.B]: [],
      [Segment.C]: [],
      [Segment.D]: [],
      [Segment.E]: [],
      [Segment.F]: [],
      [Segment.G]: []
    };
    // mapping of the input segment for each digit
    const digitInput: Record<Digits, string | undefined> = {
      [Digits.Zero]: undefined,
      [Digits.One]: undefined,
      [Digits.Two]: undefined,
      [Digits.Three]: undefined,
      [Digits.Four]: undefined,
      [Digits.Five]: undefined,
      [Digits.Six]: undefined,
      [Digits.Seven]: undefined,
      [Digits.Eight]: undefined,
      [Digits.Nine]: undefined
    };

    //get all inputs in a map of segment count
    const inputBySegmentCount = inputs.reduce((acc, input) => {
      const len = input.length as keyof typeof digitByNumberOfSegments;
      if (!acc[len]) {
        acc[len] = [input];
      } else if (!isInArray(acc[len], input)) {
        acc[len].push(input);
      }
      return acc;
    }, {} as Record<keyof typeof digitByNumberOfSegments, string[]>);

    //fill the lines map
    for (const num in inputBySegmentCount) {
      // get the value of the digit
      const numNumber = Number(num) as keyof typeof digitByNumberOfSegments;

      // these take too many segments, therefore we shouldn't make deductions with them
      if (![4, 3, 2, 7].includes(numNumber)) {
        continue;
      }

      const seg = inputBySegmentCount[numNumber][0] as string;
      // for each digit in the map
      for (const digit of digitByNumberOfSegments[numNumber]) {
        // for each segment of the digit above
        for (const segment of segmentsForNumber[digit as keyof typeof segmentsForNumber]) {
          // if that segment as no possibilities yet
          // if it's not empty then it already has all the valid possibilites
          if (!lines[segment].length) {
            // for each segment on the segment string
            for (const dig of seg) {
              // if it has been placed then we don't need to add it anywhere else
              if (!hasBeenPlaced[dig as Segment]) {
                // prevent duplications
                if (!lines[segment].includes(dig as Segment)) {
                  lines[segment].push(dig as Segment);
                }
              }
            }
          }
        }
      }

      // we processed this input so we can mark all its segments as placed
      for (const dig of seg) {
        hasBeenPlaced[dig as Segment] = true;
      }
    }

    // the inverted mapper
    const lines2: { [key: string]: string[] } = {};

    for (const seg of [
      Segment.A,
      Segment.B,
      Segment.C,
      Segment.D,
      Segment.E,
      Segment.F,
      Segment.G
    ]) {
      lines2[seg] = Object.keys(lines).filter(k => lines[k as Segment].includes(seg));
    }

    // get all possible combinations with the possibilities map for each input
    for (const input of inputs) {
      const combinations = new Combinations("");
      //append all the possibilities, this will create an array of every single non repeated possibility
      for (const seg of input) {
        combinations.append(lines2[seg as Segment]);
      }

      // get the input strings converted for the real segments
      const vals = [];
      for (const val of combinations.getValues()) {
        if (!isInArray(vals, val)) {
          vals.push(val);
        }
      }

      // find the digits for every single combinations
      for (const val of vals) {
        // this will return an array of all possible digits ([string] or [])
        const digit = findDigitForSegments(val);

        // not really needed but meh, it's an array
        for (const d of digit) {
          // not really needed because it will not try to add the same number twice, but meh...
          if (!digitInput[d]) {
            digitInput[d] = input;
            break;
          }
        }
      }
    }

    //sum the numbers
    let number = 0;
    for (const out of output) {
      number *= 10;
      const dig = findDigitFromMap(digitInput, out);
      number += DigitNumerical[dig as Digits];
    }

    result += number;
  }
  return result;
};
