var utils = require("utils");
var commons = require("role.commons");

module.exports = {
	
	idle: function(creep){
		if(creep.carry.energy > 0) {
			var buildings = creep.room.find(FIND_CONSTRUCTION_SITES);
			if(buildings.length) {
				var building = creep.pos.findClosestByPath(buildings);
				creep.memory.building = building.id;
				creep.memory.state = "building";
				return;
			}
		}
		
		utils.moveToIdleFlag(creep);
		creep.memory.state = "getEnergy";
	},
	
	buildingEnter: function(creep) {
		var buildings = creep.room.find(FIND_CONSTRUCTION_SITES);
		if(!buildings.length){
			creep.memory.state = "idle";
			return;
		}
		
		var building = creep.pos.findClosestByRange(buildings);
		creep.memory.building = building.id;
	},
	
	building: function(creep) {
		if(!creep.carry.energy) {
			creep.memory.state = "getEnergy";
			return;
		}
		
		var building = Game.getObjectById(creep.memory.building);
		switch(creep.build(building))
		{
			case ERR_NOT_IN_RANGE:
				creep.moveTo(building);
				break;
		}
	},
	
	getEnergyEnter: commons.getEnergyEnter,
	getEnergy: commons.getEnergy
};