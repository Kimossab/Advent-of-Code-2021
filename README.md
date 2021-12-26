# Advent-of-Code-2021
My stupid solutions to the AoC of 2021

These are all my solutions for the AoC of 2021 in typescript, they are not properly optimised and all could be heavily refactored.  
The reason being it's my first solution for each puzzle and I was focused on finding the solution (even if sometimes the code is slow).

## How to run
If you want to run this (I don't know why you would, there's better solutions out there) you can follow the same way as every other TS project ever:

Note: needless to say, but I'll say it anyway, you need [Node.js](https://nodejs.org/en/)

Install packages:
```
npm i
```

To run development locally (will auto restart the program on file updates):
```
npm run dev
```

To build (this will build into javascript and then you can run the resulting js file):
```
npm run build
```

Also needless to say you can use `yarn` instead of `npm` if that's what you fancy, but you might want to delete `package-lock.json` first.

### For the record:
<details open>
  <summary>All the puzzle results</summary>
  <p>
    
```
[0ms][2021][Day 1][Part 1]: 1532
[4ms][2021][Day 1][Part 2]: 1571
[0ms][2021][Day 2][Part 1]: 1484118
[0ms][2021][Day 2][Part 2]: 1463827010
[5ms][2021][Day 3][Part 1]: 4006064
[15ms][2021][Day 3][Part 2]: 5941884
[1ms][2021][Day 4][Part 1]: 51776
[5ms][2021][Day 4][Part 2]: 16830
[116ms][2021][Day 5][Part 1]: 8622
[165ms][2021][Day 5][Part 2]: 22037
[1ms][2021][Day 6][Part 1]: 359999
[1ms][2021][Day 6][Part 2]: 1631647919273
[8ms][2021][Day 7][Part 1]: 356179
[9ms][2021][Day 7][Part 2]: 99788435
[1ms][2021][Day 8][Part 1]: 352
[50ms][2021][Day 8][Part 2]: 936117
[13ms][2021][Day 9][Part 1]: 444
[1.5s][2021][Day 9][Part 2]: 1168440
[25ms][2021][Day 10][Part 1]: 290691
[14ms][2021][Day 10][Part 2]: 2768166558
[9ms][2021][Day 11][Part 1]: 1719
[11ms][2021][Day 11][Part 2]: 232
[22ms][2021][Day 12][Part 1]: 5920
[1m 56.4s][2021][Day 12][Part 2]: 155477
[10ms][2021][Day 13][Part 1]: 693
[21ms][2021][Day 13][Part 2]: 
#..#..##..#....####.###...##..####.#..#
#..#.#..#.#.......#.#..#.#..#....#.#..#
#..#.#....#......#..#..#.#..#...#..#..#
#..#.#....#.....#...###..####..#...#..#
#..#.#..#.#....#....#.#..#..#.#....#..#
.##...##..####.####.#..#.#..#.####..##.
[4ms][2021][Day 14][Part 1]: 2068
[9ms][2021][Day 14][Part 2]: 2158894777814
[313ms][2021][Day 15][Part 1]: 508
[44.7s][2021][Day 15][Part 2]: 2872
[1ms][2021][Day 16][Part 1]: 906
[0ms][2021][Day 16][Part 2]: 819324480368
[2ms][2021][Day 17][Part 1]: 3655
[13ms][2021][Day 17][Part 2]: 1447
[34ms][2021][Day 18][Part 1]: 4417
[267ms][2021][Day 18][Part 2]: 4796
[14.3s][2021][Day 19][Part 1]: 362
[14.2s][2021][Day 19][Part 2]: 12204
[29ms][2021][Day 20][Part 1]: 5225
[513ms][2021][Day 20][Part 2]: 18131
[1ms][2021][Day 21][Part 1]: 925605
[69ms][2021][Day 21][Part 2]: 486638407378784
[44ms][2021][Day 22][Part 1]: 588120
[1.6s][2021][Day 22][Part 2]: 1134088247046731
[13.5s][2021][Day 23][Part 1]: 14348
[26.6s][2021][Day 23][Part 2]: 40954
[1m 15.2s][2021][Day 24][Part 1]: 92915979999498
[1m 41s][2021][Day 24][Part 2]: 21611513911181
[674ms][2021][Day 25][Part 1]: 374
[0ms][2021][Day 25][Part 2]: Finally it's over (there's no part 2)
```
  </p>
</details>

<details>
  <summary>My personal stats</summary>
  <p>
    
```
      --------Part 1--------   --------Part 2--------
Day       Time   Rank  Score       Time   Rank  Score
 25   20:50:31   9867      0   20:51:37   5977      0
 24       >24h   6966      0       >24h   6850      0
 23   12:54:43   7289      0   19:33:27   6242      0
 22   18:50:32  14810      0       >24h   9594      0
 21       >24h  19861      0       >24h  14200      0
 20       >24h  17510      0       >24h  17230      0
 19       >24h  12150      0       >24h  11891      0
 18   20:13:20  12510      0   20:20:48  12290      0
 17       >24h  23565      0       >24h  22475      0
 16       >24h  23903      0       >24h  22395      0
 15   14:46:04  22499      0   18:13:48  21231      0
 14   05:50:44  21198      0   12:56:48  22074      0
 13   06:37:46  19588      0   06:38:57  18370      0
 12   10:12:36  21727      0   10:24:42  19500      0
 11   09:54:12  23862      0   09:58:24  23520      0
 10   06:37:00  26017      0   07:07:58  24690      0
  9   06:19:54  27911      0   07:45:36  21074      0
  8   09:47:53  38043      0   14:39:38  30970      0
  7   05:52:58  33221      0   05:56:43  30908      0
  6   05:50:29  30531      0   06:44:33  25491      0
  5   08:36:20  30112      0   08:48:34  26859      0
  4   09:30:14  30471      0   09:40:40  27552      0
  3   04:58:12  40363      0   05:33:09  26157      0
  2   05:03:29  44019      0   05:07:17  40900      0
  1   10:21:39  58013      0   10:40:42  51173      0
```
  </p>
</details>

###### Disclaimer: I'm only writting this so the code page is not completely empty, this makes it more pleasing even if it's completely useless otherwise. ~~not like anyone is reading this anyway, but if you are have a nice day~~
