"use strict";

const enemies = {
  weak: [
    { name: "Slithy Tove",    type: "creature", hp: 8,  str: 2, def: 0, level: 1 },
    { name: "Mome Rath",      type: "creature", hp: 6,  str: 1, def: 0, level: 1 },
    { name: "Borogove",       type: "bird",     hp: 10, str: 2, def: 1, level: 2 },
  ],
  medium: [
    { name: "Jubjub Bird",    type: "bird",     hp: 18, str: 3, def: 1, level: 3 },
    { name: "Bandersnatch",   type: "beast",    hp: 22, str: 4, def: 2, level: 3 },
  ],
  hard: [
    { name: "The Red Knight", type: "human",    hp: 28, str: 4, def: 3, level: 4 },
  ],
  boss: { name: "The Jabberwocky", type: "dragon", hp: 40, str: 5, def: 2, level: 5 },
};
