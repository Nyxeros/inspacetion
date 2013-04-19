var app = require('http').createServer(handler), 
	io = require('socket.io').listen(app), 
	fs = require('fs')

app.listen(8080);

// players
var playerlocation = 0,
	playerlist = [],
	creaturecount = 0,
	creaturelist = [];

clientids = [];


/**
 * handler
 * @param req
 * @param res
 * @returns void
 */
function handler(req, res) {
	fs.readFile(__dirname + '/index.html', function(err, data) {
		if (err) {
			res.writeHead(500);
			return res.end('Error loading index.html');
		}
		res.writeHead(200);
		res.end(data);
	});
}


/**
 * creature1
 * @returns void
 */
function creature1(){
	this.health = 10;
	this.target = "";
	this.velx = 0;
	this.vely = 0;
	this.positionx = 500;
	this.positiony = 0;
	this.name = "";
}

// socket connection
io.sockets.on('connection', function(socket) {
	
	// move a player
	socket.on('moveship', function(destinationx, destinationy, gamename) {
		io.sockets.emit('shipmove', destinationx, destinationy, gamename);
	});
	
	// resyncplayer
	socket.on('resyncship', function(playerx, playery, gamename) {
		io.sockets.emit('syncship', playerx, playery, gamename);
	});
	
	// playerattacking
	socket.on('shipattacking', function(direction, xadd, yadd,attackangle, gamename) {
		io.sockets.emit('shipattacked', direction, xadd, yadd, attackangle, gamename);
	});
	
	// initializeplayer
	socket.on('initializeship', function(newplayername, playerx, playery) {
		socket.clientname = newplayername;
		playerlist.push(newplayername);
		clientids.push(socket.id);
		
		io.sockets.emit('addship', playerlist, newplayername, playerx, playery);
	});
	
	// disconnect
	socket.on('disconnect', function() {
		io.sockets.emit('killship', socket.clientname);
		delete playerlist[socket.clientname];
		delete clientids[socket.id];
		
		for(var i in playerlist){
			if(playerlist[i] == socket.clientname){
				playerlist.splice(i, 1);
			}
		}
		
		for(var i in clientids){
			if(clientids[i] == socket.id){
				clientids.splice(i,1);
			}
		}
		socket.emit('message', socket.clientname);
	});
	
	// spawn a bullet
	socket.on('spawnbullet', function(weapontype, gamename, angle){
		io.sockets.emit('spawnclientbullet', weapontype, gamename, angle);
	});
	
	// sync creatures
	socket.on('syncreatures', function(creatures){
		
	});
	
});