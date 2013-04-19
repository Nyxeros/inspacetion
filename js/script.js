var namerand = Math.floor(Math.random() * 999);
var playername = "pilot" + namerand;

var socket = io.connect('http://localhost:8080');

// disconnect message
socket.on('disconnectmessage', function(data) {
	var player = ig.game.getEntitiesByType(EntityShip)[0];
	if (player) {
		player.messagebox.content = player.messagebox.content + "\n" + data + ' disconnected';
	}
});

// on player move
socket.on('playermove', function(positionx, positiony, currentanimation,thisgamename) {
	var otherplayer = ig.game.getEntitiesByType(EntityOthership);

	if (otherplayer) {
		for ( var i in otherplayer) {
			if (thisgamename == otherplayer[i].gamename) {
				otherplayer[i].pos.x = positionx;
				otherplayer[i].pos.y = positiony;

				otherplayer[i].animation = currentanimation;
			}
		}
	}
});

// check players
socket.on('netreplayer', function(playerlist) {
	var netplayers = ig.game.getEntitiesByType(EntityOthership);
	
	// check if players exist
	if (netplayers) {
		for ( var i in netplayers) {
			netplayers[i].kill();
		}
	}

	for ( var i in playerlist) {
		if (playername != playerlist[i]) {
			ig.game.spawnEntity(EntityOthership, 160, 260, {
				gamename : playerlist[i]
			});
		}
	}

});

// new player
socket.on('addplayer', function(playerlist, otherplayername) {
	
	var player = ig.game.getEntitiesByType(EntityShip)[0];
	
	player.messagebox.content = player.messagebox.content + "\n" + otherplayername + ' joined';
	for ( var i = 0; i < playerlist.length; i++) {
		if (player.gamename != playerlist[i]) {
			ig.game.spawnEntity(EntityOthership, 160, 260, { gamename : playerlist[i] });
			
		}
	}

});