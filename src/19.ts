import { readFileSync } from "fs";

interface Position {
  x: number;
  y: number;
  z: number;
}

interface Scanner {
  id: number;
  beacons: Position[];
}

interface LineInfo {
  id: number;
  slopeX: number;
  slopeY: number;
  slopeZ: number;
  distance: number;
}

interface LineData {
  id: number;
  lines: LineInfo[];
}

enum PointRotation {
  X0 = "0",
  X90 = "1",
  X180 = "2",
  X270 = "3",
  Z90 = "4",
  Z90Y90 = "5",
  Z90Y180 = "6",
  Z90Y270 = "7",
  Z180 = "8",
  Z180X90 = "9",
  Z180X180 = "10",
  Z180X270 = "11",
  Z270 = "12",
  Z270Y90 = "13",
  Z270Y180 = "14",
  Z270Y270 = "15",
  Y270 = "16",
  Y270Z90 = "17",
  Y270Z180 = "18",
  Y270Z270 = "19",
  Y90 = "20",
  Y90Z90 = "21",
  Y90Z180 = "22",
  Y90Z270 = "23"
}

const parseInput = (): Scanner[] => {
  const input = readFileSync("input/19").toString();

  const lines = input.split("\n");

  const scanners: Scanner[] = [];

  let scanner: Scanner | undefined;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (line === "") {
      continue;
    }

    const scannerMatch = /---\sscanner\s(?<id>\d*).*/.exec(line);

    if (scannerMatch) {
      if (scanner) {
        scanners.push(scanner);
      }

      scanner = {
        id: parseInt(scannerMatch.groups!["id"]),
        beacons: []
      };
    } else {
      const positionMatch = /(?<x>-?\d*),(?<y>-?\d*),(?<z>-?\d*)/.exec(line);

      scanner?.beacons.push({
        x: parseInt(positionMatch!.groups!["x"]),
        y: parseInt(positionMatch!.groups!["y"]),
        z: parseInt(positionMatch!.groups!["z"])
      });
    }
  }

  if (scanner) {
    scanners.push(scanner);
  }

  return scanners;
};

const getLinesBetweenPoints = (points: Position[]): LineData[] => {
  const lineData: LineData[] = [];

  for (let i = 0; i < points.length; i++) {
    const pointA = points[i];
    const lines: LineInfo[] = [];

    for (let j = 0; j < points.length; j++) {
      if (j === i) {
        continue;
      }

      const pointB = points[j];

      const slopeX = pointB.x - pointA.x;
      const slopeY = pointB.y - pointA.y;
      const slopeZ = pointB.z - pointA.z;

      const distance = Math.abs(slopeX) + Math.abs(slopeY) + Math.abs(slopeZ);

      lines.push({
        id: j,
        slopeX,
        slopeY,
        slopeZ,
        distance
      });
    }

    lineData.push({
      id: i,
      lines
    });
  }

  return lineData;
};

const rotate = {
  [PointRotation.X0]: ({ x, y, z }: Position): Position => ({ x, y, z }),
  [PointRotation.X90]: ({ x, y, z }: Position): Position => ({ x, y: -z, z: y }),
  [PointRotation.X180]: ({ x, y, z }: Position): Position => ({ x, y: -y, z: -z }),
  [PointRotation.X270]: ({ x, y, z }: Position): Position => ({ x, y: z, z: -y }),

  [PointRotation.Z90]: ({ x, y, z }: Position): Position => ({ x: -y, y: x, z: z }),
  [PointRotation.Z90Y90]: ({ x, y, z }: Position): Position => ({ x: z, y: x, z: y }),
  [PointRotation.Z90Y180]: ({ x, y, z }: Position): Position => ({ x: y, y: x, z: -z }),
  [PointRotation.Z90Y270]: ({ x, y, z }: Position): Position => ({ x: -z, y: x, z: -y }),

  [PointRotation.Z180]: ({ x, y, z }: Position): Position => ({ x: -x, y: -y, z: z }),
  [PointRotation.Z180X90]: ({ x, y, z }: Position): Position => ({ x: -x, y: -z, z: -y }),
  [PointRotation.Z180X180]: ({ x, y, z }: Position): Position => ({ x: -x, y: y, z: -z }),
  [PointRotation.Z180X270]: ({ x, y, z }: Position): Position => ({ x: -x, y: z, z: y }),

  [PointRotation.Z270]: ({ x, y, z }: Position): Position => ({ x: y, y: -x, z: z }),
  [PointRotation.Z270Y90]: ({ x, y, z }: Position): Position => ({ x: z, y: -x, z: -y }),
  [PointRotation.Z270Y180]: ({ x, y, z }: Position): Position => ({ x: -y, y: -x, z: -z }),
  [PointRotation.Z270Y270]: ({ x, y, z }: Position): Position => ({ x: -z, y: -x, z: y }),

  [PointRotation.Y270]: ({ x, y, z }: Position): Position => ({ x: -z, y: y, z: x }),
  [PointRotation.Y270Z90]: ({ x, y, z }: Position): Position => ({ x: -y, y: -z, z: x }),
  [PointRotation.Y270Z180]: ({ x, y, z }: Position): Position => ({ x: z, y: -y, z: x }),
  [PointRotation.Y270Z270]: ({ x, y, z }: Position): Position => ({ x: y, y: z, z: x }),

  [PointRotation.Y90]: ({ x, y, z }: Position): Position => ({ x: z, y: y, z: -x }),
  [PointRotation.Y90Z90]: ({ x, y, z }: Position): Position => ({ x: -y, y: z, z: -x }),
  [PointRotation.Y90Z180]: ({ x, y, z }: Position): Position => ({ x: -z, y: -y, z: -x }),
  [PointRotation.Y90Z270]: ({ x, y, z }: Position): Position => ({ x: y, y: -z, z: -x })
};

const rotatePoints = (points: Position[], rotation: PointRotation): Position[] => {
  return points.map(rotate[rotation]);
};

const commonPoints = (
  original: LineData[],
  compare: LineData[]
): { original: number; compare: number }[] => {
  // for each point in the original
  for (let i = 0; i < original.length; i++) {
    const originalPoint = original[i];

    // for each point in the comparing dataset
    for (const comparePoint of compare) {
      // relation of points from original to compare
      let count = [{ original: originalPoint.id, compare: comparePoint.id }];

      // for each line of the originalPoint
      for (const oLine of originalPoint.lines) {
        // find the line with the same length on the compare
        const compareLine = comparePoint.lines.find(
          cLine =>
            cLine.distance === oLine.distance &&
            cLine.slopeX === oLine.slopeX &&
            cLine.slopeY === oLine.slopeY &&
            cLine.slopeZ === oLine.slopeZ
        );

        if (compareLine) {
          count.push({ original: oLine.id, compare: compareLine.id });
        }
      }

      if (count.length >= 11) {
        return count;
      }
    }
  }

  return [];
};

const getScannerPosition = (o: Position, c: Position): Position => ({
  x: o.x - c.x,
  y: o.y - c.y,
  z: o.z - c.z
});

const getPointsAndPositions = (): { scanners: Record<number, Position>; points: Position[] } => {
  const scanners = parseInput();

  const absolutePoints: Record<number, Position[]> = {
    0: scanners[0].beacons
  };

  const absoluteLines: Record<number, LineData[]> = {
    0: getLinesBetweenPoints(scanners[0].beacons)
  };

  const scannerPositions: Record<number, Position> = {
    0: { x: 0, y: 0, z: 0 }
  };

  while (Object.keys(absolutePoints).length < scanners.length) {
    const ids = Object.keys(absolutePoints).map(Number);

    const scannersNotFound = scanners.filter(s => !absolutePoints[s.id]);

    for (const id of ids) {
      for (const sc of scannersNotFound) {
        for (const rotation of Object.values(PointRotation)) {
          const points = absolutePoints[id];
          const lines = absoluteLines[id];

          const rotatedPoints = rotatePoints(sc.beacons, rotation);
          const rotatedLines = getLinesBetweenPoints(rotatedPoints);

          const common = commonPoints(lines, rotatedLines);

          if (common.length >= 11) {
            const pos = getScannerPosition(
              points[common[2].original],
              rotatedPoints[common[2].compare]
            );
            const absP = rotatedPoints.map(p => ({
              x: p.x + pos.x,
              y: p.y + pos.y,
              z: p.z + pos.z
            }));

            points.push(...absP);
            absolutePoints[sc.id] = absP;
            absoluteLines[sc.id] = getLinesBetweenPoints(absP);
            scannerPositions[sc.id] = pos;
          }
        }
      }
    }
  }

  const uniquePoints = Object.values(absolutePoints)
    .reduce((acc, cur) => [...acc, ...cur])
    .filter((v, i, a) => a.findIndex(t => t.x === v.x && t.y === v.y && t.z === v.z) === i);

  return {
    scanners: scannerPositions,
    points: uniquePoints
  };
};

const data = getPointsAndPositions();

export const day19Part1 = () => {
  return data.points.length;
};

const getMaxManhattanDistance = (points: Position[]) => {
  let max = 0;
  for (const point of points) {
    const distance = Math.abs(point.x) + Math.abs(point.y) + Math.abs(point.z);
    if (distance > max) {
      max = distance;
    }
  }
  return max;
};

export const day19Part2 = () => {
  return getMaxManhattanDistance(Object.values(data.scanners));
};
