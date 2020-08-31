define([
	"skylark-langx-numbers/Vector2",
	"skylark-domx-geom",
	"skylark-widgets-base/Widget",
	"../actions",
	"./ButtonMenu",
	"./DropdownMenu"
],function(
	Vector2,
	geom,

	Widget,
	actions,
	ButtonMenu,
	DropdownMenu
){
	"use strict";

	/**
	 * Context menu widget.
	 * 
	 * @class ContextMenu
	 * @extends {Widget}
	 * @param {Widget} parent Parent widget.
	 */
	var ContextMenu = Widget.inherit({

		_construct : function (parent) {	
			Widget.prototype._construct.call(this, parent, "div");

			var self = this;

			this._elm.style.overflow = "visible";
			this._elm.style.zIndex = "300";
			this._elm.onmouseleave = function()	{
				self.destroy();
			};

			this.offset = new Vector2(20, 10);
			
			/**
			 * Options in this menu.
			 * 
			 * @attribute options
			 * @type {Array}
			 */
			this.options = [];
		},


		/**
		 * Set the text of this context menu.
		 * 
		 * @method setText
		 * @param {String} text
		 */
		setText : function(text) {
			this.text.setText(text);
		},

		/**
		 * Remove option from context menu.
		 *
		 * @method removeOption
		 * @param {Number} index
		 */
		removeOption : function(index) {
			if(index >= 0 && index < this.options.length)	{
				this.options[index].destroy();
				this.options.splice(index, 1);
			}
		},

		/**
		 * Add new option to context menu
		 *
		 * @method addOption
		 * @param {String} name of the option
		 * @param {Function} callback Callback function
		 */
		addOption : function(name, callback) {
			var button = new ButtonMenu(this);
			button._elm.style.zIndex = "10000";
			button.setText(name);
			button.setAlignment(Text.LEFT);
			button.position.x = 25;

			var self = this;
			button.setOnClick(function(){
				callback();
				self.destroy();
			});

			this.options.push(button);
		},

		/**
		 * Add new menu to context menu
		 *
		 * @method addOption
		 * @param {String} name of the option.
		 * @return {DropdownMenu} The new menu created.
		 */
		addMenu : function(name) {
			var menu = new DropdownMenu(this);
			menu.setText(name);
			menu.setDirection(DropdownMenu.LEFT);
			menu.showArrow();
			menu.setAlignment(Text.LEFT);
			menu.setMargin(25);

			this.options.push(menu);

			return menu;
		},

		/**
		 * Update all options in the menu.
		 * 
		 * @method updateOptions
		 */
		updateOptions : function() {
			for(var i = 0; i < this.options.length; i++)
			{
				this.options[i].size.copy(this.size);
				this.options[i].position.set(0, this.size.y * i);
				this.options[i].updateInterface();
			}
		},

		updateSize : function()	{
			this._elm.style.width = this.size.x + "px";
			this._elm.style.height = (this.size.y * this.options.length) + "px";

			this.updateOptions();
		},

		updatePosition : function() {
			this._elm.style.top = (this.position.y - this.offset.y) + "px";
			this._elm.style.left = (this.position.x - this.offset.x) + "px";

			//Check if its inside window
			
			//var out = DOMUtils.checkBorder(this._elm);
			var out = geom.testAxis(this._elm);
			if(out.x !== 0)
			{
				this._elm.style.left = (this.position.x + this.offset.x - this.size.x) + "px"; 
			}
			if(out.y !== 0)
			{
				this._elm.style.top = (this.position.y - this.offset.y - out.y) + "px";
			}

		}
	});

	return actions.menus.ContextMenu = ContextMenu;
});