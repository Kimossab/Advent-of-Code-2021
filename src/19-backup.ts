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

enum PointRotation {
  X0 = "0",
  X0Y90 = "1",
  X0Y180 = "2",
  X0Y270 = "3",
  X180 = "4",
  X180Y90 = "5",
  X180Y180 = "6",
  X180Y270 = "7",
  Y0 = "8",
  Y0X90 = "9",
  Y0X180 = "10",
  Y0X270 = "11",
  Y180X0 = "12",
  Y180X90 = "13",
  Y180X180 = "14",
  Y180X270 = "15",
  Z0 = "16",
  Z0X90 = "17",
  Z0X180 = "18",
  Z0X270 = "19",
  Z180X0 = "20",
  Z180X90 = "21",
  Z180X180 = "22",
  Z180X270 = "23"
}

const rotatePoints = (points: Position[], rotation: PointRotation): Position[] => {
  if (rotation === PointRotation.X0) {
    return points;
  }

  return points.map(point => {
    let x = point.x;
    let y = point.y;
    let z = point.z;

    switch (rotation) {
      case PointRotation.X0Y90:
        y = point.z;
        z = -point.y;
        break;
      case PointRotation.X0Y180:
        y = -point.y;
        z = -point.z;
        break;
      case PointRotation.X0Y270:
        y = -point.z;
        z = point.y;
        break;
      case PointRotation.X180:
        x = -point.x;
        break;
      case PointRotation.X180Y90:
        x = -point.x;
        y = point.z;
        z = -point.y;
        break;
      case PointRotation.X180Y180:
        x = -point.x;
        y = -point.y;
        z = -point.z;
        break;
      case PointRotation.X180Y270:
        x = -point.x;
        y = -point.z;
        z = point.y;
        break;
      case PointRotation.Y0:
        x = point.y;
        y = point.x;
        break;
      case PointRotation.Y0X90:
        x = point.y;
        y = point.z;
        z = -point.x;
        break;
      case PointRotation.Y0X180:
        x = point.y;
        y = -point.x;
        z = -point.z;
        break;
      case PointRotation.Y0X270:
        x = point.y;
        y = -point.z;
        z = point.x;
        break;
      case PointRotation.Y180X0:
        x = -point.y;
        y = -point.x;
        break;
      case PointRotation.Y180X90:
        x = -point.y;
        y = -point.z;
        z = point.x;
        break;
      case PointRotation.Y180X180:
        x = -point.y;
        y = point.x;
        z = point.z;
        break;
      case PointRotation.Y180X270:
        x = -point.y;
        y = point.z;
        z = -point.x;
        break;
      case PointRotation.Z0:
        x = point.z;
        z = -point.x;
        break;
      case PointRotation.Z0X90:
        x = point.z;
        y = point.x;
        z = point.y;
        break;
      case PointRotation.Z0X180:
        x = point.z;
        y = -point.y;
        z = point.x;
        break;
      case PointRotation.Z0X270:
        x = point.z;
        y = -point.x;
        z = -point.y;
        break;
      case PointRotation.Z180X0:
        x = -point.z;
        z = point.x;
        break;
      case PointRotation.Z180X90:
        x = -point.z;
        y = point.x;
        z = -point.y;
        break;
      case PointRotation.Z180X180:
        x = -point.z;
        y = -point.y;
        z = -point.x;
        break;
      case PointRotation.Z180X270:
        x = -point.z;
        y = -point.x;
        z = point.y;
        break;
    }
    return { x, y, z };
  });
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
        const compareLine = comparePoint.lines.find(cLine => cLine.distance === oLine.distance);

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

// I need 2 different common points, so I can see which axis' change so I can get a correct position
const getPositionRelativeToOriginal = (
  originalPointA: Position,
  comparePointA: Position,
  originalPointB: Position,
  comparePointB: Position,
  comparePointC: Position
): Position => {
  const originXDiff = originalPointA.x - originalPointB.x;
  const originYDiff = originalPointA.y - originalPointB.y;
  const originZDiff = originalPointA.z - originalPointB.z;

  const compareXDiff = comparePointA.x - comparePointB.x;
  const compareYDiff = comparePointA.y - comparePointB.y;
  const compareZDiff = comparePointA.z - comparePointB.z;

  // X axis is the same (this means it can only rotate on the X axis)
  if (compareXDiff === originXDiff) {
    const x = comparePointC.x - comparePointB.x + originalPointB.x;

    // if Y axis is the same then all is the same
    if (compareYDiff === originYDiff) {
      const y = comparePointC.y - comparePointB.y + originalPointB.y;
      const z = comparePointC.z - comparePointB.z + originalPointB.z;

      return { x, y, z };
    }

    // if y = z then z = -y (rotated -90 degrees on the X axis)
    if (compareYDiff === originZDiff) {
      const y = comparePointC.z - comparePointB.z + originalPointB.y;
      const z = -comparePointC.y + comparePointB.y + originalPointB.z;

      return { x, y, z };
    }

    // if y = -y then z = -z (rotated 180 degrees on the X axis)
    if (-compareYDiff === originYDiff) {
      const y = -comparePointC.y + comparePointB.y + originalPointB.y;
      const z = -comparePointC.z + comparePointB.z + originalPointB.z;

      return { x, y, z };
    }

    // otherwise y = -z and z = y (rotated 90 degrees on the X axis)
    const y = -comparePointC.z + comparePointB.z + originalPointB.y;
    const z = comparePointC.y - comparePointB.y + originalPointB.z;

    return { x, y, z };
  }

  // X axis is the same as Y axis (this means it's rotated 90 degrees on Z axis)
  if (compareXDiff === originYDiff) {
    const x = comparePointC.y - comparePointB.y + originalPointB.x;

    // if Z axis is the same then Y = -X (90 degrees on the Z axis)
    if (compareZDiff === originZDiff) {
      const y = -comparePointC.x + comparePointB.x + originalPointB.y;
      const z = comparePointC.z - comparePointB.z + originalPointB.z;

      return { x, y, z };
    }

    // if Z is the same as the X axis then Y = Z (90 degrees on the Z axis and 90 degrees on the Y axis)
    if (compareZDiff === originXDiff) {
      const y = comparePointC.z - comparePointB.z + originalPointB.y;
      const z = comparePointC.x - comparePointB.x + originalPointB.z;

      return { x, y, z };
    }

    // if z = -z then y = x (90 degrees on the Z axis and 180 degrees on the Y axis)
    if (compareZDiff === -originZDiff) {
      const y = comparePointC.x - comparePointB.x + originalPointB.y;
      const z = -comparePointC.z + comparePointB.z + originalPointB.z;

      return { x, y, z };
    }

    // otherwise z = -x and y = -z (90 degrees on the Z axis and 270 degrees on the Y axis)
    const y = -comparePointC.z + comparePointB.z + originalPointB.y;
    const z = -comparePointC.x + comparePointB.x + originalPointB.z;

    return { x, y, z };
  }

  // X axis is the same as -X axis (this means it's rotated 180 degrees on Z axis)
  if (compareXDiff === -originXDiff) {
    const x = -comparePointC.x + comparePointB.x + originalPointB.x;

    // if Z axis is the same then Y = -Y (180 degrees on the Z axis)
    if (compareZDiff === originZDiff) {
      const y = -comparePointC.y + comparePointB.y + originalPointB.y;
      const z = comparePointC.z - comparePointB.z + originalPointB.z;

      return { x, y, z };
    }

    // if Z is the same as the Y axis then Y = Z (90 degrees on the Z axis and 90 degrees on the X axis)
    if (compareZDiff === originYDiff) {
      const y = comparePointC.z - comparePointB.z + originalPointB.y;
      const z = comparePointC.y - comparePointB.y + originalPointB.z;

      return { x, y, z };
    }

    // if z = -z then y = y (90 degrees on the Z axis and 180 degrees on the X axis)
    if (compareZDiff === -originZDiff) {
      const y = comparePointC.y - comparePointB.y + originalPointB.y;
      const z = -comparePointC.z + comparePointB.z + originalPointB.z;

      return { x, y, z };
    }

    // otherwise z = -y and y = -z (90 degrees on the Z axis and 270 degrees on the Y axis)
    const y = -comparePointC.z + comparePointB.z + originalPointB.y;
    const z = -comparePointC.y + comparePointB.y + originalPointB.z;

    return { x, y, z };
  }

  // X axis is the same as -Y axis (this means it's rotated -90 degrees on Z axis)
  if (compareXDiff === -originYDiff) {
    const x = -comparePointC.y + comparePointB.y + originalPointB.x;

    // if Z axis is the same then Y = X (-90 degrees on the Z axis)
    if (compareZDiff === originZDiff) {
      const y = comparePointC.x - comparePointB.x + originalPointB.y;
      const z = comparePointC.z - comparePointB.z + originalPointB.z;

      return { x, y, z };
    }

    // if Z is the same as the X axis then Y = -Z (-90 degrees on the Z axis and 90 degrees on the Y axis)
    if (compareZDiff === originXDiff) {
      const y = -comparePointC.z + comparePointB.z + originalPointB.y;
      const z = comparePointC.x - comparePointB.x + originalPointB.z;

      return { x, y, z };
    }

    // if z = -z then y = -x (-90 degrees on the Z axis and 180 degrees on the Y axis)
    if (compareZDiff === -originZDiff) {
      const y = -comparePointC.x + comparePointB.x + originalPointB.y;
      const z = -comparePointC.z + comparePointB.z + originalPointB.z;

      return { x, y, z };
    }

    // otherwise z = -x and y = z (90 degrees on the Z axis and 270 degrees on the Y axis)
    const y = comparePointC.z - comparePointB.z + originalPointB.y;
    const z = -comparePointC.x + comparePointB.x + originalPointB.z;

    return { x, y, z };
  }

  // X axis is the same Z axis (this means it's rotated -90 degrees on Y axis)
  if (compareXDiff === originZDiff) {
    const x = comparePointC.z - comparePointB.z + originalPointB.x;

    // if Y axis is the same then Z = -X (-90 degrees on the Y axis)
    if (compareYDiff === originYDiff) {
      const y = comparePointC.y - comparePointB.y + originalPointB.y;
      const z = -comparePointC.x + comparePointB.x + originalPointB.z;

      return { x, y, z };
    }

    // if Y is the same as the X axis then Z = Y (-90 degrees on the Y axis and 90 degrees on the Z axis)
    if (compareYDiff === originXDiff) {
      const y = comparePointC.x - comparePointB.x + originalPointB.y;
      const z = comparePointC.y - comparePointB.y + originalPointB.z;

      return { x, y, z };
    }

    // if Y = -Y then Z = x (-90 degrees on the Y axis and 180 degrees on the Z axis)
    if (compareYDiff === -originYDiff) {
      const y = -comparePointC.y + comparePointB.y + originalPointB.y;
      const z = comparePointC.x - comparePointB.x + originalPointB.z;

      return { x, y, z };
    }

    // otherwise Y = -X and Z = -Y (90 degrees on the Y axiS and 270 degrees on the z axis)
    const y = -comparePointC.x + comparePointB.x + originalPointB.y;
    const z = -comparePointC.y + comparePointB.y + originalPointB.z;

    return { x, y, z };
  }

  // X axis is the same -Z axis (this means it's rotated 90 degrees on Y axis)
  if (compareXDiff === -originZDiff) {
    const x = -comparePointC.z + comparePointB.z + originalPointB.x;

    // if Y axis is the same then Z = X (90 degrees on the Y axis)
    if (compareYDiff === originYDiff) {
      const y = comparePointC.y - comparePointB.y + originalPointB.y;
      const z = comparePointC.x - comparePointB.x + originalPointB.z;

      return { x, y, z };
    }

    // if Y is the same as the X axis then Z = -Y (90 degrees on the Y axis and 90 degrees on the Z axis)
    if (compareYDiff === originXDiff) {
      const y = comparePointC.x - comparePointB.x + originalPointB.y;
      const z = -comparePointC.y + comparePointB.y + originalPointB.z;

      return { x, y, z };
    }

    // if Y = -Y then Z = -X (90 degrees on the Y axis and 180 degrees on the Z axis)
    if (compareYDiff === -originYDiff) {
      const y = -comparePointC.y + comparePointB.y + originalPointB.y;
      const z = -comparePointC.x + comparePointB.x + originalPointB.z;

      return { x, y, z };
    }

    // otherwise Y = -X and Z = Y (90 degrees on the Y axiS and 270 degrees on the z axis)
    const y = -comparePointC.x + comparePointB.x + originalPointB.y;
    const z = comparePointC.y - comparePointB.y + originalPointB.z;

    return { x, y, z };
  }

  return { x: 0, y: 0, z: 0 };
};

export const day19Part1 = () => {
  const scanners = parseInput();

  const scanned = [getLinesBetweenPoints(scanners[0].beacons)];
  const scannedScanners = [scanners[0]];

  const allPoints: Position[] = JSON.parse(JSON.stringify(scanners[0].beacons));

  let scannersToCheck = scanners.slice(1);

  // const rotationValues = Object.keys(PointRotation).filter(
  //   key => !isNaN(Number(PointRotation[key as keyof typeof PointRotation]))
  // );

  while (scannersToCheck.length > 0) {
    for (let i = 0; i < scanned.length; i++) {
      const sc = scanned[i];
      for (const scanner of scannersToCheck) {
        console.log(`scanner ${scanner.id}`);

        const lines = getLinesBetweenPoints(scanner.beacons);
        const commonP = commonPoints(sc, lines);

        if (commonP.length >= 11) {
          scanner.beacons
            .filter((p, i) => !commonP.find(c => c.compare === i))
            .map(p =>
              getPositionRelativeToOriginal(
                scannedScanners[i].beacons[commonP[0].original],
                scanner.beacons[commonP[0].compare],
                scannedScanners[i].beacons[commonP[1].original],
                scanner.beacons[commonP[1].compare],
                p
              )
            )
            .forEach(p => {
              if (!allPoints.find(ap => ap.x === p.x && ap.y === p.y && ap.z === p.z)) {
                allPoints.push(p);
              }
            });

          scannedScanners.push(scanner);
          scanned.push(lines);

          scannersToCheck = scannersToCheck.filter(s => s.id !== scanner.id);
          break;
        }
      }
    }

    console.table(allPoints.sort((a, b) => a.x - b.x));
  }

  return allPoints.length;
};

export const day19Part2 = () => {};
