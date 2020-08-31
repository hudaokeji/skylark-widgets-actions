define([
	"skylark-langx/Evented",
	"./base"
], function(Evented,base){

	var ActionManager = Evented.inherit({
		"klassName"		:	"Manager",


		addAction : function(category,name,fn,options) {

		},

		executeAction : function() {

		},

		removeAction : function(category,name) {

		}

	});

	return base.ActionManager = ActionManager;

});

