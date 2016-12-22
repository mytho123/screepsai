var utils = require("utils");
var commons = require("role.commons");

module.exports = {
	
	idle: function(creep){
		var structures = creep.room.find(FIND_STRUCTURES, { filter: (structure) => {
			return structure.hits < structure.hitsMax;
		}});
		if(structures.length) {
			var lowestHits = structures[0];
			creep.memory.structure = structures[0].id;
			
			for(var i=1; i<structures.length; i++) {
				var structure = structures;
				if(structure.hits < lowestHits){
					lowestHits = structure.hits;
					creep.memory.structure = structure.id;
				}
			}
			
			if(creep.memory.structure){
				creep.memory.state = "repair";
				return;
			}
		}
		
		var flag = utils.findFlagInRoom(creep.room, "Idle");
		if(flag){
			creep.moveTo(flag);
		}
	},
	
	repair: function(creep) {
		if(!creep.carry.energy) {
			creep.memory.state = "getEnergy";
			return;
		}
		
		var structure = Game.getObjectById(creep.memory.structure);
		if(!structure){
			creep.memory.state = "idle";
			return;
		}
		
		var result = creep.repair(structure);
		switch(result)
		{
			case OK:
				break;
			case ERR_NOT_IN_RANGE:
				creep.moveTo(structure);
				break;
			default:
				creep.say(result);
				break;
		}
	},
	
	getEnergyEnter: commons.getEnergyEnter,
	getEnergy: commons.getEnergy
};