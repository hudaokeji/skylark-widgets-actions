define([
	"skylark-langx/skylark"
],function(skylark) {
	var actions = {
		buttons : {},
		menus : {}
	};

	return skylark.attach("widgets.actions",actions);

});

