import prettyMilliseconds = require("pretty-ms");
import { countIncreases, countIncreasesPart2 } from "./1";
import { day10Part1, day10Part2 } from "./10";
import { day11Part1, day11Part2 } from "./11";
import { movePart1, movePart2 } from "./2";
import { part1, part2 } from "./3";
import { day4Part1, day4Part2 } from "./4";
import { day5Part1, day5Part2 } from "./5";
import { day6Part1, day6Part2 } from "./6";
import { day7Part1, day7Part2 } from "./7";
import { day8Part1, day8Part2 } from "./8";
import { day9Part1, day9Part2 } from "./9";

let start = +new Date();
const d1p1 = countIncreases();
let end = +new Date();
console.log(`[${prettyMilliseconds(end - start)}][2021][Day 1][Part 1]: ${d1p1}`);
start = +new Date();
const d1p2 = countIncreasesPart2();
end = +new Date();
console.log(`[${prettyMilliseconds(end - start)}][2021][Day 1][Part 2]: ${d1p2}`);

start = +new Date();
const d2p1 = movePart1();
end = +new Date();
console.log(`[${prettyMilliseconds(end - start)}][2021][Day 2][Part 1]: ${d2p1}`);
start = +new Date();
const d2p2 = movePart2();
end = +new Date();
console.log(`[${prettyMilliseconds(end - start)}][2021][Day 2][Part 2]: ${d2p2}`);

start = +new Date();
const d3p1 = part1();
end = +new Date();
console.log(`[${prettyMilliseconds(end - start)}][2021][Day 3][Part 1]: ${d3p1}`);
start = +new Date();
const d3p2 = part2();
end = +new Date();
console.log(`[${prettyMilliseconds(end - start)}][2021][Day 3][Part 2]: ${d3p2}`);

start = +new Date();
const d4p1 = day4Part1();
end = +new Date();
console.log(`[${prettyMilliseconds(end - start)}][2021][Day 4][Part 1]: ${d4p1}`);
start = +new Date();
const d4p2 = day4Part2();
end = +new Date();
console.log(`[${prettyMilliseconds(end - start)}][2021][Day 4][Part 2]: ${d4p2}`);

start = +new Date();
const d5p1 = day5Part1();
end = +new Date();
console.log(`[${prettyMilliseconds(end - start)}][2021][Day 5][Part 1]: ${d5p1}`);
start = +new Date();
const d5p2 = day5Part2();
end = +new Date();
console.log(`[${prettyMilliseconds(end - start)}][2021][Day 5][Part 2]: ${d5p2}`);

start = +new Date();
const d6p1 = day6Part1();
end = +new Date();
console.log(`[${prettyMilliseconds(end - start)}][2021][Day 6][Part 1]: ${d6p1}`);
start = +new Date();
const d6p2 = day6Part2();
end = +new Date();
console.log(`[${prettyMilliseconds(end - start)}][2021][Day 6][Part 2]: ${d6p2}`);

start = +new Date();
const d7p1 = day7Part1();
end = +new Date();
console.log(`[${prettyMilliseconds(end - start)}][2021][Day 7][Part 1]: ${d7p1}`);
start = +new Date();
const d7p2 = day7Part2();
end = +new Date();
console.log(`[${prettyMilliseconds(end - start)}][2021][Day 7][Part 2]: ${d7p2}`);

start = +new Date();
const d8p1 = day8Part1();
end = +new Date();
console.log(`[${prettyMilliseconds(end - start)}][2021][Day 8][Part 1]: ${d8p1}`);
start = +new Date();
const d8p2 = day8Part2();
end = +new Date();
console.log(`[${prettyMilliseconds(end - start)}][2021][Day 8][Part 2]: ${d8p2}`);

start = +new Date();
const d9p1 = day9Part1();
end = +new Date();
console.log(`[${prettyMilliseconds(end - start)}][2021][Day 9][Part 1]: ${d9p1}`);
start = +new Date();
const d9p2 = day9Part2();
end = +new Date();
console.log(`[${prettyMilliseconds(end - start)}][2021][Day 9][Part 2]: ${d9p2}`);

start = +new Date();
const d10p1 = day10Part1();
end = +new Date();
console.log(`[${prettyMilliseconds(end - start)}][2021][Day 10][Part 1]: ${d10p1}`);
start = +new Date();
const d10p2 = day10Part2();
end = +new Date();
console.log(`[${prettyMilliseconds(end - start)}][2021][Day 10][Part 2]: ${d10p2}`);

start = +new Date();
const d11p1 = day11Part1();
end = +new Date();
console.log(`[${prettyMilliseconds(end - start)}][2021][Day 11][Part 1]: ${d11p1}`);
start = +new Date();
const d11p2 = day11Part2();
end = +new Date();
console.log(`[${prettyMilliseconds(end - start)}][2021][Day 11][Part 2]: ${d11p2}`);
