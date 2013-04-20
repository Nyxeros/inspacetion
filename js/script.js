var namerand = Math.floor(Math.random() * 999);
var shipname = "pilot" + namerand;

var socket = io.connect('http://192.168.0.20:8080');

// disconnect message
socket.on('disconnectmessage', function(data) {
	var player = ig.game.getEntitiesByType(EntityShip)[0];
	if (player) {
		player.messagebox.content = player.messagebox.content + "\n" + data + ' disconnected';
	}
});

// on player move
socket.on('shipmove', function(destinationx, destinationy, thisgamename, curanimation) {
	
	var otherplayer = ig.game.getEntitiesByType(EntityOthership);

	if (otherplayer) {
		for ( var i in otherplayer) {
			if (thisgamename == otherplayer[i].gamename) {
				otherplayer[i].destinationx = destinationx;
				otherplayer[i].destinationy = destinationy;
			}
		}
	}
});

// re-sync ship
socket.on('syncship', function(playerx, playery, thisgamename) {
	
	/* TODO syncing players up
	var netplayers = ig.game.getEntitiesByType(EntityOthership);
	
	// check if players exist
	if (netplayers) {
		for ( var i in netplayers) {
			netplayers[i].kill(); TODO?
		}
	}
	// loop through players and re-initiate
	for ( var i in playerlist) {
		if (thisgamename != playerlist[i]) {
			ig.game.spawnEntity(EntityOthership, playerx, playery, {
				gamename : playerlist[i]
			});
		}
	}
	*/

});

// new player
socket.on('addship', function(playerlist, othershipname, playerx, playery) {
	
	var ship = ig.game.getEntitiesByType(EntityShip)[0];
	
	ship.messagebox.content = ship.messagebox.content + "\n" + othershipname + ' joined';
	for ( var i = 0; i < playerlist.length; i++) {
		if (ship.gamename != playerlist[i]) {
			ig.game.spawnEntity(EntityOthership, playerx, playery, { gamename : playerlist[i] });
		}
	}
});

//kill player
socket.on('killship', function(othershipname) {
	
	var netplayers = ig.game.getEntitiesByType(EntityOthership);
		
	for(var i in netplayers){
		if(othershipname == netplayers[i].gamename){
			netplayers[i].kill();
		}
	}

});

/* ----------- lazers ----------- */

// spawn a bullet/ missle whatever..
socket.on('spawnclientbullet', function(weapontype, gamename, animangle){
	
	var netplayers = ig.game.getEntitiesByType(EntityOthership);
	
	if(netplayers){
		for(var i=0; i<netplayers.length; i++ ){
			if(netplayers[i].gamename == gamename){
				ig.game.spawnEntity(
						EnityNetlazer, 
						netplayers[i].pos.x + 30, 
						netplayers[i].pos.y + 30, 
						{bullettype:weapontype, animangle: animangle} 
						);
			}
		}
	}
	
});


/* --------- creatures -------- */
socket.on('spawncreature', function(spawnx, spawny, creaturename){
	ig.game.spawnEntity(EntityCreature, spawnx, spawny, {gamename: creaturename});
});

socket.on('resynccreature',function(){
	
});

socket.on('creaturemove', function(){
	
});
