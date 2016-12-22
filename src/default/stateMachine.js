module.exports = {
    run: function(){
		
        for(var name in Game.creeps){
            
			var creep = Game.creeps[name];
			var role = creep.memory.role;
            
			var previousState = creep.memory.previousState;
			var state = creep.memory.state || "idle";
			creep.memory.previousState = state;
			
			var script = require("role." + role);
			if(!script){
				console.log(creep.name + ": could not find script role." + role);
				continue;
			}
			
            if(previousState != state)
            {
				var exitMethod = script[previousState + "Exit"];
				if(exitMethod){
					exitMethod(creep);
				}
				var enterMethod = script[state + "Enter"];
				if(enterMethod){
					enterMethod(creep);
				}
                creep.say(">" + state);
            }
			
			var method = script[state];
			if(!method){
				console.log(creep.name + ":method " + state + " not found on role " + role + ". --> idling");
				creep.memory.state = "idle";
				continue;
			}
            method(creep);
        }
    }
};