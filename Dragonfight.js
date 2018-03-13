//Javascript code for the game
var player = {name:"Scrooge McDuck", hp: 10, strength: 2, level: 1};
var dragon =bosses[0];

var begin = function(){
	document.getElementById("d_name").innerHTML = dragon.name
	document.getElementById("d_health").innerHTML = "Health: " + dragon.hp
	document.getElementById("d_strength").innerHTML = "Strength: " + dragon.strength
	document.getElementById("d_level").innerHTML = "Level: " + dragon.level

	document.getElementById("p_name").innerHTML = player.name
	document.getElementById("p_health").innerHTML = "Health: " + player.hp
	document.getElementById("p_strength").innerHTML = "Strength: " + player.strength
	document.getElementById("p_level").innerHTML = "Level: " + player.level 
	text("You're walking in the forest. Suddenly a giant dragon flies over you and lands on your path! You have a sword, bow or staff at your disposal. What do you take?", ["story"]);
}

var text = function(textElement, classList){
	var begin_text = document.createElement('div');
	var div = document.getElementById("story_container")
	classList.forEach(function(klass){
		begin_text.classList.add(klass);
	});
	// begin_text.className = divclass;
	var begin_text_content = document.createTextNode(textElement);
	begin_text.appendChild(begin_text_content);
	div.appendChild(begin_text);
}

var sword = function(){
	text("You draw the sword and thrust the sword into the dragon's belly", ["player_action","message"]);
	var damage = player.strength * 4;
	text("The dragon's life has decreased by " + damage, ["story", "message"]);
	dragon.hp = dragon.hp - damage;
	dragonHealthUpdate();
	dragonAttack();
}

var staff = function(){
	text("You pick up the staff and wave with it", ["player_action", "message"]);
	var damage = player.strength * 2;
	text("The dragon's life has decreased by " + damage, ["story", "message"]);
	dragon.hp = dragon.hp - damage;
	dragonHealthUpdate();
	dragonAttack();
}

var bow = function(){
	text("You grab the bow and fly an arrow towards the dragon", ["player_action", "message"]);
	var damage = player.strength * 3;
	text("The dragon's life has decreased by " + damage, ["story", "message"]);
	dragon.hp = dragon.hp - damage;
	dragonHealthUpdate();
	dragonAttack();
}

var dragonAttack = function(){
	//zou op een nettere plek moeten, nieuwe functie aanmaken?
	if (dragon.hp <= 0){
		text("You won the battle", ["gameover", "message"]);
		alert("Game over, the game will restart");
		window.location.reload();
	};
	text("The dragon attacks...", ["dragon_action", "message"]);
	var hit = dragon.strength * Math.floor(Math.random() * 3 + 0);
		if (hit === 0){
			text("But the dragon missed its target!", ["story", "message"]);
		};
	text("Your health decreases by " + hit, ["story", "message"]);
	player.hp = player.hp - hit;
		if (player.hp <= 0){
			text("You lost the battle", ["gameover", "message"]);
			alert("Game over, the game will restart");
			window.location.reload()
		}
	playerHealthUpdate();
}

var potion = function(){
	if (player.hp < 10)
	{ 
		text("You take a potion", ["story", "message"]);
		var heal = Math.min(10 - player.hp, 3);
		player.hp = player.hp + heal;
		text("Your health has been increased by " + heal, ["story", "message"]);
		playerHealthUpdate();
	}
	else {
		window.alert("You don't need a potion");
	}
};

var playerHealthUpdate = function(){
	//conditional (ternary) operator (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Conditional_Operator)
	// conditie hieronder uitgebreid, maar is eigenlijk niet nodig als je eerder een check in potion zet.
	var htmlStr = (player.hp > 0 && player.hp<=10) ?  "Health: " + player.hp : "Health: 0"
	document.getElementById("p_health").innerHTML = htmlStr;
};

var dragonHealthUpdate = function(){
	document.getElementById("d_health").innerHTML = "Health: " + dragon.hp
};