# Into the Tulgey Wood

A browser-based RPG built with vanilla JavaScript. Navigate the Tulgey Wood, defeat creatures from Lewis Carroll's bestiary, and face the Jabberwocky in the final battle.

Originally built together with [developenguin](https://github.com/developenguin).

## How to play

Open `index.html` in a browser — no build step or server required.

## Features

### Class selection
Choose one of three heroes before entering the wood:

| Class | HP | STR | DEF | MAG | Special |
|---|---|---|---|---|---|
| The Brave | 15 | 4 | 2 | 1 | **Vorpal Strike** — 2× damage, but take +2 incoming next turn |
| The Hatter | 10 | 1 | 1 | 5 | **Riddlespell** — MAG-based blast ignoring DEF, 30% chance to stun |
| The Knight | 20 | 3 | 5 | 1 | **Shield Charge** — deal damage and negate the enemy's next attack |

### Dungeon navigation
Navigate through 5 rooms of the Tulgey Wood by choosing a direction at each fork. Each path resolves randomly:

- **50%** — monster encounter
- **30%** — treasure room (potion or scroll)
- **20%** — safe passage

Room 3 adds a third path option (Deeper).

### Enemies

| Tier | Enemies |
|---|---|
| Weak (rooms 1–2) | Slithy Tove, Mome Rath, Borogove |
| Medium (rooms 3–4) | Jubjub Bird, Bandersnatch |
| Hard (room 5) | The Red Knight |
| Final boss | The Jabberwocky |

### Inventory
Start with 2 potions. Find more in treasure rooms, along with single-use scrolls:

- **Flambeaux** — 8 magic damage, ignores DEF
- **Freeze** — enemy skips their next turn
- **Healing Cake** — restore 6 HP

### Combat
Turn-based. Physical attacks are reduced by the enemy's DEF stat; magic ignores it. Enemy attacks can miss on a 0 roll.

## Tech

Plain HTML, CSS, and JavaScript — no frameworks or dependencies. Three JS files:

- `classes.js` — player class definitions
- `Bosses.js` — enemy data
- `Dragonfight.js` — game state machine (dungeon, combat, inventory, screen routing)
