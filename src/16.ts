import { readFileSync } from "fs";

const hexToBinMap = {
  "0": "0000",
  "1": "0001",
  "2": "0010",
  "3": "0011",
  "4": "0100",
  "5": "0101",
  "6": "0110",
  "7": "0111",
  "8": "1000",
  "9": "1001",
  A: "1010",
  B: "1011",
  C: "1100",
  D: "1101",
  E: "1110",
  F: "1111"
};

type Hex = keyof typeof hexToBinMap;

interface Packet {
  version: number;
  typeId: number;
  length: number;
  value?: number | undefined;
  subPackets?: Packet[] | undefined;
}

interface LiteralValue {
  value: number;
  length: number;
}

const parseInput = (): string => {
  const input = readFileSync("input/16").toString();
  return input
    .split("")
    .map(char => hexToBinMap[char as Hex])
    .join("");
};

const DATA_BIN = parseInput();

const parseLiteralValue = (binString: string, padded: boolean): LiteralValue => {
  let i = 6;
  let numberBin = "";
  do {
    numberBin += binString.slice(i + 1, i + 5);
    i += 5;
  } while (binString.charAt(i - 5) !== "0");

  if (padded) {
    const multiple4 = i % 4 === 0;

    if (!multiple4) {
      i += 4 - (i % 4);
    }
  }

  return {
    value: parseInt(numberBin, 2),
    length: i
  };
};

const parseOperator = (binString: string) => {
  const lengthTypeId = binString[6];

  if (lengthTypeId === "0") {
    let length = 7 + 15;

    const totalLength = parseInt(binString.slice(7, length), 2);

    const subPackets: Packet[] = [];

    let i = 0;

    while (i < totalLength) {
      const string = binString.slice(length + i);

      const subPacket = parsePacket(string, false);

      subPackets.push(subPacket);

      i += subPacket.length;
    }

    return {
      subPackets,
      length: length + totalLength
    };
  }

  let length = 7 + 11;

  const subPacketCount = parseInt(binString.slice(7, length), 2);

  const subPackets: Packet[] = [];

  let i = 0;

  while (i < subPacketCount) {
    const string = binString.slice(length);

    const subPacket = parsePacket(string, false);

    subPackets.push(subPacket);

    length += subPacket.length;

    i++;
  }

  return {
    subPackets,
    length: length
  };
};

const parsePacket = (binString: string, padded = true): Packet => {
  if (binString.length <= 6) {
    return {
      version: -1,
      typeId: -1,
      length: binString.length
    };
  }
  const version = parseInt(binString.slice(0, 3), 2);
  const typeId = parseInt(binString.slice(3, 6), 2);

  let length = 0;
  let value: number | undefined = undefined;
  let subPackets: Packet[] | undefined = undefined;

  if (typeId === 4) {
    const { value: literalValue, length: literalLength } = parseLiteralValue(binString, padded);
    length = literalLength;
    value = literalValue;
  } else {
    const { subPackets: operatorSubPackets, length: operatorLength } = parseOperator(
      binString.slice(length)
    );
    length = operatorLength;
    subPackets = operatorSubPackets;
  }

  return {
    version,
    typeId,
    length,
    value,
    subPackets
  };
};

const versionReducer = (acc: number, packet: Packet): number => {
  const subPackets: number = packet.subPackets ? packet.subPackets.reduce(versionReducer, 0) : 0;

  return acc + packet.version + subPackets;
};

export const day16Part1 = () => {
  const packet = parsePacket(DATA_BIN);

  return [packet].reduce(versionReducer, 0);
};

const calculatePacket = (packet: Packet): number => {
  if (packet.typeId === 4) {
    return packet.value!;
  }

  if (packet.typeId === 0) {
    return packet.subPackets!.reduce((acc, cur) => acc + calculatePacket(cur), 0);
  }

  if (packet.typeId === 1) {
    return packet.subPackets!.reduce((acc, cur) => acc * calculatePacket(cur), 1);
  }

  if (packet.typeId === 2) {
    return packet.subPackets!.reduce((acc, cur) => {
      const packetValue = calculatePacket(cur);
      if (packetValue < acc) {
        return packetValue;
      }
      return acc;
    }, Infinity);
  }

  if (packet.typeId === 3) {
    return packet.subPackets!.reduce((acc, cur) => {
      const packetValue = calculatePacket(cur);
      if (packetValue > acc) {
        return packetValue;
      }
      return acc;
    }, 0);
  }

  if (packet.typeId === 5) {
    const packet1Value = calculatePacket(packet.subPackets![0]);
    const packet2Value = calculatePacket(packet.subPackets![1]);
    return packet1Value > packet2Value ? 1 : 0;
  }

  if (packet.typeId === 6) {
    const packet1Value = calculatePacket(packet.subPackets![0]);
    const packet2Value = calculatePacket(packet.subPackets![1]);
    return packet1Value < packet2Value ? 1 : 0;
  }

  if (packet.typeId === 7) {
    const packet1Value = calculatePacket(packet.subPackets![0]);
    const packet2Value = calculatePacket(packet.subPackets![1]);
    return packet1Value === packet2Value ? 1 : 0;
  }

  return 0;
};

export const day16Part2 = () => {
  const packet = parsePacket(DATA_BIN);
  return calculatePacket(packet);
};
