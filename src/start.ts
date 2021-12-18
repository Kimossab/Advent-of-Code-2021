import prettyMilliseconds = require("pretty-ms");
import { countIncreases, countIncreasesPart2 } from "./1";
// import { day10Part1, day10Part2 } from "./10";
// import { day11Part1, day11Part2 } from "./11";
// import { day12Part1, day12Part2 } from "./12";
import { day13Part1, day13Part2 } from "./13";
import { day14Part1, day14Part2 } from "./14";
import { day15Part1, day15Part2 } from "./15";
import { day16Part1, day16Part2 } from "./16";
// import { movePart1, movePart2 } from "./2";
// import { part1, part2 } from "./3";
// import { day4Part1, day4Part2 } from "./4";
// import { day5Part1, day5Part2 } from "./5";
// import { day6Part1, day6Part2 } from "./6";
// import { day7Part1, day7Part2 } from "./7";
// import { day8Part1, day8Part2 } from "./8";
// import { day9Part1, day9Part2 } from "./9";

let start = +new Date();
const d1p1 = countIncreases();
let end = +new Date();
console.log(`[${prettyMilliseconds(end - start)}][2021][Day 1][Part 1]: ${d1p1}`);
start = +new Date();
const d1p2 = countIncreasesPart2();
end = +new Date();
console.log(`[${prettyMilliseconds(end - start)}][2021][Day 1][Part 2]: ${d1p2}`);

// start = +new Date();
// const d2p1 = movePart1();
// end = +new Date();
// console.log(`[${prettyMilliseconds(end - start)}][2021][Day 2][Part 1]: ${d2p1}`);
// start = +new Date();
// const d2p2 = movePart2();
// end = +new Date();
// console.log(`[${prettyMilliseconds(end - start)}][2021][Day 2][Part 2]: ${d2p2}`);

// start = +new Date();
// const d3p1 = part1();
// end = +new Date();
// console.log(`[${prettyMilliseconds(end - start)}][2021][Day 3][Part 1]: ${d3p1}`);
// start = +new Date();
// const d3p2 = part2();
// end = +new Date();
// console.log(`[${prettyMilliseconds(end - start)}][2021][Day 3][Part 2]: ${d3p2}`);

// start = +new Date();
// const d4p1 = day4Part1();
// end = +new Date();
// console.log(`[${prettyMilliseconds(end - start)}][2021][Day 4][Part 1]: ${d4p1}`);
// start = +new Date();
// const d4p2 = day4Part2();
// end = +new Date();
// console.log(`[${prettyMilliseconds(end - start)}][2021][Day 4][Part 2]: ${d4p2}`);

// start = +new Date();
// const d5p1 = day5Part1();
// end = +new Date();
// console.log(`[${prettyMilliseconds(end - start)}][2021][Day 5][Part 1]: ${d5p1}`);
// start = +new Date();
// const d5p2 = day5Part2();
// end = +new Date();
// console.log(`[${prettyMilliseconds(end - start)}][2021][Day 5][Part 2]: ${d5p2}`);

// start = +new Date();
// const d6p1 = day6Part1();
// end = +new Date();
// console.log(`[${prettyMilliseconds(end - start)}][2021][Day 6][Part 1]: ${d6p1}`);
// start = +new Date();
// const d6p2 = day6Part2();
// end = +new Date();
// console.log(`[${prettyMilliseconds(end - start)}][2021][Day 6][Part 2]: ${d6p2}`);

// start = +new Date();
// const d7p1 = day7Part1();
// end = +new Date();
// console.log(`[${prettyMilliseconds(end - start)}][2021][Day 7][Part 1]: ${d7p1}`);
// start = +new Date();
// const d7p2 = day7Part2();
// end = +new Date();
// console.log(`[${prettyMilliseconds(end - start)}][2021][Day 7][Part 2]: ${d7p2}`);

// start = +new Date();
// const d8p1 = day8Part1();
// end = +new Date();
// console.log(`[${prettyMilliseconds(end - start)}][2021][Day 8][Part 1]: ${d8p1}`);
// start = +new Date();
// const d8p2 = day8Part2();
// end = +new Date();
// console.log(`[${prettyMilliseconds(end - start)}][2021][Day 8][Part 2]: ${d8p2}`);

// start = +new Date();
// const d9p1 = day9Part1();
// end = +new Date();
// console.log(`[${prettyMilliseconds(end - start)}][2021][Day 9][Part 1]: ${d9p1}`);
// start = +new Date();
// const d9p2 = day9Part2();
// end = +new Date();
// console.log(`[${prettyMilliseconds(end - start)}][2021][Day 9][Part 2]: ${d9p2}`);

// start = +new Date();
// const d10p1 = day10Part1();
// end = +new Date();
// console.log(`[${prettyMilliseconds(end - start)}][2021][Day 10][Part 1]: ${d10p1}`);
// start = +new Date();
// const d10p2 = day10Part2();
// end = +new Date();
// console.log(`[${prettyMilliseconds(end - start)}][2021][Day 10][Part 2]: ${d10p2}`);

// start = +new Date();
// const d11p1 = day11Part1();
// end = +new Date();
// console.log(`[${prettyMilliseconds(end - start)}][2021][Day 11][Part 1]: ${d11p1}`);
// start = +new Date();
// const d11p2 = day11Part2();
// end = +new Date();
// console.log(`[${prettyMilliseconds(end - start)}][2021][Day 11][Part 2]: ${d11p2}`);

// start = +new Date();
// const d12p1 = day12Part1();
// end = +new Date();
// console.log(`[${prettyMilliseconds(end - start)}][2021][Day 12][Part 1]: ${d12p1}`);
// start = +new Date();
// const d12p2 = day12Part2();
// end = +new Date();
// console.log(`[${prettyMilliseconds(end - start)}][2021][Day 12][Part 2]: ${d12p2}`);

// start = +new Date();
// const d13p1 = day13Part1();
// end = +new Date();
// console.log(`[${prettyMilliseconds(end - start)}][2021][Day 13][Part 1]: ${d13p1}`);
// start = +new Date();
// const d13p2 = day13Part2();
// end = +new Date();
// console.log(`[${prettyMilliseconds(end - start)}][2021][Day 13][Part 2]: ${d13p2}`);

// start = +new Date();
// const d14p1 = day14Part1();
// end = +new Date();
// console.log(`[${prettyMilliseconds(end - start)}][2021][Day 14][Part 1]: ${d14p1}`);
// start = +new Date();
// const d14p2 = day14Part2();
// end = +new Date();
// console.log(`[${prettyMilliseconds(end - start)}][2021][Day 14][Part 2]: ${d14p2}`);

// start = +new Date();
// const d15p1 = day15Part1();
// end = +new Date();
// console.log(`[${prettyMilliseconds(end - start)}][2021][Day 15][Part 1]: ${d15p1}`);
// start = +new Date();
// const d15p2 = day15Part2();
// end = +new Date();
// console.log(`[${prettyMilliseconds(end - start)}][2021][Day 15][Part 2]: ${d15p2}`);

start = +new Date();
const d16p1 = day16Part1();
end = +new Date();
console.log(`[${prettyMilliseconds(end - start)}][2021][Day 16][Part 1]: ${d16p1}`);
start = +new Date();
const d16p2 = day16Part2();
end = +new Date();
console.log(`[${prettyMilliseconds(end - start)}][2021][Day 16][Part 2]: ${d16p2}`);
