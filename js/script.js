var namerand = Math.floor(Math.random() * 999);
var shipname = "pilot" + namerand;

var socket = io.connect('http://localhost:8080');

// disconnect message
socket.on('disconnectmessage', function(data) {
	var player = ig.game.getEntitiesByType(EntityShip)[0];
	if (player) {
		player.messagebox.content = player.messagebox.content + "\n" + data + ' disconnected';
	}
});

// on player move
socket.on('shipmove', function(destinationx, destinationy, currentanimation, thisgamename) {
	
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

// check players
socket.on('syncship', function(playerx,playery,thisgamename) {
	var netplayers = ig.game.getEntitiesByType(EntityOthership);
	
	// check if players exist
	if (netplayers) {
		for ( var i in netplayers) {
			netplayers[i].kill();
		}
	}
	// loop through plarers and re-initiate
	for ( var i in playerlist) {
		if (shipname != playerlist[i]) {
			ig.game.spawnEntity(EntityOthership, 160, 260, {
				gamename : playerlist[i]
			});
		}
	}

});

// new player
socket.on('addship', function(playerlist, othershipname) {
	
	var player = ig.game.getEntitiesByType(EntityShip)[0];
	
	player.messagebox.content = player.messagebox.content + "\n" + othershipname + ' joined';
	for ( var i = 0; i < playerlist.length; i++) {
		if (player.gamename != playerlist[i]) {
			ig.game.spawnEntity(EntityOthership, 160, 260, { gamename : playerlist[i] });
			
		}
	}
});

//kill player
socket.on('killship', function(othershipname) {
	
	var netplayers = ig.game.getEntitiesByType(EntityOthership);
		
		if(netplayers){
			for(var i in netplayers){
				if(othershipname == netplayers[i].gamename){
					netplayers[i].kill();
				}
			}
		}

});

//netreplayer
socket.on('netreship', function(playerlist){
	var netplayers = ig.game.getEntitiesByType(EntityOthership);
	
	if(netplayers){
		for(var i in netplayers){
			netplayers[i].kill();
		}
		
		for(var i in playerlist){
			if(shipname != playerlist[i]){
				ig.game.spawnEntity(EntityOthership, 160, 260, {gamename:playerlist[i]});
			}
		}
	}
});

/* ----------- lazers ----------- */

// spawn a bullet
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
