import { readFileSync } from "fs";

type SnailfishNumber = [number | SnailfishNumber, number | SnailfishNumber];

interface ExplosionState {
  exploded: boolean;
  leftValue?: number | undefined;
  rightValue?: number | undefined;
  snailfish?: SnailfishNumber | number | undefined;
}

interface SplitState {
  splitted: boolean;
  snailfish?: SnailfishNumber | number | undefined;
}

const parseInput = (): SnailfishNumber[] => {
  const input = readFileSync("input/18").toString();

  return input.split("\n").map(l => JSON.parse(l) as SnailfishNumber);
};

// calculate the highest depth in the snailfish
const snailFishDepth = (snailfish: SnailfishNumber, depth = 0): number => {
  let maxDepth = depth + 1;
  if (snailfish[0] instanceof Array) {
    const leftDepth = snailFishDepth(snailfish[0], depth + 1);

    if (leftDepth > maxDepth) {
      maxDepth = leftDepth;
    }
  }

  if (snailfish[1] instanceof Array) {
    const rightDepth = snailFishDepth(snailfish[1], depth + 1);

    if (rightDepth > maxDepth) {
      maxDepth = rightDepth;
    }
  }

  return maxDepth;
};

// check if there's any snailfish that has a number above 9
const hasNumberAboveNine = (snailfish: SnailfishNumber): boolean => {
  let leftHasNumberAboveTen = false;

  if (snailfish[0] instanceof Array) {
    leftHasNumberAboveTen = hasNumberAboveNine(snailfish[0]);
  } else {
    leftHasNumberAboveTen = snailfish[0] >= 10;
  }

  if (leftHasNumberAboveTen) {
    return true;
  }

  if (snailfish[1] instanceof Array) {
    return hasNumberAboveNine(snailfish[1]);
  }
  return snailfish[1] >= 10;
};

// adds an exploded number from the right side of the snailfish
const snailFishAddRight = (snailfish: SnailfishNumber, right: number): SnailfishNumber => {
  if (snailfish[1] instanceof Array) {
    return [snailfish[0], snailFishAddRight(snailfish[1], right)];
  }

  return [snailfish[0], snailfish[1] + right];
};

const explode = (
  highestDepth: number,
  snailfish: SnailfishNumber,
  depth = 0,
  currentState: ExplosionState = { exploded: false }
): ExplosionState => {
  // if it has exploded and there's no values to add to the left or right then we can just ignore it all
  if (currentState.exploded && !currentState.leftValue && !currentState.rightValue) {
    return {
      ...currentState,
      snailfish
    };
  }

  const [snailfishLeft, snailfishRight] = snailfish;

  // defaulting the values to the same as the snailfish
  let left = snailfishLeft;
  let right = snailfishRight;

  // if it has not exploded then this is the first pair out of bounds
  if (!currentState.exploded && depth === highestDepth - 2) {
    // if the left value is an array then the right value of it needs to go to the right part and left shall be sent back
    if (left instanceof Array) {
      if (right instanceof Array) {
        (right[0] as number) += left[1] as number;
      } else {
        right += left[1] as number;
      }
      return {
        exploded: true,
        leftValue: left[0] as number,
        snailfish: [0, right]
      };
    }

    // if the right is an array then the left is a number forcibly
    if (right instanceof Array) {
      left += right[0] as number;
      return {
        exploded: true,
        rightValue: right[1] as number,
        snailfish: [left, 0]
      };
    }

    // fallback, sometimes it comes here and I can't be arsed to figure out why, this works
    return {
      exploded: false,
      leftValue: undefined,
      rightValue: undefined,
      snailfish: snailfish
    };
  }

  // if it has exploded then we need to add the left and right values to the snailfish
  if (currentState.exploded) {
    // if there's no right value that means it has already been used, so we don't need to do anything here
    // the left will be the other one handling (because we're in the left, so it's the right of the exploded one, left must go left)
    if (!currentState.rightValue) {
      return {
        exploded: true,
        leftValue: currentState.leftValue,
        snailfish: [left, right]
      };
    }

    // if the left is an array then the right value will go to the first number inside it, just explode it and forget it
    // probably could simplify this with an addLeft function like I did for the right.... but would be even more work to handle edge cases
    if (left instanceof Array) {
      const exploded = explode(highestDepth, left, depth + 1, currentState);

      currentState = exploded;
      left = exploded.snailfish!;
    } else {
      return {
        exploded: true,
        snailfish: [left + currentState.rightValue, right]
      };
    }

    // this means it's handled, we can forget it
    if (!currentState.rightValue) {
      return {
        exploded: true,
        snailfish: [left, right]
      };
    }

    if (right instanceof Array) {
      const exploded = explode(highestDepth, right, depth + 1, currentState);

      currentState = exploded;
      right = exploded.snailfish!;
    } else {
      return {
        exploded: true,
        snailfish: [left, right + currentState.rightValue]
      };
    }
  }

  // we have to explode the left
  if (left instanceof Array) {
    const exploded = explode(highestDepth, left, depth + 1, currentState);

    currentState = exploded;

    left = exploded.snailfish!;
  }

  // in case the left was exploded then we need to check what we need to do with the right
  if (currentState.exploded) {
    if (right instanceof Array) {
      const exploded = explode(highestDepth, right, depth + 1, currentState);

      currentState = exploded;

      return {
        ...exploded,
        snailfish: [left, exploded.snailfish!]
      };
    } else {
      if (!currentState.rightValue) {
        return {
          exploded: true,
          leftValue: currentState.leftValue,
          snailfish: [left, right]
        };
      }
      return {
        exploded: true,
        leftValue: currentState.leftValue,
        snailfish: [left, right + currentState.rightValue]
      };
    }
  } else {
    if (right instanceof Array) {
      const exploded = explode(highestDepth, right, depth + 1, currentState);

      if (exploded.exploded && exploded.leftValue) {
        if (left instanceof Array) {
          return {
            exploded: true,
            snailfish: [snailFishAddRight(left, exploded.leftValue!), exploded.snailfish!]
          };
        }
        left += exploded.leftValue! as number;
        return {
          exploded: true,
          rightValue: exploded.rightValue,
          snailfish: [left, exploded.snailfish!]
        };
      }

      return {
        ...exploded,
        snailfish: [left, exploded.snailfish!]
      };
    }

    return {
      exploded: false,
      snailfish: [left, right]
    };
  }
};

// handles the split, the ceil/floor divide by 2 when 10 or above
const splitSnailfish = (snailfish: SnailfishNumber): SplitState => {
  const [left, right] = snailfish;

  if (left instanceof Array) {
    const split = splitSnailfish(left);

    if (split.splitted) {
      return {
        splitted: true,
        snailfish: [split.snailfish!, right]
      };
    }
  } else if (left >= 10) {
    return {
      splitted: true,
      snailfish: [[Math.floor(Number(left) / 2), Math.ceil(Number(left) / 2)], right]
    };
  }

  if (right instanceof Array) {
    const split = splitSnailfish(right);

    if (split.splitted) {
      return {
        splitted: true,
        snailfish: [left, split.snailfish!]
      };
    }
  } else if (right >= 10) {
    return {
      splitted: true,
      snailfish: [left, [Math.floor(Number(right) / 2), Math.ceil(Number(right) / 2)]]
    };
  }

  return {
    splitted: false,
    snailfish: snailfish
  };
};

// checks what reduce actions need to be done and does them
const reduceSnailFish = (snailfish: SnailfishNumber): SnailfishNumber => {
  let reducedSnailFish = snailfish;

  while (true) {
    const highestDepth = snailFishDepth(reducedSnailFish);
    if (highestDepth > 4) {
      const exploded = explode(highestDepth, reducedSnailFish);
      reducedSnailFish = exploded.snailfish as SnailfishNumber;
    } else if (hasNumberAboveNine(reducedSnailFish)) {
      const splitted = splitSnailfish(reducedSnailFish);
      reducedSnailFish = splitted.snailfish as SnailfishNumber;
    } else {
      break;
    }
  }

  return reducedSnailFish;
};

// most useless function here, but fuck it
const sumSnailfish = (
  snailfish1: SnailfishNumber,
  snailfish2: SnailfishNumber
): SnailfishNumber => {
  const reduced = reduceSnailFish([snailfish1, snailfish2]);

  return reduced;
};

// there's probably better ways, but fuck it
const calculateMagnitude = (snailfish: SnailfishNumber): number => {
  let magnitude = 0;
  const [left, right] = snailfish;

  if (left instanceof Array) {
    magnitude += calculateMagnitude(left) * 3;
  } else {
    magnitude += left * 3;
  }

  if (right instanceof Array) {
    magnitude += calculateMagnitude(right) * 2;
  } else {
    magnitude += right * 2;
  }

  return magnitude;
};

export const day18Part1 = () => {
  const input = parseInput();
  let sum: SnailfishNumber | undefined = undefined;

  for (const snail of input) {
    if (!sum) {
      sum = snail;
    } else {
      sum = sumSnailfish(sum, snail);
    }
  }

  return calculateMagnitude(sum!);
};

export const day18Part2 = () => {
  const input = parseInput();
  let highestMagnitude = 0;

  for (let i = 0; i < input.length; i++) {
    // not worth the extra lines to do j = i + 1 for just 50ms of improvement
    for (let j = 0; j < input.length; j++) {
      if (i !== j) {
        // fucking reference variables
        const inpI = JSON.parse(JSON.stringify(input[i]));
        const inpJ = JSON.parse(JSON.stringify(input[j]));

        const sum = sumSnailfish(inpI, inpJ);
        const magnitude = calculateMagnitude(sum);

        if (magnitude > highestMagnitude) {
          highestMagnitude = magnitude;
        }
      }
    }
  }

  return highestMagnitude;
};
