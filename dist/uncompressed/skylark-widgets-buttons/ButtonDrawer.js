define([
	"skylark-langx-numerics/Vector2",
	"skylark-widgets-base/panels/Panel",
	"./buttons",
	"./ButtonImage"
],function(
	Vector2,
	Panel,
	buttons,
	ButtonImage
){
	"use strict";

	/**
	 * Button with text, inherits all methods available on the Text class.
	 * 
	 * Used in menu bars, panels, etc.
	 *
	 * @class ButtonDrawer
	 * @extends {ButtonImage}
	 * @param {Widget} parent Parent element.
	 */
	var ButtonDrawer = ButtonImage.inherit({

		_construct : function (parent) {
			ButtonImage.prototype._construct.call(this, parent);

			var skin = this.getSkin();

			this._elm.style.zIndex = "200";
			//this._elm.style.backgroundColor = Editor.theme.buttonColor;
			this._elm.style.backgroundColor = skin.buttonColor;
			this._elm.style.overflow = "visible";

			this.panel = new Panel(this);
			this.panel.element.style.position = "absolute";
			this.panel.element.style.overflow = "visible";
			//this.panel.element.style.backgroundColor = Editor.theme.barColor;
			this.panel.element.style.backgroundColor = skin.barColor;
			this.panel.element.style.zIndex = "250";

			/** 
			 * List of the items in this panel.
			 *
			 * @attribute items
			 * @type {Array}
			 */
			this.items = [];

			/**
			 * Number of maximum items per row
			 *
			 * @attribute itemsPerLine
			 * @type {Number}
			 */
			this.itemsPerLine = 3;
			
			/**
			 * Size of each option, also affects the size of the panel.
			 *
			 * @attribute itemsSize
			 * @type {Vector2}
			 */
			this.itemsSize = new Vector2(40, 40);

			/**
			 * Scale of the inner icon of the items created from the addItem() method.
			 *
			 * @attribute itemsScale
			 * @type {Vector2}
			 */
			this.itemsScale = new Vector2(0.7, 0.7);

			/**
			 * Indicates if the button drawer panel is visible.
			 *
			 * @attribute expanded
			 * @type {Boolean}
			 */
			this.expanded = false;
			this.setExpanded(false);

			var self = this;

			this._elm.onmouseenter = function()
			{
				//self.element.style.backgroundColor = Editor.theme.buttonOverColor;
				self.element.style.backgroundColor = skin.buttonOverColor;
				self.setExpanded(true);
			};
			this._elm.onmouseleave = function()
			{
				//self.element.style.backgroundColor = Editor.theme.buttonColor;
				self.element.style.backgroundColor = skin.buttonColor;
				self.setExpanded(false);
			};

			this.panel.element.onmouseenter = function()
			{
				self.setExpanded(true);
			};
			this.panel.element.onmouseleave = function()
			{
				self.setExpanded(false);
			};
		},


		clear : function(){
			for(var i = 0; i < this.items.length; i++)
			{
				this.items[i].destroy();
			}
			
			this.items = [];
		},

		/**
		 * Expand or close the button drawer panel.
		 *
		 * @method setExpanded
		 * @param {Boolean} expanded
		 */
		setExpanded : function(expanded){
			this.expanded = expanded;
			this.panel.element.style.display = this.expanded ? "block" : "none";
		},

		/** 
		 * Insert new option from already created element.
		 *
		 * @method insertItem
		 * @param {Widget} Widget of the option to be inserted in the drawer
		 */
		insertItem : function(element){
			element.setParent(this.panel);
			this.items.push(element);
		},


		/**
		 * Add new option to the menu.
		 * 
		 * @method addItem
		 * @param {String} image
		 * @param {Function} callback
		 * @param {String} altText
		 */
		addItem : function(image, callback, altText){
			var self = this;

			var button = new ButtonImage(this.panel);
			button.setImage(image);
			button.setOnClick(function()
			{
				callback();
				self.expanded = false;
				self.updateInterface();
			});

			if(altText !== undefined)
			{
				button.setAltText(altText);
			}

			this.items.push(button);
		},

		/**
		 * Remove an option from the menu.
		 *
		 * @method removeItem
		 * @param {Number} index
		 */
		removeItem : function(index) 	{
			if(index >= 0 && index < this.items.length)
			{
				this.items[index].destroy();
				this.items.splice(index, 1);
			}
		},

		/**
		 * Updates drawer panel size based on the number of items available.
		 * 
		 * @method updatePanelSize
		 */
		updatePanelSize : function()	{
			var itemsPerLine = (this.items.length < this.itemsPerLine) ? this.items.length : this.itemsPerLine;

			this.panel.size.x = (this.itemsSize.x * itemsPerLine);
			this.panel.size.y = (this.itemsSize.y * (Math.floor((this.items.length - 1) / itemsPerLine) + 1));
			this.panel.updateSize();

			this.panel.position.set(this.itemsSize.x, 0);
			this.panel.updatePosition();
		},

		/**
		 * Update drawer items position and size.
		 *
		 * Should be called after change in items displacement variables).
		 *
		 * @method updateItems
		 */
		updateItems : function()	{
			this.updatePanelSize();

			var itemsPerLine = (this.items.length < this.itemsPerLine) ? this.items.length : this.itemsPerLine;

			for(var i = 0; i < this.items.length; i++)
			{
				this.items[i].size.set(this.itemsSize.x, this.itemsSize.y);
				this.items[i].position.x = this.itemsSize.x * (i % itemsPerLine);
				this.items[i].position.y = this.itemsSize.y * Math.floor(i / itemsPerLine);
				this.items[i].updateInterface();
			}
		},

		updateVisibility : function()	{
			this._elm.style.display = this.visible ? "block" : "none";
		},


		optionsSize : {
			get : function() {
				return this.itemsSize;
			},

			set : function(v) {
				this.itemsSize = v
			}
		},

		optionsPerLine : {
			get : function() {
				return this.itemsPerLine;
			},

			set : function(v) {
				this.itemsPerLine = v
			}
		}
	});

	
	ButtonDrawer.prototype.addOption = ButtonDrawer.prototype.addItem;
	ButtonDrawer.prototype.insertOption = ButtonDrawer.prototype.insertItem;
	ButtonDrawer.prototype.updateOptions = ButtonDrawer.prototype.updateItems;
	ButtonDrawer.prototype.removeOption = ButtonDrawer.prototype.reomveItem;


	return buttons.ButtonDrawer = ButtonDrawer;
});