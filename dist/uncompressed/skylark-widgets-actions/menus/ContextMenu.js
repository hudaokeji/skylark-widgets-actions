define([
	"skylark-langx-numerics/Vector2",
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
			 * Items in this menu.
			 * 
			 * @attribute items
			 * @type {Array}
			 */
			this.items = [];
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
		 * Remove item from context menu.
		 *
		 * @method removeItem
		 * @param {Number} index
		 */
		removeItem : function(index) {
			if(index >= 0 && index < this.items.length)	{
				this.items[index].destroy();
				this.items.splice(index, 1);
			}
		},

		/**
		 * Add new item to context menu
		 *
		 * @method addItem
		 * @param {String} name of the item
		 * @param {Function} callback Callback function
		 */
		addItem : function(name, callback) {
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

			this.items.push(button);
		},

		/**
		 * Add new menu to context menu
		 *
		 * @method addItem
		 * @param {String} name of the item.
		 * @return {DropdownMenu} The new menu created.
		 */
		addMenu : function(name) {
			var menu = new DropdownMenu(this);
			menu.setText(name);
			menu.setDirection(DropdownMenu.LEFT);
			menu.showArrow();
			menu.setAlignment(Text.LEFT);
			menu.setMargin(25);

			this.items.push(menu);

			return menu;
		},

		/**
		 * Update all items in the menu.
		 * 
		 * @method updateItems
		 */
		updateItems : function() {
			for(var i = 0; i < this.items.length; i++)
			{
				this.items[i].size.copy(this.size);
				this.items[i].position.set(0, this.size.y * i);
				this.items[i].updateInterface();
			}
		},

		updateSize : function()	{
			this._elm.style.width = this.size.x + "px";
			this._elm.style.height = (this.size.y * this.items.length) + "px";

			this.updateItems();
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