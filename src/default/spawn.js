var utils = require("utils");
var _ = require('lodash');

module.exports = {
	findAvailableName: function(baseName) {
		var i=0;
		while(true){
			var name = baseName + "_" + i;
			if(name in Game.creeps)
				i++
			else
				return name;
		}
		
	},
	
    updateRoom: function(spawn) {
        
		if(Game.time % 10 != 0)
			return;
		
		if(spawn.spawning)
			return;
		
		var roles = {
			"harvester": {
				parts: [WORK, CARRY, MOVE, CARRY, WORK, CARRY, MOVE, CARRY, WORK, CARRY, MOVE, CARRY, WORK, CARRY, MOVE, CARRY, WORK, CARRY, MOVE, CARRY, WORK, CARRY, MOVE, CARRY, WORK, CARRY, MOVE, CARRY, WORK, CARRY, MOVE, CARRY, WORK, CARRY, MOVE, CARRY, WORK, CARRY, MOVE, CARRY, WORK, CARRY, MOVE, CARRY, WORK, CARRY, MOVE, CARRY, WORK, CARRY, MOVE, CARRY]
			},
			"upgrader": {
				parts: [WORK, CARRY, MOVE, CARRY, WORK, CARRY, MOVE, CARRY, WORK, CARRY, MOVE, CARRY, WORK, CARRY, MOVE, CARRY, WORK, CARRY, MOVE, CARRY, WORK, CARRY, MOVE, CARRY, WORK, CARRY, MOVE, CARRY, WORK, CARRY, MOVE, CARRY, WORK, CARRY, MOVE, CARRY, WORK, CARRY, MOVE, CARRY, WORK, CARRY, MOVE, CARRY, WORK, CARRY, MOVE, CARRY, WORK, CARRY, MOVE, CARRY]
			},
			"builder": {
				parts: [WORK, CARRY, MOVE, CARRY, WORK, CARRY, MOVE, CARRY, WORK, CARRY, MOVE, CARRY, WORK, CARRY, MOVE, CARRY, WORK, CARRY, MOVE, CARRY, WORK, CARRY, MOVE, CARRY, WORK, CARRY, MOVE, CARRY, WORK, CARRY, MOVE, CARRY, WORK, CARRY, MOVE, CARRY, WORK, CARRY, MOVE, CARRY, WORK, CARRY, MOVE, CARRY, WORK, CARRY, MOVE, CARRY, WORK, CARRY, MOVE, CARRY]
			},
			"repair": {
				parts: [WORK, CARRY, MOVE, CARRY, WORK, CARRY, MOVE, CARRY, WORK, CARRY, MOVE, CARRY, WORK, CARRY, MOVE, CARRY, WORK, CARRY, MOVE, CARRY, WORK, CARRY, MOVE, CARRY, WORK, CARRY, MOVE, CARRY, WORK, CARRY, MOVE, CARRY, WORK, CARRY, MOVE, CARRY, WORK, CARRY, MOVE, CARRY, WORK, CARRY, MOVE, CARRY, WORK, CARRY, MOVE, CARRY, WORK, CARRY, MOVE, CARRY]
			}
		};
		
		// special case when there is no creep > we need to do a simple harvester creep
		var allCreeps = spawn.room.find(FIND_MY_CREEPS);
		if(!allCreeps.length){
			var name = this.findAvailableName("harvester");
			spawn.createCreep([WORK, CARRY, MOVE], name, {role: "harvester"});
			return;
		}
		
		var creepsCreateList = [
			"harvester",
			"upgrader",
			"builder",
			"harvester",
			"repair",
			"harvester",
			"upgrader",
			"harvester"
		];
	
		for(i=0; i<creepsCreateList.length; i++) {
			creep = creepsCreateList[i];
			
			var found = false;
			var localAllCreeps = allCreeps;
			for(j=0; j<localAllCreeps.length; j++) {
				var existingCreep = localAllCreeps[j];
				if(existingCreep.memory.role != creep)
					continue;
				
				localAllCreeps = localAllCreeps.splice(j, 1);
				found = true;
				break;
			}
			if(found)
				continue;
			var role = roles[creep];
			
			var extensions = spawn.room.find(FIND_MY_STRUCTURES, {filter: (structure) => {
				return structure.structureType == STRUCTURE_EXTENSION;
			}});
			
			var totalEnergy = spawn.energy;
			var totalEnergyCapacity = spawn.energyCapacity;
			for(ii=0; ii<extensions.length; ii++) {
				totalEnergy += extensions[ii].energy;
				totalEnergyCapacity += extensions[ii].energyCapacity;
			}
			
			for(nbParts=role.parts.length; nbParts>=3; nbParts--){
				var parts = role.parts.slice(0, nbParts);
				var price = utils.getPartsCost(parts);
				if(price > totalEnergyCapacity)
					continue;
				
				if(price <= totalEnergy){
					console.log("Creating a " + creep + ". Costs " + price);
					var name = this.findAvailableName(creep);
					spawn.createCreep(parts, name, {role: creep});
				}
				else{
					console.log("Need " + price + " to create a " + creep + ". Current: " + totalEnergy + "/" + totalEnergyCapacity);
				}
				
				return;
			}
		}
    }
};