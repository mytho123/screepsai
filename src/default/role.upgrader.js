var utils = require("utils");
var commons = require("role.commons");

var roleUpgrader = {

    idle: function(creep) {
		if(creep.carry.energy > 0){
			creep.memory.state = "upgrade";
			return;
		}
		
		utils.moveToIdleFlag(creep);
		
		creep.memory.state = "getEnergy";
    },
	
	upgrade: function(creep){
		var result = creep.upgradeController(creep.room.controller);
		switch(result){
			case OK:
				break;
			case ERR_NOT_IN_RANGE:
				creep.moveTo(creep.room.controller);
				break;
			case ERR_NOT_ENOUGH_RESOURCES:
				creep.memory.state = "idle";
				break;
			default:
				creep.say(result);
				break;
		}
	},
	
	getEnergyEnter: commons.getEnergyEnter,
	getEnergy: commons.getEnergy
};

module.exports = roleUpgrader;