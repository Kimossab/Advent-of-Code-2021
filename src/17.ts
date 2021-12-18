import { readFileSync } from "fs";

interface Input {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
}

const parseInput = (): Input => {
  const input = readFileSync("input/17").toString();
  const matches = /.*x=(?<minX>-?\d*)..(?<maxX>-?\d*),\sy=(?<minY>-?\d*)..(?<maxY>-?\d*)/g.exec(
    input
  );
  return {
    minX: parseInt(matches!.groups!["minX"]),
    maxX: parseInt(matches!.groups!["maxX"]),
    minY: parseInt(matches!.groups!["minY"]),
    maxY: parseInt(matches!.groups!["maxY"])
  };
};

const summation = (value: number): number => {
  return (value * (value + 1)) / 2;
};

const invertedSummation = (result: number): number => {
  const c = result * -2;

  return (-1 + Math.sqrt(1 - 4 * c)) / 2;
};

const yPos = (time: number, initialSpeed: number): number => {
  return initialSpeed * time - summation(time - 1);
};

const xPos = (time: number, initialSpeed: number): number => {
  let speed = initialSpeed;
  let x = 0;

  for (let i = 0; i < time && speed > 0; i++, speed--) {
    x += speed;
  }

  return x;
};

const initialSpeedForYposTime = (yPos: number, time: number): number => {
  return (yPos + summation(time - 1)) / time;
};

export const day17Part1 = () => {
  const input = parseInput();
  const minX = Math.ceil(invertedSummation(input.minX));
  const maxX = Math.floor(invertedSummation(input.maxX));

  const [minInitialSpeed1, minInitialSpeed2] = [
    initialSpeedForYposTime(input.maxY, minX),
    initialSpeedForYposTime(input.maxY, maxX)
  ];

  let overShot = false;
  let prevY = -Infinity;
  let maxInitSpeed = -Infinity;
  for (
    let initSpeed = Math.min(Math.ceil(minInitialSpeed1), Math.ceil(minInitialSpeed2));
    initSpeed <= Infinity;
    initSpeed++
  ) {
    for (let time = minX; time <= Infinity; time++) {
      const y = yPos(time, initSpeed);

      if (y < input.minY) {
        if (prevY >= input.maxY + Math.abs(input.minY - input.maxY)) {
          overShot = true;
        }
        break;
      }
      prevY = y;
    }

    if (overShot) {
      maxInitSpeed = initSpeed - 1;
      break;
    }
  }

  let maxY = -Infinity;
  for (let i = 0; i <= Infinity; i++) {
    const y = yPos(i, maxInitSpeed);
    if (y < maxY) {
      break;
    }

    maxY = y;
  }

  return maxY;
};

export const day17Part2 = () => {
  const input = parseInput();
  const minX = Math.ceil(invertedSummation(input.minX));
  const maxX = input.maxX;
  const minY = input.minY;

  let speeds: number[][] = [];

  for (let i = minX; i <= maxX; i++) {
    let overShot = false;
    let prevY = -Infinity;
    for (let y = minY; y < Infinity; y++) {
      for (let time = 0; time <= Infinity; time++) {
        const posY = yPos(time, y);
        const x = xPos(time, i);

        if (x > input.maxX) {
          overShot = true;

          break;
        }

        if (posY >= input.minY && posY <= input.maxY && x >= input.minX && x <= input.maxX) {
          if (!speeds.find(speed => speed[0] === i && speed[1] === y)) {
            speeds.push([i, y, time, posY]);
          }
          break;
        }

        if (posY < input.minY) {
          if (prevY >= input.maxY + Math.abs(input.minY - input.maxY)) {
            overShot = true;
          }
          break;
        }
        prevY = posY;
      }

      if (overShot) {
        break;
      }
    }
  }

  return speeds.length;
};
