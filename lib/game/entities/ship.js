ig.module(
	'game.entities.ship'
)
.requires(
	'impact.entity'
)
.defines(function(){

	EntityShip = ig.Entity.extend({
		
		// ship properties
		size : {
			x : 32,
			y : 48
		},
		direction : 1,
		type : ig.Entity.TYPE.A,
		nettimer : 10,
		name : "ship",
		gamename : playername,
		checkAgainst : ig.Entity.TYPE.NONE,
		collides : ig.Entity.COLLIDES.PASSIVE,
		speed : 100,
		
		// ship messagebox
		messagebox: {
			content : "",
			timer : 50
		},
		
		animSheet: new ig.AnimationSheet( 'media/fighter1.png', 75, 75),
	
		init: function( x, y, settings ) {
			this.parent( x, y, settings );
			this.health = 100;
			
			this.addAnim('up', 0.1, [1]);
			this.addAnim('left', 0.1, [3]);
			this.addAnim('right', 0.1, [0]);
			this.addAnim('down', 0.1, [2]);
			this.addAnim('idleup', 0.1, [1]);
			this.addAnim('idleleft', 0.1, [3]);
			this.addAnim('idleright', 0.1, [0]);
			this.addAnim('idledown', 0.1, [2]);
			  
			// initialize the player
			socket.emit('initializeplayer', this.gamename);
		},
	
		update : function() {
	
			// move left or right
			if (ig.input.state('left') && ismove != 1 && ismove != 2
					&& ismove != 4) {
				this.vel.x = -this.speed;
				ismove = 3;
				this.direction = 3;
			} else if (ig.input.state('right') && ismove != 1
					&& ismove != 3 && ismove != 4) {
				this.vel.x = +this.speed;
				ismove = 2;
				this.direction = 2;
			} else if (ig.input.state('up') && ismove != 3
					&& ismove != 2 && ismove != 4) {
				this.vel.y = -this.speed;;
				ismove = 1;
				this.direction = 1;
			} else if (ig.input.state('down') && ismove != 1
					&& ismove != 2 && ismove != 3) {
				this.vel.y = +this.speed;;
				ismove = 4;
				this.direction = 4;
			} else {
				this.vel.x = 0;
				this.vel.y = 0;
				ismove = 0;
			}
	
			/////////////////////////////////////////////////
	
			///////////////////////animate/////////////
			if (this.vel.y < 0) {
				this.currentAnim = this.anims.up;
				currentanimation = 1;
			} else if (this.vel.y > 0) {
				this.currentAnim = this.anims.down;
				currentanimation = 2;
			} else if (this.vel.x > 0) {
				this.currentAnim = this.anims.right;
				currentanimation = 4;
			} else if (this.vel.x < 0) {
				this.currentAnim = this.anims.left;
				currentanimation = 3;
			} else {
	
				if (this.direction == 4) {
					this.currentAnim = this.anims.idledown;
					currentanimation = 6;
				}
				if (this.direction == 3) {
					this.currentAnim = this.anims.idleleft;
					currentanimation = 7;
				}
				if (this.direction == 2) {
					this.currentAnim = this.anims.idleright;
					currentanimation = 8;
				}
				if (this.direction == 1) {
					this.currentAnim = this.anims.idleup;
					currentanimation = 5;
				}
			}
	
			////////////////////////////////
	
			if (this.nettimer < 1) {
				this.nettimer = 5;
				socket.emit('recievedata', this.pos.x, this.pos.y, currentanimation, this.gamename);
			}
			this.nettimer = this.nettimer - 1;
	
			this.parent();
		}
	});
	
	/**
	 * OtherPlayer Entities
	 */
	EntityOthership = ig.Entity.extend({
		size : {
			x : 75,
			y : 75
		},

		type : ig.Entity.TYPE.B,
		speed : 100,
		name : "othership",
		gamename : "",
		animation : 1,
		//checkAgainst: ig.Entity.TYPE.B,
		collides : ig.Entity.COLLIDES.PASSIVE,

		animSheet : new ig.AnimationSheet('media/fighter1.png', 75, 75),

		init : function(x, y, settings) {
			this.parent(x, y, settings);
			this.health = 100;

			this.addAnim('up', 0.1, [1]);
			this.addAnim('left', 0.1, [3]);
			this.addAnim('right', 0.1, [0]);
			this.addAnim('down', 0.1, [2]);
			this.addAnim('idleup', 0.1, [1]);
			this.addAnim('idleleft', 0.1, [3]);
			this.addAnim('idleright', 0.1, [0]);
			this.addAnim('idledown', 0.1, [2]);
		},

		netmoveplayer : function() {
			this.pos.x = positionx;
			this.pos.y = positiony;

		},

		update : function() {
			switch (this.animation) {
			case 1:
				this.currentAnim = this.anims.up;
				break;
			case 2:
				this.currentAnim = this.anims.down;
				break;
			case 3:
				this.currentAnim = this.anims.left;
				break;
			case 4:
				this.currentAnim = this.anims.right;
				break;
			case 5:
				this.currentAnim = this.anims.idleup;
				break;
			case 6:
				this.currentAnim = this.anims.idledown;
				break;
			case 7:
				this.currentAnim = this.anims.idleleft;
				break;
			case 8:
				this.currentAnim = this.anims.idleright;
				break;
			}
		}

	});

});