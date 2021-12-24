/********************
 * DISCLAIMER: This solution is a brute force and completely horrible.
 * The reason for this being that I had found a solution much faster through an interactive playground of this puzzle.
 * I literally spent more time making this complete garbage than I did on the interactive playground.
 * But this is still a working code for the solutions
 * ******************/
import { readFileSync } from "fs";

enum Types {
  A = "A",
  B = "B",
  C = "C",
  D = "D"
}

type Position =
  | {
      type: "room";
      number: number;
      pos: number;
    }
  | {
      type: "hallway";
      number: number;
    };

interface Amphipod {
  type: Types;
  position: Position;
  cost: number;
}

interface Move {
  pod: Amphipod;
  to: Position;
  cost: number;
}

const roomForType = {
  [Types.A]: 1,
  [Types.B]: 2,
  [Types.C]: 3,
  [Types.D]: 4
};

const amphipodMoveCost = {
  [Types.A]: 1,
  [Types.B]: 10,
  [Types.C]: 100,
  [Types.D]: 1000
};

let maxEnergy = Infinity;
let part2 = false;
const cache: Record<string, number> = {};

const validPositions = [0, 1, 3, 5, 7, 9, 10];

const parseInput = (): Amphipod[] => {
  const input = readFileSync("input/23").toString().split("\n");
  return [
    {
      type: input[2].charAt(3) as Types,
      position: {
        type: "room",
        number: 1,
        pos: 1
      },
      cost: 0
    },
    {
      type: input[2].charAt(5) as Types,
      position: {
        type: "room",
        number: 2,
        pos: 1
      },
      cost: 0
    },
    {
      type: input[2].charAt(7) as Types,
      position: {
        type: "room",
        number: 3,
        pos: 1
      },
      cost: 0
    },
    {
      type: input[2].charAt(9) as Types,
      position: {
        type: "room",
        number: 4,
        pos: 1
      },
      cost: 0
    },
    {
      type: input[3].charAt(3) as Types,
      position: {
        type: "room",
        number: 1,
        pos: 2
      },
      cost: 0
    },
    {
      type: input[3].charAt(5) as Types,
      position: {
        type: "room",
        number: 2,
        pos: 2
      },
      cost: 0
    },
    {
      type: input[3].charAt(7) as Types,
      position: {
        type: "room",
        number: 3,
        pos: 2
      },
      cost: 0
    },
    {
      type: input[3].charAt(9) as Types,
      position: {
        type: "room",
        number: 4,
        pos: 2
      },
      cost: 0
    }
  ];
};

const canGoToPos = (amphipod: Amphipod, to: Position, amphipods: Amphipod[]): boolean => {
  const from = amphipod.position;

  let fPos = from.type === "hallway" ? from.number : from.number * 2;
  const tPos = to.type === "hallway" ? to.number : to.number * 2;

  fPos += fPos > tPos ? -1 : 1;

  // is someone inbetween us?
  const inHallway = amphipods.find(
    a =>
      a.position.type === "hallway" &&
      a.position.number >= Math.min(fPos, tPos) &&
      a.position.number <= Math.max(fPos, tPos)
  );

  if (inHallway) {
    return false;
  }

  if (to.type === "room") {
    if (to.number !== roomForType[amphipod.type]) {
      return false;
    }

    const wrongTypeInRoom = amphipods.find(
      a => a.position.type === "room" && a.position.number === to.number && a.type !== amphipod.type
    );
    if (wrongTypeInRoom) {
      return false;
    }

    const spaceOccupied = amphipods.find(
      a =>
        a.position.type === "room" && a.position.number === to.number && a.position.pos === to.pos
    );

    if (spaceOccupied) {
      return false;
    }
  }

  return true;
};

const calculateCost = (amphipod: Amphipod, to: Position): number => {
  let moves = 0;

  const fPos =
    amphipod.position.type === "hallway" ? amphipod.position.number : amphipod.position.number * 2;
  const tPos = to.type === "hallway" ? to.number : to.number * 2;

  if (amphipod.position.type === "room") {
    moves += amphipod.position.pos;
  }

  moves += Math.abs(fPos - tPos);

  if (to.type === "room") {
    moves += to.pos;
  }

  return moves * amphipodMoveCost[amphipod.type];
};

const validateTable = (amphipods: Amphipod[]): boolean => {
  for (const amphipod of amphipods) {
    if (amphipod.position.type !== "room") {
      return false;
    }

    if (amphipod.position.number !== roomForType[amphipod.type]) {
      return false;
    }
  }

  return true;
};

const canMove = (amphipod: Amphipod, amphipods: Amphipod[]): boolean => {
  const from = amphipod.position;

  //if he's in the correct room
  if (from.type === "room" && from.number === roomForType[amphipod.type]) {
    const otherTypesInTheRoom = amphipods.find(
      a =>
        a.position.type === "room" &&
        a.position.number === from.number &&
        a.type !== amphipod.type &&
        a.position.pos > from.pos
    );

    if (!otherTypesInTheRoom) {
      return false;
    }
  }

  // is someone above us?
  if (from.type === "room") {
    const aboveUs = amphipods.find(
      a =>
        a.position.type === "room" && a.position.number === from.number && a.position.pos < from.pos
    );

    if (aboveUs) {
      return false;
    }
  }

  return true;
};

const getMoves = (amphipods: Amphipod[]): Move[] => {
  const moves: Move[] = [];

  for (const pod of amphipods) {
    if (!canMove(pod, amphipods)) {
      continue;
    }

    if (pod.position.type !== "hallway") {
      for (const i of validPositions) {
        const to: Position = {
          type: "hallway",
          number: i
        };

        if (canGoToPos(pod, to, amphipods)) {
          moves.push({
            pod,
            to,
            cost: calculateCost(pod, to)
          });
        }
      }
    }

    const roomPlaces = part2 ? 4 : 2;

    for (let i = roomPlaces; i >= 1; i--) {
      const to: Position = {
        type: "room",
        number: roomForType[pod.type],
        pos: i
      };

      if (canGoToPos(pod, to, amphipods)) {
        moves.push({
          pod,
          to,
          cost: calculateCost(pod, to)
        });
        break;
      }
    }
  }
  return moves.sort((a, b) => a.cost - b.cost);
};

const shuffleAmphipods = (amphipods: Amphipod[], currentEnergy = 0): number => {
  const key = JSON.stringify(amphipods);
  if (cache[key] <= currentEnergy) {
    return Infinity;
  }
  cache[key] = currentEnergy;

  if (currentEnergy >= maxEnergy) {
    return Infinity;
  }

  const moves = getMoves(amphipods);

  if (moves.length === 0) {
    if (validateTable(amphipods)) {
      return currentEnergy;
    }

    return Infinity;
  }

  for (const move of moves) {
    // in case maxEnergy has been updated
    if (currentEnergy >= maxEnergy) {
      return Infinity;
    }

    const newAmphipods: Amphipod[] = JSON.parse(JSON.stringify(amphipods));
    const pod = newAmphipods.find(
      a => JSON.stringify(a.position) === JSON.stringify(move.pod.position)
    );

    pod!.position = move.to;
    // do the move to a copy of amphipods

    const cost = shuffleAmphipods(newAmphipods, currentEnergy + move.cost);

    if (cost < maxEnergy) {
      maxEnergy = cost;
    }
  }

  return maxEnergy;
};

export const day23Part1 = () => {
  const amphipods = parseInput();

  return shuffleAmphipods(amphipods);
};

export const day23Part2 = () => {
  const amphipods = parseInput().map(a => ({
    ...a,
    position: {
      ...a.position,
      pos: a.position.pos === 2 ? 4 : 1
    }
  }));

  amphipods.push(
    {
      type: Types.D,
      position: {
        type: "room",
        number: 1,
        pos: 2
      },
      cost: 0
    },
    {
      type: Types.D,
      position: {
        type: "room",
        number: 1,
        pos: 3
      },
      cost: 0
    },
    {
      type: Types.C,
      position: {
        type: "room",
        number: 2,
        pos: 2
      },
      cost: 0
    },
    {
      type: Types.B,
      position: {
        type: "room",
        number: 2,
        pos: 3
      },
      cost: 0
    },
    {
      type: Types.B,
      position: {
        type: "room",
        number: 3,
        pos: 2
      },
      cost: 0
    },
    {
      type: Types.A,
      position: {
        type: "room",
        number: 3,
        pos: 3
      },
      cost: 0
    },
    {
      type: Types.A,
      position: {
        type: "room",
        number: 4,
        pos: 2
      },
      cost: 0
    },
    {
      type: Types.C,
      position: {
        type: "room",
        number: 4,
        pos: 3
      },
      cost: 0
    }
  );

  maxEnergy = Infinity;
  part2 = true;

  return shuffleAmphipods(amphipods);
};
