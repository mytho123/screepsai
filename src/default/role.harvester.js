var utils = require("utils");

module.exports = {
	
	idle: function(creep){
		if(creep.carry.energy == 0){
			creep.memory.state = "harvest";
			return;
		}
		
		var targets = creep.room.find(FIND_STRUCTURES, {
			filter: (structure) => {
				if((structure.structureType == STRUCTURE_EXTENSION ||
						structure.structureType == STRUCTURE_SPAWN) && structure.energy < structure.energyCapacity)
					return true;
				return false;
			}
		});
		
		if(!targets.length) {
			targets = creep.room.find(FIND_STRUCTURES, {
				filter: (structure) => {
					if(structure.structureType == STRUCTURE_TOWER && structure.energy < structure.energyCapacity)
						return true;
					if(structure.structureType == STRUCTURE_CONTAINER && _.sum(structure.store) < structure.storeCapacity)
						return true;
					return false;
				}
			});
		}
		
		if(targets.length){
			creep.memory.target = creep.pos.findClosestByRange(targets).id;
			creep.memory.state = "transfer";
			return;
		}
		
		if(!utils.isCreepFull(creep)){
			creep.memory.state = "harvest";
			return;
		}
		
		var flag = utils.findFlagInRoom(creep.room, "Idle");
		if(flag){
			creep.moveTo(flag);
		}
	},
	
	harvestEnter: function(creep){
		var sources = creep.room.find(FIND_SOURCES);
		if(!sources.length){
			creep.memory.state = "idle";
			return;
		}
		
		var i = creep.memory.sourceI;
		i++;
		if(i > sources.length)
			i = 1;
		creep.memory.sourceI = i;
		
		var source = sources[i-1];
		creep.memory.source = source.id;
	},
	
	harvest: function(creep){
		var source = Game.getObjectById(creep.memory.source);
		if(!source) {
			creep.memory.state = "idle";
			return;
		}
		
		if(creep.carryCapacity - _.sum(creep.carry) == 0) {
			creep.memory.state = "idle";
			return;
		}
		
		switch(creep.harvest(source))
		{
			case ERR_NOT_IN_RANGE:
				creep.moveTo(source);
				break;
		}
	},
	
	transfer: function(creep){
		var target = Game.getObjectById(creep.memory.target);
		if(!target || creep.carry[RESOURCE_ENERGY] == 0) {
			creep.memory.state = "idle";
			return;
		}
		
		var result = creep.transfer(target, RESOURCE_ENERGY);
		switch(result)
		{
			case OK:
				break;
			case ERR_NOT_IN_RANGE:
				creep.moveTo(target);
				break;
			case ERR_FULL:
				creep.memory.state = "idle";
				break;
			default:
				creep.say(result);
				break;
		}
	}
};