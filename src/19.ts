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

interface PositionWithRotation extends Position {
  rotation: PointRotation;
}

const rotatePoints = (points: Position[], rotation: PointRotation): Position[] => {
  if (rotation === PointRotation.X0) {
    return points;
  }

  return points.map(p => {
    const { x, y, z } = p;

    let px = x;
    let py = y;
    let pz = z;

    switch (rotation) {
      // x = x
      case PointRotation.X90:
        py = -z;
        pz = y;
        break;
      case PointRotation.X180:
        py = -y;
        pz = -z;
        break;
      case PointRotation.X270:
        py = z;
        pz = -y;
        break;

      //y = x
      case PointRotation.Z90:
        px = -y;
        py = x;
        pz = z;
        break;
      case PointRotation.Z90Y90:
        px = z;
        py = x;
        pz = y;
        break;
      case PointRotation.Z90Y180:
        px = y;
        py = x;
        pz = -z;
        break;
      case PointRotation.Z90Y270:
        px = -z;
        py = x;
        pz = -y;
        break;

      //x = -x
      case PointRotation.Z180:
        px = -x;
        py = -y;
        pz = z;
        break;
      case PointRotation.Z180X90:
        px = -x;
        py = -z;
        pz = -y;
        break;
      case PointRotation.Z180X180:
        px = -x;
        py = y;
        pz = -z;
        break;
      case PointRotation.Z180X270:
        px = -x;
        py = z;
        pz = y;
        break;

      //x = -y
      case PointRotation.Z270:
        px = y;
        py = -x;
        pz = z;
        break;
      case PointRotation.Z270Y90:
        px = z;
        py = -x;
        pz = -y;
        break;
      case PointRotation.Z270Y180:
        px = -y;
        py = -x;
        pz = -z;
        break;
      case PointRotation.Z270Y270:
        px = -z;
        py = -x;
        pz = y;
        break;

      //z = x
      case PointRotation.Y270:
        px = -z;
        py = y;
        pz = x;
        break;
      case PointRotation.Y270Z90:
        px = -y;
        py = -z;
        pz = x;
        break;
      case PointRotation.Y270Z180:
        px = z;
        py = -y;
        pz = x;
        break;
      case PointRotation.Y270Z270:
        px = y;
        py = z;
        pz = x;
        break;

      //z = -x
      case PointRotation.Y90:
        px = z;
        py = y;
        pz = -x;
        break;
      case PointRotation.Y90Z90:
        px = -y;
        py = z;
        pz = -x;
        break;
      case PointRotation.Y90Z180:
        px = -z;
        py = -y;
        pz = -x;
        break;
      case PointRotation.Y90Z270:
        px = y;
        py = -z;
        pz = -x;
        break;
    }

    return { x: px, y: py, z: pz };
  });
};
const getRotatedPoints = (points: Position[], scanner: PositionWithRotation): Position[] => {
  const rotated = rotatePoints(points, scanner.rotation);

  return rotated.map(p => ({
    x: p.x + scanner.x,
    y: p.y + scanner.y,
    z: p.z + scanner.z
  }));
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

const getScannerPosition = (
  originalPointA: Position,
  comparePointA: Position,
  originalPointB: Position,
  comparePointB: Position
): PositionWithRotation => {
  const originXDiff = originalPointA.x - originalPointB.x;
  const originYDiff = originalPointA.y - originalPointB.y;
  const originZDiff = originalPointA.z - originalPointB.z;

  const compareXDiff = comparePointA.x - comparePointB.x;
  const compareYDiff = comparePointA.y - comparePointB.y;
  const compareZDiff = comparePointA.z - comparePointB.z;

  // X axis is the same (this means it can only rotate on the X axis)
  if (compareXDiff === originXDiff) {
    const x = originalPointA.x - comparePointA.x;

    // if Y axis is the same then all is the same
    if (compareYDiff === originYDiff) {
      const y = originalPointA.y - comparePointA.y;
      const z = originalPointA.z - comparePointA.z;

      return { x, y, z, rotation: PointRotation.X0 };
    }

    // if y = z then z = -y (rotated 90 degrees on the X axis)
    if (compareYDiff === originZDiff) {
      const y = originalPointA.y - comparePointA.z;
      const z = originalPointA.z + comparePointA.y;

      return { x, y, z, rotation: PointRotation.X90 };
    }

    // if y = -y then z = -z (rotated 180 degrees on the X axis)
    if (-compareYDiff === originYDiff) {
      const y = originalPointA.y + comparePointA.y;
      const z = originalPointA.z + comparePointA.z;

      return { x, y, z, rotation: PointRotation.X180 };
    }

    // otherwise y = -z and z = y (rotated 90 degrees on the X axis)
    const y = originalPointA.y + comparePointA.z;
    const z = originalPointA.z - comparePointA.y;

    return { x, y, z, rotation: PointRotation.X270 };
  }

  // X axis is the same as Y axis (this means it's rotated 90 degrees on Z axis)
  if (compareXDiff === originYDiff) {
    const y = originalPointA.y - comparePointA.x;

    // if Z axis is the same then X = -Y (90 degrees on the Z axis)
    if (compareZDiff === originZDiff) {
      const x = originalPointA.x + comparePointA.y;
      const z = originalPointA.z - comparePointA.z;

      return { x, y, z, rotation: PointRotation.Z90 };
    }

    // if Z is the same as the X axis then Z = Y (90 degrees on the Z axis and 90 degrees on the Y axis)
    if (compareZDiff === originXDiff) {
      const x = originalPointA.x - comparePointA.z;
      const z = originalPointA.z - comparePointA.y;

      return { x, y, z, rotation: PointRotation.Z90Y90 };
    }

    // if z = -z then y = x (90 degrees on the Z axis and 180 degrees on the Y axis)
    if (compareZDiff === -originZDiff) {
      const x = originalPointA.x - comparePointA.y;
      const z = originalPointA.z + comparePointA.z;

      return { x, y, z, rotation: PointRotation.Z90Y180 };
    }

    // otherwise z = -x and y = -z (90 degrees on the Z axis and 270 degrees on the Y axis)
    const x = originalPointA.x + comparePointA.z;
    const z = originalPointA.z + comparePointA.y;

    return { x, y, z, rotation: PointRotation.Z90Y270 };
  }

  // X axis is the same as -X axis (this means it's rotated 180 degrees on Z axis)
  if (compareXDiff === -originXDiff) {
    const x = originalPointA.x + comparePointA.x;

    // if Z axis is the same then Y = -Y (180 degrees on the Z axis)
    if (compareZDiff === originZDiff) {
      const y = originalPointA.y + comparePointA.y;
      const z = originalPointA.z - comparePointA.z;

      return { x, y, z, rotation: PointRotation.Z180 };
    }

    // if Z is the same as the Y axis then Y = Z (180 degrees on the Z axis and 270 degrees on the X axis)
    if (compareZDiff === originYDiff) {
      const y = originalPointA.y - comparePointA.z;
      const z = originalPointA.z - comparePointA.y;

      return { x, y, z, rotation: PointRotation.Z180X270 };
    }

    // if z = -z then y = y (180 degrees on the Z axis and 180 degrees on the X axis)
    if (compareZDiff === -originZDiff) {
      const y = originalPointA.y - comparePointA.y;
      const z = originalPointA.z + comparePointA.z;

      return { x, y, z, rotation: PointRotation.Z180X180 };
    }

    // otherwise z = -y and y = -z (180 degrees on the Z axis and 90 degrees on the Y axis)
    const y = originalPointA.y + comparePointA.z;
    const z = originalPointA.z + comparePointA.y;

    return { x, y, z, rotation: PointRotation.Z180X90 };
  }

  // X axis is the same as -Y axis (this means it's rotated 270 degrees on Z axis)
  if (compareXDiff === -originYDiff) {
    const y = originalPointA.y + comparePointA.x;

    // if Z axis is the same then Y = X (270 degrees on the Z axis)
    if (compareZDiff === originZDiff) {
      const x = originalPointA.x - comparePointA.y;
      const z = originalPointA.z - comparePointA.z;

      return { x, y, z, rotation: PointRotation.Z270 };
    }

    // if Z is the same as the X axis then Y = -Z (270 degrees on the Z axis and 90 degrees on the Y axis)
    if (compareZDiff === originXDiff) {
      const x = originalPointA.x - comparePointA.z;
      const z = originalPointA.z + comparePointA.y;

      return { x, y, z, rotation: PointRotation.Z270Y90 };
    }

    // if z = -z then y = -x (270 degrees on the Z axis and 180 degrees on the Y axis)
    if (compareZDiff === -originZDiff) {
      const x = originalPointA.x + comparePointA.y;
      const z = originalPointA.z + comparePointA.z;

      return { x, y, z, rotation: PointRotation.Z270Y180 };
    }

    // otherwise z = -x and y = z (270 degrees on the Z axis and 270 degrees on the Y axis)
    const x = originalPointA.x + comparePointA.z;
    const z = originalPointA.z - comparePointA.y;

    return { x, y, z, rotation: PointRotation.Z270Y270 };
  }

  // X axis is the same Z axis (this means it's rotated 270 degrees on Y axis)
  if (compareXDiff === originZDiff) {
    const z = originalPointA.z - comparePointA.x;

    // if Y axis is the same then Z = -X (270 degrees on the Y axis)
    if (compareYDiff === originYDiff) {
      const y = originalPointA.y - comparePointA.y;
      const x = originalPointA.x + comparePointA.z;

      return { x, y, z, rotation: PointRotation.Y270 };
    }

    // if Y is the same as the X axis then Z = Y (270 degrees on the Y axis and 270 degrees on the Z axis)
    if (compareYDiff === originXDiff) {
      const y = originalPointA.y - comparePointA.z;
      const x = originalPointA.x - comparePointA.y;

      return { x, y, z, rotation: PointRotation.Y270Z270 };
    }

    // if Y = -Y then Z = x (270 degrees on the Y axis and 180 degrees on the Z axis)
    if (compareYDiff === -originYDiff) {
      const y = originalPointA.y + comparePointA.y;
      const x = originalPointA.x - comparePointA.z;

      return { x, y, z, rotation: PointRotation.Y270Z180 };
    }

    // otherwise Y = -X and Z = -Y (270 degrees on the Y axiS and 90 degrees on the z axis)
    const y = originalPointA.y + comparePointA.z;
    const x = originalPointA.x + comparePointA.y;

    return { x, y, z, rotation: PointRotation.Y270Z90 };
  }

  // X axis is the same -Z axis (this means it's rotated 90 degrees on Y axis)
  if (compareXDiff === -originZDiff) {
    const z = originalPointA.z + comparePointA.x;

    // if Y axis is the same then Z = X (90 degrees on the Y axis)
    if (compareYDiff === originYDiff) {
      const y = originalPointA.y - comparePointA.y;
      const x = originalPointA.x - comparePointA.z;

      return { x, y, z, rotation: PointRotation.Y90 };
    }

    // if Y is the same as the X axis then Z = -Y (90 degrees on the Y axis and 270 degrees on the Z axis)
    if (compareYDiff === originXDiff) {
      const y = originalPointA.y + comparePointA.z;
      const x = originalPointA.x - comparePointA.y;

      return { x, y, z, rotation: PointRotation.Y90Z270 };
    }

    // if Y = -Y then Z = -X (90 degrees on the Y axis and 180 degrees on the Z axis)
    if (compareYDiff === -originYDiff) {
      const y = originalPointA.y + comparePointA.y;
      const x = originalPointA.x + comparePointA.z;

      return { x, y, z, rotation: PointRotation.Y90Z180 };
    }

    // otherwise Y = -X and Z = Y (90 degrees on the Y axiS and 90 degrees on the z axis)
    const y = originalPointA.y - comparePointA.z;
    const x = originalPointA.z + comparePointA.y;

    return { x, y, z, rotation: PointRotation.Y90Z90 };
  }

  return { x: 0, y: 0, z: 0, rotation: PointRotation.X0 };
};

const testRotationPoints = () => {
  console.log("============TESTING ROTATION==============");

  const separator = {
    rotation: "───",
    result: "───",
    expected: "───",
    valid: "───"
  };

  const table = [];
  let test = getRotatedPoints([{ x: 1, y: 2, z: 3 }], {
    x: 0,
    y: 0,
    z: 0,
    rotation: PointRotation.X0
  });
  table.push({
    rotation: "X0",
    result: `(${test[0].x},${test[0].y},${test[0].z})`,
    expected: "(1,2,3)",
    valid: `(${test[0].x},${test[0].y},${test[0].z})` === "(1,2,3)"
  });

  test = getRotatedPoints([{ x: 1, y: 2, z: 3 }], {
    x: 0,
    y: 0,
    z: 0,
    rotation: PointRotation.X90
  });
  table.push({
    rotation: "X90",
    result: `(${test[0].x},${test[0].y},${test[0].z})`,
    expected: "(1,-3,2)",
    valid: `(${test[0].x},${test[0].y},${test[0].z})` === "(1,-3,2)"
  });

  test = getRotatedPoints([{ x: 1, y: 2, z: 3 }], {
    x: 0,
    y: 0,
    z: 0,
    rotation: PointRotation.X180
  });
  table.push({
    rotation: "X180",
    result: `(${test[0].x},${test[0].y},${test[0].z})`,
    expected: "(1,-2,-3)",
    valid: `(${test[0].x},${test[0].y},${test[0].z})` === "(1,-2,-3)"
  });

  test = getRotatedPoints([{ x: 1, y: 2, z: 3 }], {
    x: 0,
    y: 0,
    z: 0,
    rotation: PointRotation.X270
  });
  table.push({
    rotation: "X270",
    result: `(${test[0].x},${test[0].y},${test[0].z})`,
    expected: "(1,-3,-2)",
    valid: `(${test[0].x},${test[0].y},${test[0].z})` === "(1,3,-2)"
  });

  table.push({});

  test = getRotatedPoints([{ x: 1, y: 2, z: 3 }], {
    x: 0,
    y: 0,
    z: 0,
    rotation: PointRotation.Z90
  });
  table.push({
    rotation: "Z90",
    result: `(${test[0].x},${test[0].y},${test[0].z})`,
    expected: "(-2,1,3)",
    valid: `(${test[0].x},${test[0].y},${test[0].z})` === "(-2,1,3)"
  });

  test = getRotatedPoints([{ x: 1, y: 2, z: 3 }], {
    x: 0,
    y: 0,
    z: 0,
    rotation: PointRotation.Z90Y90
  });
  table.push({
    rotation: "Z90Y90",
    result: `(${test[0].x},${test[0].y},${test[0].z})`,
    expected: "(3,1,2)",
    valid: `(${test[0].x},${test[0].y},${test[0].z})` === "(3,1,2)"
  });

  test = getRotatedPoints([{ x: 1, y: 2, z: 3 }], {
    x: 0,
    y: 0,
    z: 0,
    rotation: PointRotation.Z90Y180
  });
  table.push({
    rotation: "Z90Y180",
    result: `(${test[0].x},${test[0].y},${test[0].z})`,
    expected: "(2,1,-3)",
    valid: `(${test[0].x},${test[0].y},${test[0].z})` === "(2,1,-3)"
  });

  test = getRotatedPoints([{ x: 1, y: 2, z: 3 }], {
    x: 0,
    y: 0,
    z: 0,
    rotation: PointRotation.Z90Y270
  });
  table.push({
    rotation: "Z90Y270",
    result: `(${test[0].x},${test[0].y},${test[0].z})`,
    expected: "(-3,1,-2)",
    valid: `(${test[0].x},${test[0].y},${test[0].z})` === "(-3,1,-2)"
  });

  table.push({});

  test = getRotatedPoints([{ x: 1, y: 2, z: 3 }], {
    x: 0,
    y: 0,
    z: 0,
    rotation: PointRotation.Z180
  });
  table.push({
    rotation: "Z180",
    result: `(${test[0].x},${test[0].y},${test[0].z})`,
    expected: "(-1,-2,3)",
    valid: `(${test[0].x},${test[0].y},${test[0].z})` === "(-1,-2,3)"
  });

  test = getRotatedPoints([{ x: 1, y: 2, z: 3 }], {
    x: 0,
    y: 0,
    z: 0,
    rotation: PointRotation.Z180X90
  });
  table.push({
    rotation: "Z180X90",
    result: `(${test[0].x},${test[0].y},${test[0].z})`,
    expected: "(-1,-3,-2)",
    valid: `(${test[0].x},${test[0].y},${test[0].z})` === "(-1,-3,-2)"
  });

  test = getRotatedPoints([{ x: 1, y: 2, z: 3 }], {
    x: 0,
    y: 0,
    z: 0,
    rotation: PointRotation.Z180X180
  });
  table.push({
    rotation: "Z180X180",
    result: `(${test[0].x},${test[0].y},${test[0].z})`,
    expected: "(-1,2,-3)",
    valid: `(${test[0].x},${test[0].y},${test[0].z})` === "(-1,2,-3)"
  });

  test = getRotatedPoints([{ x: 1, y: 2, z: 3 }], {
    x: 0,
    y: 0,
    z: 0,
    rotation: PointRotation.Z180X270
  });
  table.push({
    rotation: "Z180X270",
    result: `(${test[0].x},${test[0].y},${test[0].z})`,
    expected: "(-1,3,2)",
    valid: `(${test[0].x},${test[0].y},${test[0].z})` === "(-1,3,2)"
  });

  table.push({});

  test = getRotatedPoints([{ x: 1, y: 2, z: 3 }], {
    x: 0,
    y: 0,
    z: 0,
    rotation: PointRotation.Z270
  });
  table.push({
    rotation: "Z270",
    result: `(${test[0].x},${test[0].y},${test[0].z})`,
    expected: "(2,-1,3)",
    valid: `(${test[0].x},${test[0].y},${test[0].z})` === "(2,-1,3)"
  });

  test = getRotatedPoints([{ x: 1, y: 2, z: 3 }], {
    x: 0,
    y: 0,
    z: 0,
    rotation: PointRotation.Z270Y90
  });
  table.push({
    rotation: "Z270Y90",
    result: `(${test[0].x},${test[0].y},${test[0].z})`,
    expected: "(3,-1,-2)",
    valid: `(${test[0].x},${test[0].y},${test[0].z})` === "(3,-1,-2)"
  });

  test = getRotatedPoints([{ x: 1, y: 2, z: 3 }], {
    x: 0,
    y: 0,
    z: 0,
    rotation: PointRotation.Z270Y180
  });
  table.push({
    rotation: "Z270Y180",
    result: `(${test[0].x},${test[0].y},${test[0].z})`,
    expected: "(-2,-1,-3)",
    valid: `(${test[0].x},${test[0].y},${test[0].z})` === "(-2,-1,-3)"
  });

  test = getRotatedPoints([{ x: 1, y: 2, z: 3 }], {
    x: 0,
    y: 0,
    z: 0,
    rotation: PointRotation.Z270Y270
  });
  table.push({
    rotation: "Z270Y270",
    result: `(${test[0].x},${test[0].y},${test[0].z})`,
    expected: "(-3,-1,2)",
    valid: `(${test[0].x},${test[0].y},${test[0].z})` === "(-3,-1,2)"
  });

  table.push({});

  test = getRotatedPoints([{ x: 1, y: 2, z: 3 }], {
    x: 0,
    y: 0,
    z: 0,
    rotation: PointRotation.Y270
  });
  table.push({
    rotation: "Y270",
    result: `(${test[0].x},${test[0].y},${test[0].z})`,
    expected: "(-3,2,1)",
    valid: `(${test[0].x},${test[0].y},${test[0].z})` === "(-3,2,1)"
  });

  test = getRotatedPoints([{ x: 1, y: 2, z: 3 }], {
    x: 0,
    y: 0,
    z: 0,
    rotation: PointRotation.Y270Z90
  });
  table.push({
    rotation: "Y270Z90",
    result: `(${test[0].x},${test[0].y},${test[0].z})`,
    expected: "(-2,-3,1)",
    valid: `(${test[0].x},${test[0].y},${test[0].z})` === "(-2,-3,1)"
  });

  test = getRotatedPoints([{ x: 1, y: 2, z: 3 }], {
    x: 0,
    y: 0,
    z: 0,
    rotation: PointRotation.Y270Z180
  });
  table.push({
    rotation: "Y270Z180",
    result: `(${test[0].x},${test[0].y},${test[0].z})`,
    expected: "(3,-2,1)",
    valid: `(${test[0].x},${test[0].y},${test[0].z})` === "(3,-2,1)"
  });

  test = getRotatedPoints([{ x: 1, y: 2, z: 3 }], {
    x: 0,
    y: 0,
    z: 0,
    rotation: PointRotation.Y270Z270
  });
  table.push({
    rotation: "Y270Z270",
    result: `(${test[0].x},${test[0].y},${test[0].z})`,
    expected: "(2,3,1)",
    valid: `(${test[0].x},${test[0].y},${test[0].z})` === "(2,3,1)"
  });

  table.push({});

  test = getRotatedPoints([{ x: 1, y: 2, z: 3 }], {
    x: 0,
    y: 0,
    z: 0,
    rotation: PointRotation.Y90
  });
  table.push({
    rotation: "Y90",
    result: `(${test[0].x},${test[0].y},${test[0].z})`,
    expected: "(3,2,-1)",
    valid: `(${test[0].x},${test[0].y},${test[0].z})` === "(3,2,-1)"
  });

  test = getRotatedPoints([{ x: 1, y: 2, z: 3 }], {
    x: 0,
    y: 0,
    z: 0,
    rotation: PointRotation.Y90Z90
  });
  table.push({
    rotation: "Y90Z90",
    result: `(${test[0].x},${test[0].y},${test[0].z})`,
    expected: "(-2,3,-1)",
    valid: `(${test[0].x},${test[0].y},${test[0].z})` === "(-2,3,-1)"
  });

  test = getRotatedPoints([{ x: 1, y: 2, z: 3 }], {
    x: 0,
    y: 0,
    z: 0,
    rotation: PointRotation.Y90Z180
  });
  table.push({
    rotation: "Y90Z180",
    result: `(${test[0].x},${test[0].y},${test[0].z})`,
    expected: "(-3,-2,-1)",
    valid: `(${test[0].x},${test[0].y},${test[0].z})` === "(-3,-2,-1)"
  });

  test = getRotatedPoints([{ x: 1, y: 2, z: 3 }], {
    x: 0,
    y: 0,
    z: 0,
    rotation: PointRotation.Y90Z270
  });
  table.push({
    rotation: "Y90Z270",
    result: `(${test[0].x},${test[0].y},${test[0].z})`,
    expected: "(2,-3,-1)",
    valid: `(${test[0].x},${test[0].y},${test[0].z})` === "(2,-3,-1)"
  });

  table.push({});

  console.table(table);
};

export const day19Part1 = () => {
  const scanners = parseInput();

  const scannerPositions: { [key: number]: Position } = {
    0: {
      x: 0,
      y: 0,
      z: 0
    }
  };
  const scannerPoints: { [key: number]: Position[] } = {
    0: JSON.parse(JSON.stringify(scanners[0].beacons))
  };
  const scannerLines: { [key: number]: LineData[] } = {
    0: getLinesBetweenPoints(scannerPoints[0])
  };

  const allPoints: Position[] = JSON.parse(JSON.stringify(scanners[0].beacons));

  let scannersToCheck = scanners.slice(1);

  while (scannersToCheck.length > 0) {
    const scannedIds = Object.keys(scannerPositions);

    for (const scannerId of scannedIds) {
      // const originalScannerPosition = scannerPositions[Number(scannerId)];
      const originalPoints = scannerPoints[Number(scannerId)];
      const originalLines = scannerLines[Number(scannerId)];
      // const originalScanner = scanners.find(s => s.id === Number(scannerId))!;

      let maxCommonP: {
        original: number;
        compare: number;
      }[] = [];
      let maxCommonScan: Scanner | undefined = undefined;

      for (const scanner of scannersToCheck) {
        const lines = getLinesBetweenPoints(scanner.beacons);
        const commonP = commonPoints(originalLines, lines);

        if (commonP.length > maxCommonP.length) {
          maxCommonP = commonP;
          maxCommonScan = scanner;
        }
      }

      if (maxCommonP.length > 11) {
        const scanner = maxCommonScan!;
        const scannerPosition = getScannerPosition(
          originalPoints[maxCommonP[0].original],
          scanner.beacons[maxCommonP[0].compare],
          originalPoints[maxCommonP[1].original],
          scanner.beacons[maxCommonP[1].compare]
        );

        const rotatedPoints = getRotatedPoints(scanner.beacons, scannerPosition);
        const rotatedLines = getLinesBetweenPoints(rotatedPoints);

        scannerPositions[scanner.id] = {
          x: scannerPosition.x,
          y: scannerPosition.y,
          z: scannerPosition.z
        };
        scannerPoints[scanner.id] = rotatedPoints;
        scannerLines[scanner.id] = rotatedLines;
        scannersToCheck = scannersToCheck.filter(s => s.id !== scanner.id);

        for (const point of rotatedPoints) {
          if (!allPoints.find(p => p.x === point.x && p.y === point.y && p.z === point.z)) {
            allPoints.push(point);
          }
        }
        break;
      }
    }
  }

  return allPoints.length;
};

export const day19Part2 = () => {};
