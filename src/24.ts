import { readFileSync } from "fs";

enum Instruction {
  INP = "inp",
  ADD = "add",
  MUL = "mul",
  DIV = "div",
  MOD = "mod",
  EQL = "eql"
}

enum Registers {
  W = "w",
  X = "x",
  Y = "y",
  Z = "z"
}

interface InstructionCommand {
  register: Registers;
  op: Instruction;
  value: number | Registers | undefined;
}

// would be faster without the class, but I think this makes it so much easier to understand
class ALU {
  // LOL wasn't expecting this to work
  public [Registers.W]: number;
  public [Registers.X]: number;
  public [Registers.Y]: number;
  public [Registers.Z]: number;

  constructor(z: number = 0) {
    this.reset();
    this[Registers.Z] = z;
  }

  public do(command: InstructionCommand, input: number = 0) {
    this[command.op](command, input);
  }

  public reset() {
    this[Registers.W] = 0;
    this[Registers.X] = 0;
    this[Registers.Y] = 0;
    this[Registers.Z] = 0;
  }

  public get(register: Registers) {
    return this[register];
  }

  private [Instruction.INP](command: InstructionCommand, input: number) {
    this[command.register] = input;
  }

  private [Instruction.ADD](command: InstructionCommand, _input: number) {
    this[command.register] =
      this[command.register] +
      (typeof command.value === "number" ? command.value : this[command.value!]);
  }

  private [Instruction.MUL](command: InstructionCommand, _input: number) {
    this[command.register] =
      this[command.register] *
      (typeof command.value === "number" ? command.value : this[command.value!]);
  }

  private [Instruction.DIV](command: InstructionCommand, _input: number) {
    const b = typeof command.value === "number" ? command.value : this[command.value!];
    if (b === 0) {
      return;
    }

    this[command.register] = Math.floor(this[command.register] / b);
  }

  private [Instruction.MOD](command: InstructionCommand, _input: number) {
    const a = this[command.register];
    const b = typeof command.value === "number" ? command.value : this[command.value!];
    if (a < 0 || b <= 0) {
      return;
    }
    this[command.register] = a % b;
  }

  private [Instruction.EQL](command: InstructionCommand, _input: number) {
    this[command.register] =
      this[command.register] ===
      (typeof command.value === "number" ? command.value : this[command.value!])
        ? 1
        : 0;
  }
}

const parseInput = (): InstructionCommand[] => {
  const input = readFileSync("input/24").toString();
  return input.split("\n").map(l => {
    const [op, register, value] = l.split(" ");

    if (!value) {
      return {
        op: Instruction.INP,
        register: register as Registers,
        value: undefined
      };
    }

    const v = parseInt(value, 10);

    return {
      op: op as Instruction,
      register: register as Registers,
      value: Number.isNaN(v) ? (value as Registers) : v
    };
  });
};

let minZ = Infinity;
let cache = new Set<string>();

const checkCache = (key: string): boolean => {
  if (cache.has(key)) {
    return true;
  }

  try {
    cache.add(key);
  } catch (e) {
    cache = new Set<string>();
    cache.add(key);
  }
  return false;
};

const instructionSection = (
  decrement: boolean,
  alu: ALU,
  commands: InstructionCommand[][],
  input: number,
  index: number,
  previous: number = 0
): number => {
  const key = `${index}${alu.get(Registers.Z)}${input}`;

  if (checkCache(key)) {
    return 0;
  }

  const curNum = previous * 10 + input;

  for (const command of commands[index]) {
    if (command.op === Instruction.INP) {
      alu.do(command, input);
    } else {
      alu.do(command);
    }
  }

  if (index === commands.length - 1) {
    const z = alu.get(Registers.Z);
    if (z < minZ) {
      minZ = z;
    }
    return z === 0 ? curNum : 0;
  }

  if (decrement) {
    for (let i = 9; i > 0; i--) {
      const valid = instructionSection(
        decrement,
        new ALU(alu.get(Registers.Z)),
        commands,
        i,
        index + 1,
        curNum
      );
      if (valid !== 0) {
        return valid;
      }
    }
  } else {
    for (let i = 1; i < 10; i++) {
      const valid = instructionSection(
        decrement,
        new ALU(alu.get(Registers.Z)),
        commands,
        i,
        index + 1,
        curNum
      );
      if (valid !== 0) {
        return valid;
      }
    }
  }

  return 0;
};

export const day24Part1 = () => {
  cache = new Set<string>();
  const instructions = parseInput().reduce<InstructionCommand[][]>((acc, cur) => {
    if (cur.op === Instruction.INP) {
      acc.push([]);
    }
    acc[acc.length - 1].push(cur);
    return acc;
  }, []);

  for (let i = 9; i > 0; i--) {
    const alu = new ALU();
    const valid = instructionSection(true, alu, instructions, i, 0);
    if (valid !== 0) {
      return valid;
    }
  }

  return undefined;
};

export const day24Part2 = () => {
  cache = new Set<string>();
  const instructions = parseInput().reduce<InstructionCommand[][]>((acc, cur) => {
    if (cur.op === Instruction.INP) {
      acc.push([]);
    }
    acc[acc.length - 1].push(cur);
    return acc;
  }, []);

  for (let i = 1; i < 10; i++) {
    const alu = new ALU();
    const valid = instructionSection(false, alu, instructions, i, 0);
    if (valid !== 0) {
      return valid;
    }
  }

  return undefined;
};
