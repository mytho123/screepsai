var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var spawn = require('spawn');
var stateMachine = require('stateMachine');

module.exports.loop = function () {
	
	for(var name in Game.rooms){
		var room = Game.rooms[name];
		var spawns = room.find(FIND_MY_SPAWNS);
		if(!spawns.length)
			continue;
		spawn.updateRoom(spawns[0]);
	}
    
	stateMachine.run();
}