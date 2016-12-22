var utils = require("utils");
	
module.exports = {
	getEnergyEnter: function(creep){
		var source = utils.findEnergy(creep);
		if(source)
			creep.memory.source = source.id;
		else
			creep.memory.state = "idle";
	},
	
	getEnergy: function(creep){
		if(creep.memory.state == "idle")
			return;
		
		var source = Game.getObjectById(creep.memory.source);
		if(!source) {
			creep.memory.state = "idle";
			return;
		}
		
		if(utils.isCreepFull(creep)) {
			creep.memory.state = "idle";
			return;
		}
		
		var result = utils.takeEnergy(creep, source);
		switch(result)
		{
			case OK:
				break;
			case ERR_NOT_IN_RANGE:
				creep.moveTo(source);
				break;
			case ERR_NOT_ENOUGH_RESOURCES:
				break;
			default:
				creep.say(result);
				break;
		}
	}
};