define([
	"skylark-langx/Evented",
	"./actions"
], function(Evented,actions){

	var ActionManager = Evented.inherit({
		"klassName"		:	"Manager",


		addAction : function(category,name,fn,options) {

		},

		executeAction : function() {

		},

		removeAction : function(category,name) {

		}

	});

	return actions.ActionManager = ActionManager;

});

