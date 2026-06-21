"use strict";

const gameState = {
  player: null,
  currentEnemy: null,
  roomNumber: 0,
  maxRooms: 5,
  inventory: { potions: 2, scrolls: [] },
  status: {
    playerRaging: false,
    playerBlocking: false,
    enemyStunned: false,
  },
  combatActive: false,
};

const roomNames = [
  "The Pale Glade",
  "The Whispering Mushroom Ring",
  "The Crooked Clock Tree",
  "The Pool of Tears",
  "The Vorpal Clearing",
  "The Jabberwocky's Lair",
];

const safePassageTexts = [
  "You follow a path of glowing mushrooms. Something giggles behind a tree, but nothing emerges.",
  "The trees lean in, whispering nonsense. You pass through unharmed.",
  "A Cheshire grin floats between branches, then fades. The path ahead is clear.",
  "Distant trumpets sound from nowhere, then silence. Nothing bars your way.",
  "You step over a sleeping Mome Rath. It snores contentedly. You move on.",
];

const combatIntros = {
  "Slithy Tove":    "The Slithy Tove uncurls from the shadows, eyes like wet coins.",
  "Mome Rath":      "A Mome Rath bursts from the undergrowth, squealing with fury.",
  "Borogove":       "A Borogove lands on a branch above you and shrieks.",
  "Jubjub Bird":    "The Jubjub Bird circles overhead, then dives with a piercing cry.",
  "Bandersnatch":   "The Bandersnatch lunges — fast, frumious, and very large.",
  "The Red Knight": "The Red Knight levels his lance. 'None shall pass to the Jabberwocky's lair.'",
  "The Jabberwocky":"The jaws that bite, the claws that catch — it descends from the canopy with a shriek.",
};

// ----- Screen management -----

function showScreen(id) {
  document.querySelectorAll(".screen").forEach(function(s) {
    s.classList.remove("active");
  });
  document.getElementById(id).classList.add("active");
}

// ----- Story log -----

function logText(text) {
  var cssClasses = Array.prototype.slice.call(arguments, 1);
  var container = document.getElementById("story_container");
  var div = document.createElement("div");
  cssClasses.forEach(function(c) { div.classList.add(c); });
  div.textContent = text;
  container.appendChild(div);
  container.scrollTop = container.scrollHeight;
}

function clearLog() {
  document.getElementById("story_container").innerHTML = "";
}

// ----- Class selection -----

function selectClass(key) {
  var def = classes[key];
  gameState.player = {
    name: def.name,
    class: key,
    specialName: def.specialName,
    hp: def.hp,
    maxHp: def.hp,
    str: def.str,
    def: def.def,
    mag: def.mag,
    level: def.level,
  };
  gameState.inventory = { potions: 2, scrolls: [] };
  gameState.roomNumber = 0;
  gameState.status = { playerRaging: false, playerBlocking: false, enemyStunned: false };
  enterNextRoom();
}

// ----- Dungeon navigation -----

function enterNextRoom() {
  gameState.roomNumber++;

  if (gameState.roomNumber > gameState.maxRooms) {
    var boss = Object.assign({}, enemies.boss);
    showScreen("screen-dungeon");
    document.getElementById("room-counter").style.display = "none";
    document.getElementById("room-name").textContent = roomNames[5];
    document.getElementById("dungeon-event").textContent =
      "“The jaws that bite, the claws that catch!” — A shadow blots out the canopy. The Jabberwocky descends.";
    document.getElementById("dungeon-choices").style.display = "none";
    var btn = document.getElementById("btn-dungeon-continue");
    btn.textContent = "Face the Jabberwocky";
    btn.onclick = function() { startCombat(boss); };
    btn.style.display = "inline-block";
    updateDungeonHud();
    return;
  }

  showScreen("screen-dungeon");
  document.getElementById("room-counter").style.display = "inline-block";
  document.getElementById("room-counter").textContent = "Room " + gameState.roomNumber + " of " + gameState.maxRooms;
  document.getElementById("room-name").textContent = roomNames[gameState.roomNumber - 1];
  document.getElementById("dungeon-event").textContent = "";
  document.getElementById("dungeon-choices").style.display = "flex";
  document.getElementById("btn-dungeon-continue").style.display = "none";
  document.getElementById("btn-deeper").style.display = gameState.roomNumber === 3 ? "inline-block" : "none";
  updateDungeonHud();
}

function chooseDirection() {
  document.getElementById("dungeon-choices").style.display = "none";

  var roll = Math.random();
  if (roll < 0.5) {
    resolveMonster();
  } else if (roll < 0.8) {
    resolveTreasure();
  } else {
    resolveSafe();
  }
}

function resolveMonster() {
  var tier = gameState.roomNumber <= 2 ? "weak" : gameState.roomNumber <= 4 ? "medium" : "hard";
  var pool = enemies[tier];
  var template = pool[Math.floor(Math.random() * pool.length)];
  var enemy = Object.assign({}, template);

  document.getElementById("dungeon-event").textContent =
    "You step around a gnarled tree — and nearly collide with a " + enemy.name + ".";

  var btn = document.getElementById("btn-dungeon-continue");
  btn.textContent = "Draw your weapon!";
  btn.onclick = function() { startCombat(enemy); };
  btn.style.display = "inline-block";
}

function resolveTreasure() {
  var isScroll = Math.random() < 0.5;
  var lootText;

  if (isScroll) {
    var scrollTypes = ["Flambeaux", "Freeze", "Healing Cake"];
    var scroll = scrollTypes[Math.floor(Math.random() * scrollTypes.length)];
    gameState.inventory.scrolls.push(scroll);
    lootText = "A rolled parchment rests in a hollow tree: “" + scroll + ".” You tuck it away.";
  } else {
    gameState.inventory.potions++;
    lootText = "A small bottle labelled “Drink Me” rests on a mossy stone. You add it to your pack.";
  }

  document.getElementById("dungeon-event").textContent = lootText;
  updateDungeonHud();

  var btn = document.getElementById("btn-dungeon-continue");
  btn.textContent = "Press on";
  btn.onclick = enterNextRoom;
  btn.style.display = "inline-block";
}

function resolveSafe() {
  var txt = safePassageTexts[Math.floor(Math.random() * safePassageTexts.length)];
  document.getElementById("dungeon-event").textContent = txt;

  var btn = document.getElementById("btn-dungeon-continue");
  btn.textContent = "Press on";
  btn.onclick = enterNextRoom;
  btn.style.display = "inline-block";
}

function updateDungeonHud() {
  var p = gameState.player;
  document.getElementById("hud-hp").textContent = p.hp + " / " + p.maxHp;
  document.getElementById("hud-potions").textContent = gameState.inventory.potions;

  var scrollCounts = {};
  gameState.inventory.scrolls.forEach(function(s) {
    scrollCounts[s] = (scrollCounts[s] || 0) + 1;
  });
  var scrollText = Object.keys(scrollCounts).map(function(name) {
    return name + (scrollCounts[name] > 1 ? " ×" + scrollCounts[name] : "");
  }).join(", ");
  document.getElementById("hud-scrolls").textContent = scrollText || "none";
}

// ----- Combat -----

function startCombat(enemy) {
  gameState.currentEnemy = enemy;
  gameState.status = { playerRaging: false, playerBlocking: false, enemyStunned: false };
  gameState.combatActive = true;
  clearLog();
  showScreen("screen-combat");
  updateCombatUI();
  updateActionButtons();

  var intro = combatIntros[enemy.name] || ("A " + enemy.name + " blocks your path!");
  logText(intro, "story", "message");

  document.getElementById("btn-combat-continue").style.display = "none";
}

function updateCombatUI() {
  var e = gameState.currentEnemy;
  var p = gameState.player;
  document.getElementById("c-enemy-name").textContent = e.name;
  document.getElementById("c-enemy-hp").textContent = "Health: " + e.hp;
  document.getElementById("c-enemy-str").textContent = "Strength: " + e.str;
  document.getElementById("c-enemy-def").textContent = "Defence: " + e.def;
  document.getElementById("c-enemy-level").textContent = "Level: " + e.level;
  document.getElementById("c-player-name").textContent = p.name;
  document.getElementById("c-player-hp").textContent = "Health: " + p.hp + " / " + p.maxHp;
  document.getElementById("c-player-str").textContent = "Strength: " + p.str;
  document.getElementById("c-player-def").textContent = "Defence: " + p.def;
  document.getElementById("c-player-level").textContent = "Level: " + p.level;
}

function updateActionButtons() {
  var p = gameState.player;
  document.getElementById("btn-special").textContent = classes[p.class].specialName;

  var potionBtn = document.getElementById("btn-potion");
  potionBtn.textContent = "\"Drink Me\" (" + gameState.inventory.potions + ")";
  potionBtn.disabled = gameState.inventory.potions === 0;

  var scrollContainer = document.getElementById("scroll-actions");
  scrollContainer.innerHTML = "";
  var scrollCounts = {};
  gameState.inventory.scrolls.forEach(function(s) {
    scrollCounts[s] = (scrollCounts[s] || 0) + 1;
  });
  Object.keys(scrollCounts).forEach(function(name) {
    var btn = document.createElement("button");
    btn.textContent = name + (scrollCounts[name] > 1 ? " ×" + scrollCounts[name] : "");
    btn.onclick = (function(n) { return function() { playerAction("scroll", n); }; })(name);
    scrollContainer.appendChild(btn);
  });
}

// ----- Player actions -----

function playerAction(type, scrollName) {
  if (!gameState.combatActive) return;

  var p = gameState.player;
  var e = gameState.currentEnemy;

  if (type === "potion") {
    if (gameState.inventory.potions <= 0) {
      logText("You have no potions left!", "story", "message");
      return;
    }
    if (p.hp >= p.maxHp) {
      logText("You are already at full health.", "story", "message");
      return;
    }
  }

  if (type === "attack") {
    var dmg = Math.max(1, p.str * (Math.floor(Math.random() * 2) + 1) - e.def);
    logText("You strike at the " + e.name + "!", "player_action", "message");
    dealDamageToEnemy(dmg);
  } else if (type === "special") {
    applySpecial();
  } else if (type === "potion") {
    gameState.inventory.potions--;
    var heal = Math.min(p.maxHp - p.hp, 5);
    p.hp += heal;
    logText("You drink the potion. Health restored by " + heal + ".", "story", "message");
  } else if (type === "scroll") {
    applyScroll(scrollName);
  }

  if (!checkCombatEnd()) {
    enemyTurn();
    checkCombatEnd();
  }
  updateCombatUI();
  updateActionButtons();
}

function applySpecial() {
  var p = gameState.player;
  var e = gameState.currentEnemy;

  if (p.class === "brave") {
    var dmg = p.str * 2 * (Math.floor(Math.random() * 2) + 1);
    logText("Snicker-snack! You unleash a Vorpal Strike!", "player_action", "message");
    gameState.status.playerRaging = true;
    dealDamageToEnemy(dmg);
  } else if (p.class === "hatter") {
    var dmg = p.mag * (Math.floor(Math.random() * 2) + 1);
    logText("You hurl a Riddlespell — pure nonsense-magic!", "player_action", "message");
    if (Math.random() < 0.3) {
      gameState.status.enemyStunned = true;
      logText("The " + e.name + " reels, utterly confused!", "story", "message");
    }
    dealDamageToEnemy(dmg);
  } else if (p.class === "knight") {
    var dmg = Math.max(1, p.str * (Math.floor(Math.random() * 2) + 1) - e.def);
    logText("You crash forward with your shield! Shield Charge!", "player_action", "message");
    gameState.status.playerBlocking = true;
    logText("You raise your shield, braced for the next blow.", "story", "message");
    dealDamageToEnemy(dmg);
  }
}

function applyScroll(name) {
  var p = gameState.player;
  var e = gameState.currentEnemy;
  var idx = gameState.inventory.scrolls.indexOf(name);
  if (idx === -1) return;
  gameState.inventory.scrolls.splice(idx, 1);

  if (name === "Flambeaux") {
    logText("You unroll the Flambeaux scroll — fire roars through the air!", "player_action", "message");
    dealDamageToEnemy(8);
  } else if (name === "Freeze") {
    logText("The Freeze scroll shimmers — time stands still for the " + e.name + "!", "player_action", "message");
    gameState.status.enemyStunned = true;
  } else if (name === "Healing Cake") {
    logText("You eat the Healing Cake. “Eat me!” it said, and you obliged.", "player_action", "message");
    var heal = Math.min(p.maxHp - p.hp, 6);
    p.hp += heal;
    logText("Health restored by " + heal + ".", "story", "message");
  }
}

function dealDamageToEnemy(dmg) {
  var e = gameState.currentEnemy;
  e.hp -= dmg;
  logText("The " + e.name + "'s health decreases by " + dmg + ".", "story", "message");
}

// ----- Enemy turn -----

function enemyTurn() {
  var e = gameState.currentEnemy;
  var p = gameState.player;

  if (gameState.status.enemyStunned) {
    logText("The " + e.name + " shudders, unable to act!", "dragon_action", "message");
    gameState.status.enemyStunned = false;
    return;
  }

  logText("The " + e.name + " attacks…", "dragon_action", "message");
  var hit = e.str * Math.floor(Math.random() * 3);

  if (hit === 0) {
    logText("But it missed!", "story", "message");
    return;
  }

  if (gameState.status.playerBlocking) {
    logText("Your shield absorbs the blow completely!", "story", "message");
    gameState.status.playerBlocking = false;
    return;
  }

  if (gameState.status.playerRaging) {
    hit += 2;
    gameState.status.playerRaging = false;
    logText("Your Vorpal frenzy left you exposed — the hit lands harder!", "story", "message");
  }

  p.hp -= hit;
  logText("Your health decreases by " + hit + ".", "story", "message");
}

// ----- Combat end check -----

function checkCombatEnd() {
  var e = gameState.currentEnemy;
  var p = gameState.player;

  if (e.hp <= 0) {
    gameState.combatActive = false;
    if (e.type === "dragon") {
      logText("The Jabberwocky falls, whiffling no more. You have triumphed!", "gameover", "message");
      showEndScreen(true);
    } else {
      logText("The " + e.name + " collapses with a final, absurd sound.", "gameover", "message");
      document.getElementById("btn-combat-continue").style.display = "inline-block";
    }
    return true;
  }

  if (p.hp <= 0) {
    gameState.combatActive = false;
    logText("You have been defeated. The Tulgey Wood claims another.", "gameover", "message");
    showEndScreen(false);
    return true;
  }

  return false;
}

function afterCombatContinue() {
  document.getElementById("btn-combat-continue").style.display = "none";
  enterNextRoom();
}

// ----- End screen -----

function showEndScreen(won) {
  setTimeout(function() {
    showScreen("screen-end");
    if (won) {
      document.getElementById("end-title").textContent = "Callooh! Callay!";
      document.getElementById("end-message").textContent =
        "The Jabberwocky is slain. You chortled in your joy. The Tulgey Wood grows a little lighter.";
    } else {
      document.getElementById("end-title").textContent = "O frabjous day… not.";
      document.getElementById("end-message").textContent =
        "The wood swallowed you whole. But Wonderland is patient, and the Jabberwocky will wait for another to challenge it.";
    }
  }, 1500);
}

function restartGame() {
  showScreen("screen-class");
}
