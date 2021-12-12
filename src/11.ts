import { readFileSync } from "fs";

interface Octopus {
  x: number;
  y: number;
  value: number;
  flashed: boolean;
}

const parseInput = (): Octopus[] => {
  const input = readFileSync("input/11").toString();
  return input.split("\n").reduce<Octopus[]>(
    (acc, line, lineIndex) => [
      ...acc,
      ...line.split("").map((c, cIndex) => ({
        x: cIndex,
        y: lineIndex,
        value: Number(c),
        flashed: false
      }))
    ],
    []
  );
};

const data = parseInput();

const flash = (dataOcto: Octopus[]) => {
  dataOcto.forEach(o => {
    o.value++;
    o.flashed = false;
  });
  let flashers = dataOcto.filter(o => o.value > 9 && o.flashed === false);

  while (flashers.length > 0) {
    const flasher = flashers.pop()!;

    flasher.flashed = true;
    const adjacentX = [flasher.x - 1, flasher.x, flasher.x + 1];
    const adjacentY = [flasher.y - 1, flasher.y, flasher.y + 1];
    dataOcto
      .filter(o => adjacentX.includes(o.x) && adjacentY.includes(o.y))
      .forEach(o => {
        o.value++;
      });

    flashers = dataOcto.filter(o => o.value > 9 && o.flashed === false);
  }
  dataOcto.filter(o => o.value > 9).forEach(o => (o.value = 0));
};

export const day11Part1 = () => {
  let dataCopy: Octopus[] = JSON.parse(JSON.stringify(data));
  let flashCount = 0;
  for (let i = 0; i < 100; i++) {
    flash(dataCopy);

    flashCount += dataCopy.filter(o => o.value === 0).length;
  }

  return flashCount;
};

export const day11Part2 = () => {
  let dataCopy: Octopus[] = JSON.parse(JSON.stringify(data));

  let i = 0;
  while (true) {
    i++;
    flash(dataCopy);

    if (dataCopy.filter(o => o.value === 0).length === data.length) {
      return i;
    }
  }
};
