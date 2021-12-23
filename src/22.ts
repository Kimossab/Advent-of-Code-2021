import { readFileSync } from "fs";

interface Cuboid {
  x1: number;
  x2: number;
  y1: number;
  y2: number;
  z1: number;
  z2: number;
}

interface Point {
  x: number;
  y: number;
  z: number;
}

interface InputCuboid extends Cuboid {
  toggle: boolean;
}

const parseInput = (): InputCuboid[] => {
  const input = readFileSync("input/22").toString();

  return input.split("\n").map(line => {
    const matches =
      /(?<toggle>on|off)\sx=(?<x1>-?\d*)..(?<x2>-?\d*),y=(?<y1>-?\d*)..(?<y2>-?\d*),z=(?<z1>-?\d*)..(?<z2>-?\d*)/g.exec(
        line
      );

    return {
      x1: matches?.groups?.["x1"] ? Number(matches.groups["x1"]) : 0,
      x2: matches?.groups?.["x2"] ? Number(matches.groups["x2"]) : 0,
      y1: matches?.groups?.["y1"] ? Number(matches.groups["y1"]) : 0,
      y2: matches?.groups?.["y2"] ? Number(matches.groups["y2"]) : 0,
      z1: matches?.groups?.["z1"] ? Number(matches.groups["z1"]) : 0,
      z2: matches?.groups?.["z2"] ? Number(matches.groups["z2"]) : 0,
      toggle: matches?.groups?.["toggle"] === "on"
    };
  });
};

export const day22Part1 = () => {
  const min = -50;
  const max = 50;

  // 3D array not working properly
  // good ol' memories of C/C++ ¯\_(ツ)_/¯
  const cubes: ("on" | "off")[] = new Array(
    (max - min + 1) * (max - min + 1) * (max - min + 1)
  ).fill("off");
  const cuboids = parseInput();

  for (const cuboid of cuboids) {
    //for speed up
    if (
      cuboid.x1 > max ||
      cuboid.x2 < min ||
      cuboid.y1 > max ||
      cuboid.y2 < min ||
      cuboid.z1 > max ||
      cuboid.z2 < min
    ) {
      continue;
    }

    for (let x = cuboid.x1; x <= cuboid.x2; x++) {
      for (let y = cuboid.y1; y <= cuboid.y2; y++) {
        for (let z = cuboid.z1; z <= cuboid.z2; z++) {
          cubes[
            (x - min) * (max - min + 1) * (max - min + 1) + (y - min) * (max - min + 1) + (z - min)
          ] = cuboid.toggle ? "on" : "off";
        }
      }
    }
  }

  return cubes.filter(c => c === "on").length;
};

const checkCuboidIntersection = (cuboid1: Cuboid, cuboid2: Cuboid): boolean => {
  return (
    cuboid1.x1 <= cuboid2.x2 &&
    cuboid1.x2 >= cuboid2.x1 &&
    cuboid1.y1 <= cuboid2.y2 &&
    cuboid1.y2 >= cuboid2.y1 &&
    cuboid1.z1 <= cuboid2.z2 &&
    cuboid1.z2 >= cuboid2.z1
  );
};

const getCuboidIntersection = (cuboidA: Cuboid, cuboidB: Cuboid): Cuboid | null => {
  if (!checkCuboidIntersection(cuboidA, cuboidB)) {
    return null;
  }

  return {
    x1: Math.max(cuboidA.x1, cuboidB.x1),
    x2: Math.min(cuboidA.x2, cuboidB.x2),
    y1: Math.max(cuboidA.y1, cuboidB.y1),
    y2: Math.min(cuboidA.y2, cuboidB.y2),
    z1: Math.max(cuboidA.z1, cuboidB.z1),
    z2: Math.min(cuboidA.z2, cuboidB.z2)
  };
};

const removeCuboidFromCuboid = (cuboid: Cuboid, cuboidToRemove: Cuboid): Cuboid[] => {
  const intersection = getCuboidIntersection(cuboid, cuboidToRemove);

  if (!intersection) {
    return [cuboid];
  }

  const cuboids: Cuboid[] = [];

  if (cuboid.x2 > cuboidToRemove.x2) {
    cuboids.push({
      x1: cuboidToRemove.x2 + 1,
      x2: cuboid.x2,
      y1: cuboid.y1,
      y2: cuboid.y2,
      z1: cuboid.z1,
      z2: cuboid.z2
    });
  }

  if (cuboid.x1 < cuboidToRemove.x1) {
    cuboids.push({
      x1: cuboid.x1,
      x2: cuboidToRemove.x1 - 1,
      y1: cuboid.y1,
      y2: cuboid.y2,
      z1: cuboid.z1,
      z2: cuboid.z2
    });
  }

  if (cuboid.y2 > cuboidToRemove.y2) {
    cuboids.push({
      x1: intersection.x1,
      x2: intersection.x2,
      y1: cuboidToRemove.y2 + 1,
      y2: cuboid.y2,
      z1: cuboid.z1,
      z2: cuboid.z2
    });
  }

  if (cuboid.y1 < cuboidToRemove.y1) {
    cuboids.push({
      x1: intersection.x1,
      x2: intersection.x2,
      y1: cuboid.y1,
      y2: cuboidToRemove.y1 - 1,
      z1: cuboid.z1,
      z2: cuboid.z2
    });
  }

  if (cuboid.z2 > cuboidToRemove.z2) {
    cuboids.push({
      x1: intersection.x1,
      x2: intersection.x2,
      y1: intersection.y1,
      y2: intersection.y2,
      z1: cuboidToRemove.z2 + 1,
      z2: cuboid.z2
    });
  }

  if (cuboid.z1 < cuboidToRemove.z1) {
    cuboids.push({
      x1: intersection.x1,
      x2: intersection.x2,
      y1: intersection.y1,
      y2: intersection.y2,
      z1: cuboid.z1,
      z2: cuboidToRemove.z1 - 1
    });
  }

  return cuboids;
};

const getVolume = (cuboid: Cuboid): number => {
  return (cuboid.x2 - cuboid.x1 + 1) * (cuboid.y2 - cuboid.y1 + 1) * (cuboid.z2 - cuboid.z1 + 1);
};

const getPointsForCuboid = (cuboid: Cuboid): Point[] => {
  const points: Point[] = [];

  for (let x = cuboid.x1; x <= cuboid.x2; x++) {
    for (let y = cuboid.y1; y <= cuboid.y2; y++) {
      for (let z = cuboid.z1; z <= cuboid.z2; z++) {
        points.push({ x, y, z });
      }
    }
  }

  return points;
};

export const day22Part2 = () => {
  const cuboids = parseInput();

  let cuboidsOn: Cuboid[] = [];

  // removing is not working properly
  // https://www.geogebra.org/3d/x5zhkxzq
  let i = 0;

  for (const cuboid of cuboids) {
    if (cuboid.toggle) {
      // sum
      if (cuboidsOn.length === 0) {
        i++;
        cuboidsOn.push(cuboid);
        continue;
      }

      let aux: Cuboid[] = [cuboid];

      for (const cuboidOn of cuboidsOn) {
        let a: Cuboid[] = [];
        for (const cub of aux) {
          const cuboids = removeCuboidFromCuboid(cub, cuboidOn);
          a = a.concat(cuboids);
        }
        aux = a;
      }

      cuboidsOn = cuboidsOn.concat(aux);
    } else {
      // subtraction
      let aux: Cuboid[] = [];

      for (const cuboidOn of cuboidsOn) {
        aux = aux.concat(removeCuboidFromCuboid(cuboidOn, cuboid));
      }

      cuboidsOn = aux;
    }

    const volume = cuboidsOn.map(c => getVolume(c)).reduce((a, b) => a + b, 0);
  }

  return cuboidsOn.map(c => getVolume(c)).reduce((a, b) => a + b, 0);
};
