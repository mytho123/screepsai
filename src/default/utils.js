var _ = require('lodash');

module.exports = {
    findFlagInRoom: function(room, flagName) {
        var flags = room.find(FIND_FLAGS, {
            filter: (flag) => {
                return flag.name == flagName;
            }
        });
        
        if(flags.length > 0){
            return flags[0];
        }
    },
	
	moveToIdleFlag: function(creep) {
		var flag = this.findFlagInRoom(creep.room, "Idle");
		if(flag){
			creep.moveTo(flag);
		}
	},
	
	isCreepFull: function(creep){
		return creep.carryCapacity - _.sum(creep.carry) == 0;
	},
	
	getPartCost: function(part){
		switch(part){
			case MOVE:
				return 50;
			case WORK:
				return 100;
			case CARRY:
				return 50;
			case ATTACK:
				return 80;
			case RANGED_ATTACK:
				return 150;
			case HEAL:
				return 250;
			case CLAIM:
				return 600;
			case TOUGH:
				return 10;
		};
		console.log("getPartCost doesn't know part " + part);
		return 0;
	},
	
	getPartsCost: function(parts){
		var totalCost = 0;
		for(var i=0; i<parts.length; i++){
			totalCost += this.getPartCost(parts[i]);
		}
		return totalCost;
	},
	
	findEnergy: function(creep){
		var sources = creep.room.find(FIND_STRUCTURES, { filter: (structure) => {
			return structure.structureType == STRUCTURE_CONTAINER
				|| structure.structureType == STRUCTURE_STORAGE;
		}});
		
		if(sources.length){
			sources = _.filter(sources, function(x) {
				return x.store[RESOURCE_ENERGY] > 0;
			});
			if(!sources.length) {
				return;
			}
		}
		else {
			sources = creep.room.find(FIND_SOURCES);
		}
		
		var closest = creep.pos.findClosestByPath(sources);
		if(closest)
			return closest;
		return creep.pos.findClosestByRange(sources);
	},
	
	takeEnergy: function(creep, target){
		if(target.structureType) {
			return creep.withdraw(target, RESOURCE_ENERGY);
		}
		else {
			return creep.harvest(target);
		}
	},
	
	findClosest: function(creep, target) {
		
	}
};
