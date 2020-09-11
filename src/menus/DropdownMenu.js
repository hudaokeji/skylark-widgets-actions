define([
	"skylark-langx-numerics/Vector2",
	"skylark-domx-geom",

	"skylark-widgets-base/Widget",
	"skylark-widgets-base/panels/Panel",
	"skylark-widgets-base/mixins/TextMixin",

	"./ButtonMenu"
],function(
	Vector2,
	geom,

	Widget,
	Panel,
	TextMixin,

	ButtonMenu
){
	"use strict";

	/**
	 * Dropdown menu element, used to create dropdowns in menu bars and in context menus.
	 * 
	 * @class DropdownMenu
	 * @extends {Text}
	 * @param {Widget} parent Parent widget. 
	 */


	var DropdownMenu = Widget.inherit({
		...TextMixin,

		_construct : function (parent) {
			Widget.prototype._construct.call(this, parent, "div");

			var skin = this.getSkin();

			this._elm.style.backgroundColor = Editor.theme.buttonColor;
			this._elm.style.cursor = "pointer";
			this._elm.style.pointerEvents = "auto";

			this._buildText();

			this.preventDragEvents();

			/**
			 * Panel element, where the items are stored.
			 *
			 * This DOM element is added directly to the parent DOM element.
			 *
			 * @attribute panel
			 * @type {DOM}
			 */
			this.panel = new Panel(parent, "div");
			this.panel._elm.style.overflow = "visible";
			this.panel._elm.style.display = "none";
			this.panel._elm.style.zIndex = "300";

			/**
			 * Item icon image, the element is only created when a icon is set.
			 *
			 * @attribute icon
			 * @type {DOM}
			 */
			this.icon = null;

			/**
			 * Decorative arrow.
			 *
			 * @attribute arrow
			 * @type {DOM}
			 */
			this.arrow = document.createElement("img");
			this.arrow.style.display = "none";
			this.arrow.style.position = "absolute";
			this.arrow.style.right = "5px";
			this.arrow.style.top = "3px";
			this.arrow.style.width = "12px";
			this.arrow.style.height = "12px";
			//this.arrow.src = Global.FILE_PATH + "icons/misc/arrow_right.png";
			this.arrow.src = skin.arrowRightImageUrl;
			this._elm.appendChild(this.arrow);	

			/**
			 * Direction to open the dropdown.
			 *
			 * @attribute direction
			 * @type {Number}
			 */
			this.direction = DropdownMenu.DOWN;
			
			/**
			 * Indicates if the dropdown menu is expanded.
			 *
			 * @attribute expanded
			 * @type {Boolean}
			 */
			this.expanded = false;
			this.itemsSize = new Vector2(150, 20);

			/**
			 * Items available in the dropdown.
			 *
			 * Items are stored as: {button:button, value:object, name:string}
			 *
			 * @attribute items
			 * @type {Array}
			 */
			this.items = [];

			var self = this;

			this._elm.onmouseenter = function()
			{
				self.setExpanded(true);
				//self._elm.style.backgroundColor = Editor.theme.buttonOverColor;
				self._elm.style.backgroundColor = skin.buttonOverColor;
			};

			this._elm.onmouseleave = function()
			{
				self.setExpanded(false);
				//self._elm.style.backgroundColor = Editor.theme.buttonColor;
				self._elm.style.backgroundColor = skin.buttonColor;
			};
			
			this.panel._elm.onmouseenter = function()
			{
				self.setExpanded(true);
			};

			this.panel._elm.onmouseleave = function()
			{
				self.setExpanded(false);
			};

		},

		/**
		 * Set location to where items should open.
		 *
		 * @method setDirection
		 */
		setDirection : function(location) {
			this.direction = location;
		},

		/**
		 * Show arrow.
		 *
		 * @method showArrow
		 */
		showArrow : function() {
			this.arrow.style.display = "block";
		},

		/**
		 * Set icon.
		 *
		 * @method setIcon
		 * @param {String} icon Image URL.
		 */
		setIcon : function(icon) {
			if(this.icon === null) {
				this.icon = document.createElement("img");
				this.icon.style.display = "block";
				this.icon.style.position = "absolute";
				this.icon.style.left = "5px";
				this.icon.style.top = "3px";
				this.icon.style.width = "12px";
				this.icon.style.height = "12px";
				this._elm.appendChild(this.icon);
			}

			this.icon.src = icon;
		},

		/**
		 * Remove item from menu.
		 *
		 * @method removeItem
		 * @param {Number} index
		 */
		removeItem : function(index) {
			if(index >= 0 && index < this.items.length) {
				this.items[index].destroy();
				this.items.splice(index, 1);
			}
		},

		/**
		 * Add new item to menu
		 *
		 * @method addItem
		 * @param {String} name of the item
		 * @param {Function} callback Callback function
		 * @param {String} icon Icon URL.
		 * @return {ButtonMenu} Button created for the new item.
		 */
		addItem : function(name, callback, icon) {
			var button = new ButtonMenu(this.panel);
			button._elm.style.zIndex = "200";
			button.setText(name);
			button.setAlignment(TextMixin.LEFT);
			button.position.set(25, 0);

			var self = this;
			button.setOnClick(function(){
				callback();
				self.setExpanded(false);
			});

			if(icon !== undefined) 	{
				button.setIcon(icon);
			}

			this.items.push(button);

			return button;
		},

		/**
		 * Add new menu to menu.
		 *
		 * @method addItem
		 * @param {String} name Name of the item.
		 * @param {String} icon Optional icon, image URL.
		 * @return {DropdownMenu} The new menu created.
		 */
		addMenu : function(name, icon) {
			var menu = new DropdownMenu(this.panel);
			menu.setText(name);
			menu.setDirection(DropdownMenu.LEFT);
			menu.showArrow();
			menu.setAlignment(TextMixin.LEFT);
			menu.setMargin(25);
			
			if(icon !== undefined)
			{
				menu.setIcon(icon);
			}

			this.items.push(menu);

			return menu;
		},

		/** 
		 * Update expanded state, position all items in this dropdown.
		 * 
		 * @method setExpanded
		 * @param {Boolean} expanded If true the menu will be expanded.
		 */
		setExpanded : function(expanded){
			this.expanded = expanded;

			if(this.expanded) {
				this.panel._elm.style.display = "block";

				if(this.direction === DropdownMenu.DOWN){
					this.panel._elm.style.top = (this.position.y + this.size.y) + "px";
					this.panel._elm.style.left = this.position.x + "px";

					//var out = DOMUtils.checkBorder(this.panel);
					var out = geom.testAxis(this.panel);

					if(out.y !== 0)	{
						this.panel._elm.style.top = null;
						this.panel._elm.style.bottom = (this.position.y + this.size.y) + "px";
					}
					if(out.x !== 0)	{
						this.panel._elm.style.left = (this.position.x - out.x) + "px"; 
					}
				} else if(this.direction === DropdownMenu.UP){
					this.panel._elm.style.bottom = (this.position.y + this.size.y) + "px";
					this.panel._elm.style.left = this.position.x + "px";

					//var out = DOMUtils.checkBorder(this.panel);
					var out = geom.testAxis(this.panel);
					if(out.y !== 0)
					{
						this.panel._elm.style.bottom = null;
						this.panel._elm.style.top = (this.position.y + this.size.y) + "px";
					}
					if(out.x !== 0)
					{
						this.panel._elm.style.left = (this.position.x - out.x) + "px"; 
					}
				}
				else if(this.direction === DropdownMenu.LEFT)
				{
					this.panel._elm.style.top = this.position.y + "px";
					this.panel._elm.style.left = (this.position.x + this.size.x) + "px";

					//var out = DOMUtils.checkBorder(this.panel);
					var out = geom.testAxis(this.panel);
					if(out.x !== 0)
					{
						this.panel._elm.style.left = (this.position.x - this.size.x) + "px"; 
					}
					if(out.y !== 0)
					{
						this.panel._elm.style.top = (this.position.y - out.y) + "px";
					}
				}
				else if(this.direction === DropdownMenu.RIGHT)
				{
					this.panel._elm.style.top = this.position.y + "px";
					this.panel._elm.style.left = (this.position.x - this.size.x) + "px";

					//var out = DOMUtils.checkBorder(this.panel);
					var out = geom.testAxis(this.panel);
					if(out.x !== 0)
					{
						this.panel._elm.style.left = (this.position.x + this.size.x) + "px";
					}
					if(out.y !== 0)
					{
						this.panel._elm.style.top = (this.position.y - out.y) + "px";
					}
				}
			}else{
				this.panel._elm.style.display = "none";
			}
		},

		/**
		 * Update all items in the menu.
		 * 
		 * @method updateItems
		 */
		updateItems : function() {
			for(var i = 0; i < this.items.length; i++) {
				this.items[i].size.set(this.itemsSize.x, this.itemsSize.y);
				this.items[i].position.set(0, this.itemsSize.y * i);
				this.items[i].updateInterface();
			}

			this.panel._elm.style.width = this.size.x + "px";
			this.panel._elm.style.height = (this.itemsSize.y * this.items.length) + "px";
		},

		destroy : function() {
			Widget.prototype.destroy.call(this);

			this.parent.destroy();
		},

		updateSize : function() {
			TextMixin.updateSize.call(this);

			this.updateItems();
		}


	});


	DropdownMenu.DOWN = 0;
	DropdownMenu.UP = 1;
	DropdownMenu.LEFT = 2;
	DropdownMenu.RIGHT = 3;


	DropdownMenu.prototype.addOption = DropdownMenu.prototype.addItem;
	DropdownMenu.prototype.updateOptions = DropdownMenu.prototype.updateItems;


	return DropdownMenu;
});