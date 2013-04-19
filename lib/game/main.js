ig.module( 
	'game.main' 
)
.requires(
	'impact.game',
	'impact.font',
	'game.levels.1',
	'game.entities.ship'
)
.defines(function(){

Inspacetion = ig.Game.extend({
	
	// Load a font
	font: new ig.Font( 'media/corbel.font.png' ),
	
	init: function() {
		ig.input.bind(ig.KEY.A, 'left');
		ig.input.bind(ig.KEY.D, 'right');
		ig.input.bind(ig.KEY.W, 'up');
		ig.input.bind(ig.KEY.S, 'down');
		
		// load level 1
		this.loadLevel(Level1);
	},
	
	update: function() {
		// Update all entities and backgroundMaps
		this.parent();
		
		var ship = this.getEntitiesByType(EntityShip)[0];
		if(ship){
			this.screen.x = ship.pos.x - ig.system.width/2;
			this.screen.y = ship.pos.y - ig.system.height/2;
		}
	},
	
	draw: function() {
		this.parent();
		
		//---- ship functionality -----//
		var ship = this.getEntitiesByType(EntityShip)[0];
		
		// message box
		ship.messagebox.timer--;
		if(ship.messagebox.timer < 1){
			ship.messagebox.timer = 50;
			var newText = "";
			var splitText = ship.messagebox.content.split("\n");
			var len = splitText.length;
			for(i=0; i<len; i++){ 
				if(i > 1){
					newText = newText + "\n" + splitText[i];
				}
			}
			ship.messagebox.content = newText;
		}
		this.font.draw(ship.messagebox.content, 800, 10);
	}
});

// start it all up
ig.main( '#canvas', Inspacetion, 60, 1270, 700, 1 );

});
