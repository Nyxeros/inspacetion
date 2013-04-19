ig.module('game.entities.ship')

.requires('impact.entity')

.defines(function() {
			
			/**
			 * EntityShip
			 *  - main player ship
			 */
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
						gamename : shipname,
						checkAgainst : ig.Entity.TYPE.NONE,
						collides : ig.Entity.COLLIDES.PASSIVE,
						movementspeed : 100,
						destinationx : 9999999,
						destinationy : 9999999,

						// ship messagebox
						messagebox : {
							content : "",
							timer : 50
						},

						animSheet : new ig.AnimationSheet('media/fighter1.png', 75, 75),

						init : function(x, y, settings) {
							this.parent(x, y, settings);
							this.health = 100;

							this.addAnim('up', 0.1, [ 1 ]);
							this.addAnim('left', 0.1, [ 3 ]);
							this.addAnim('right', 0.1, [ 0 ]);
							this.addAnim('down', 0.1, [ 2 ]);
							this.addAnim('idleup', 0.1, [ 1 ]);
							this.addAnim('idleleft', 0.1, [ 3 ]);
							this.addAnim('idleright', 0.1, [ 0 ]);
							this.addAnim('idledown', 0.1, [ 2 ]);

							// initialize the player
							socket.emit('initializeship', this.gamename, this.pos.x, this.pos.y);
						},

						update : function() {

							var mx = ig.input.mouse.x + ig.game.screen.x;
							var my = ig.input.mouse.y + ig.game.screen.y;
							var mouseangle = Math.atan2(
								   my - (this.pos.y + this.size.y / 2),
								   mx - (this.pos.x + this.size.x / 2));
							this.mouseangle = mouseangle;

							// ////// mouse click //////
							if (ig.input.pressed('move') && !ig.input.state('lazer')) {
								
								this.nettimer = this.nettimer - 1;
								this.destinationx = ig.input.mouse.x + ig.game.screen.x;
								this.destinationy = ig.input.mouse.y + ig.game.screen.y;
								
								socket.emit('moveship',
										this.destinationx,
										this.destinationy,
										this.gamename);
							}
							
							
							// ////// mouse input //////
							if (this.destinationx < 9999999 && this.destinationy < 9999999) {
								
								this.distancetotargetx = this.destinationx - this.pos.x - 75;
								this.distancetotargety = this.destinationy - this.pos.y - 75;

								if (Math.abs(this.distancetotargetx) > 1 || Math.abs(this.distancetotargety) > 1) {

									if (Math.abs(this.distancetotargetx) > Math.abs(this.distancetotargety)) {

										if (this.distancetotargetx > 1) {
											this.vel.x = this.movementspeed;
											this.xydivision = this.distancetotargety / this.distancetotargetx;
											this.vel.y = this.xydivision * this.movementspeed;
											this.currentAnim = this.anims.right;
											this.formerpressed = 'right';

										} else {
											this.vel.x = -this.movementspeed;
											this.xydivision = this.distancetotargety / Math.abs(this.distancetotargetx);
											this.vel.y = this.xydivision * this.movementspeed;
											this.currentAnim = this.anims.left;
											this.formerpressed = 'left';
										}
										
									} else {
										if (this.distancetotargety > 1) {
											this.vel.y = this.movementspeed;
											this.xydivision = this.distancetotargetx / this.distancetotargety;
											this.vel.x = this.xydivision * this.movementspeed;
											this.currentAnim = this.anims.down;
											this.formerpressed = 'down';
										} else {
											this.vel.y = -this.movementspeed;
											this.xydivision = this.distancetotargetx / Math.abs(this.distancetotargety);
											this.vel.x = this.xydivision * this.movementspeed;
											this.currentAnim = this.anims.up;
											this.formerpressed = 'up';
										}
									}
									
								} else {
									this.vel.y = 0;
									this.vel.x = 0;

									this.destinationx = 99999999;
									this.destinationy = 99999999;

									if (this.formerpressed == 'left') {
										this.currentAnim = this.anims.idleleft;
									} else if (this.formerpressed == 'right') {
										this.currentAnim = this.anims.idleright;
									} else if (this.formerpressed == 'up') {
										this.currentAnim = this.anims.idleup;
									} else if (this.formerpressed == 'down') {
										this.currentAnim = this.anims.idledown;
									}
								}
								
							}

							//////// attack /////////
							if(ig.input.pressed('lazer') && ig.input.state('lazer')){
								socket.emit('spawnbullet', 1, this.gamename, this.mouseangle);
								ig.game.spawnEntity(
											EntityLazer, 
											this.pos.x + 30, 
											this.pos.y + 30, 
											{flip:this.flip, bullettype:1 }
											);
							}
							
							// resync
							if (this.nettimer < 1) {
								socket.emit('resyncship', this.pos.x, this.pos.y, this.gamename);
								this.nettimer = 10;
							}

							this.parent();
						}
					});

			/**
			 * OtherPlayer Ship Entities
			 */
			EntityOthership = ig.Entity.extend({
				size : {
					x : 75,
					y : 75
				},
				type : ig.Entity.TYPE.B,
				movementspeed : 100,
				name : "othership",
				gamename : "",
				animation : 1,
				destinationx : 9999999,
				destinationy : 9999999,
				// checkAgainst: ig.Entity.TYPE.B,
				collides : ig.Entity.COLLIDES.PASSIVE,
				direction : 0,
				animSheet : new ig.AnimationSheet('media/fighter1.png', 75, 75),

				init : function(x, y, settings) {
					this.parent(x, y, settings);
					this.health = 100;

					this.addAnim('up', 0.1, [ 1 ]);
					this.addAnim('left', 0.1, [ 3 ]);
					this.addAnim('right', 0.1, [ 0 ]);
					this.addAnim('down', 0.1, [ 2 ]);
					this.addAnim('idleup', 0.1, [ 1 ]);
					this.addAnim('idleleft', 0.1, [ 3 ]);
					this.addAnim('idleright', 0.1, [ 0 ]);
					this.addAnim('idledown', 0.1, [ 2 ]);
				},

				netmoveplayer : function() {
					this.pos.x = positionx;
					this.pos.y = positiony;

				},

				update : function() {
				
					if (this.destinationx < 9999999 && this.destinationy < 9999999) {
						
						this.distancetotargetx = this.destinationx - this.pos.x - 75;
						this.distancetotargety = this.destinationy - this.pos.y - 75;

						if (Math.abs(this.distancetotargetx) > 1 || Math.abs(this.distancetotargety) > 1) {

							if (Math.abs(this.distancetotargetx) > Math.abs(this.distancetotargety)) {

								if (this.distancetotargetx > 1) {
									this.vel.x = this.movementspeed;
									this.xydivision = this.distancetotargety / this.distancetotargetx;
									this.vel.y = this.xydivision * this.movementspeed;
									this.currentAnim = this.anims.right;
									this.formerpressed = 'right';

								} else {
									this.vel.x = -this.movementspeed;
									this.xydivision = this.distancetotargety / Math.abs(this.distancetotargetx);
									this.vel.y = this.xydivision * this.movementspeed;
									this.currentAnim = this.anims.left;
									this.formerpressed = 'left';
								}
								
							} else {
								if (this.distancetotargety > 1) {
									this.vel.y = this.movementspeed;
									this.xydivision = this.distancetotargetx / this.distancetotargety;
									this.vel.x = this.xydivision * this.movementspeed;
									this.currentAnim = this.anims.down;
									this.formerpressed = 'down';
								} else {
									this.vel.y = -this.movementspeed;
									this.xydivision = this.distancetotargetx / Math.abs(this.distancetotargety);
									this.vel.x = this.xydivision * this.movementspeed;
									this.currentAnim = this.anims.up;
									this.formerpressed = 'up';
								}
							}
							
						} else {
							this.vel.y = 0;
							this.vel.x = 0;

							this.destinationx = 99999999;
							this.destinationy = 99999999;

							if (this.formerpressed == 'left') {
								this.currentAnim = this.anims.idleleft;
							} else if (this.formerpressed == 'right') {
								this.currentAnim = this.anims.idleright;
							} else if (this.formerpressed == 'up') {
								this.currentAnim = this.anims.idleup;
							} else if (this.formerpressed == 'down') {
								this.currentAnim = this.anims.idledown;
							}
						}
						
					}
					
				} /// end update

		}); // end OtherShip entity (other player clones)
			
		/**
		 * Ship bullet entity
		 */
		EntityLazer = ig.Entity.extend({
			size   : { x : 10, y : 10 },
			offset : {x : 20, y : 20},
			maxVel : {x : 600, y : 600},
			bullettype : 1,
			type : ig.Entity.TYPE.A,
			collides : ig.Entity.COLLIDES.NONE,
			animSheet : new ig.AnimationSheet('media/planet1-sm.png', 15, 5),
			
			init : function(){
				this.parent(x, y, settings);
				this.addAnim('idle', .04, [0,1]);
				
				var mx = ig.input.mouse.x + ig.game.screen.x;
				var my = ig.input.mouse.y + ig.game.screen.y;
				var angle = Math.atan2(
					   my - (this.pos.y + this.size.y / 2),
					   mx - (this.pos.x + this.size.x / 2)
					   );
				
				this.vel.x = Math.cos(angle) * 600;
				
			}, // end init
			
			handleMovementTrace : function(res){
				this.parent(res);
				
				if(res.collision.x || res.collision.y){
					this.kill();
				}
				
			} // end handle movement
			
		});
		
		/**
		 * EntityNetlazer
		 * - net lazer for clones from other net entities
		 */
		EntityNetlazer = ig.Entity.extend({
			size   : { x : 10, y : 10 },
			offset : {x : 20, y : 20},
			maxVel : {x : 600, y : 600},
			
			bullettype : 1,
			type : ig.Entity.TYPE.A,
			checkagainst : ig.Entity.TYPE.B,
			collides : ig.Entity.COLLIDES.NONE,
			animangle : 0,
			animSheet : new ig.AnimationSheet('media/planet1-sm.png', 15, 5),
			
			init : function(){
				this.parent(x, y, settings);
				this.addAnim('idle', .04, [0,1]);
								
				this.vel.x = Math.cos(this.animangle) * 600;
				this.vel.y = Math.sin(this.animangle) * 600;
				
			}, // end init
			
			handleMovementTrace : function(res){
				this.parent(res);
				
				if(res.collision.x || res.collision.y){
					this.kill();
				}
				
			} // end handle movement
			
		});
	
});