define([
	"skylark-langx/objects",
	"skylark-langx/Evented",
	"skylark-data-collection/HashMap",
	"./base",
	"./ActionManager"
], function(objects,Evented, HashMap, base, ActiionManager){

	var Action = Evented.inherit({
		"klassName" : "Action",

		"name"  : "",

		"category" : "",

		"text" : "",

		"tooltip" : "",

		"icon" : "",

		"shortcut" : "",

		"state"  : {
			get : function() {
				return  this._state || (this._state = new HashMap({
					checked : false,
					disabled : false
				}));
			}
		},

		_construct : function(options) {
			if (options) {
				objects.mixin(this,options);
			}
		},

		_init : function() {

		},

	    /**
	     * Executes the command. Additional arguments are passed to the executing function
	     *
	     * @return {$.Promise} a  promise that will be resolved when the command completes.
	     */
		execute: function(params){
			if (this._execute) {
				this._execute(params);
			}
			this.trigger("executed",{
				params :params
			});
		}

	});
	
	return base.Action = Action;
});


