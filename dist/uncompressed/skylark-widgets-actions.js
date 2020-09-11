/**
 * skylark-widgets-actions - The skylark action widgets library
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-widgets/skylark-widgets-actions/
 * @license MIT
 */
(function(factory,globals) {
  var define = globals.define,
      require = globals.require,
      isAmd = (typeof define === 'function' && define.amd),
      isCmd = (!isAmd && typeof exports !== 'undefined');

  if (!isAmd && !define) {
    var map = {};
    function absolute(relative, base) {
        if (relative[0]!==".") {
          return relative;
        }
        var stack = base.split("/"),
            parts = relative.split("/");
        stack.pop(); 
        for (var i=0; i<parts.length; i++) {
            if (parts[i] == ".")
                continue;
            if (parts[i] == "..")
                stack.pop();
            else
                stack.push(parts[i]);
        }
        return stack.join("/");
    }
    define = globals.define = function(id, deps, factory) {
        if (typeof factory == 'function') {
            map[id] = {
                factory: factory,
                deps: deps.map(function(dep){
                  return absolute(dep,id);
                }),
                resolved: false,
                exports: null
            };
            require(id);
        } else {
            map[id] = {
                factory : null,
                resolved : true,
                exports : factory
            };
        }
    };
    require = globals.require = function(id) {
        if (!map.hasOwnProperty(id)) {
            throw new Error('Module ' + id + ' has not been defined');
        }
        var module = map[id];
        if (!module.resolved) {
            var args = [];

            module.deps.forEach(function(dep){
                args.push(require(dep));
            })

            module.exports = module.factory.apply(globals, args) || null;
            module.resolved = true;
        }
        return module.exports;
    };
  }
  
  if (!define) {
     throw new Error("The module utility (ex: requirejs or skylark-utils) is not loaded!");
  }

  factory(define,require);

  if (!isAmd) {
    var skylarkjs = require("skylark-langx-ns");

    if (isCmd) {
      module.exports = skylarkjs;
    } else {
      globals.skylarkjs  = skylarkjs;
    }
  }

})(function(define,require) {

define('skylark-widgets-actions/actions',[
	"skylark-langx/skylark"
],function(skylark) {
	var actions = {
		buttons : {},
		menus : {}
	};

	return skylark.attach("widgets.actions",actions);

});


define('skylark-widgets-actions/buttons/Button',[
	"skylark-widgets-base/Widget",
	"../actions"	
],function(Widget,actions){
	"use strict";

	/**
	 * Base button class.
	 * 
	 * @class Button
	 * @extends {Widget}
	 * @param {Widget} parent Parent element.
	 */
	var Button = Widget.inherit({

		_construct : function (parent) {
			Widget.prototype._construct.call(this, parent, "div");

			this._elm.style.cursor = "pointer";

			this.preventDragEvents();
		},


		/**
		 * Set button color.
		 * 
		 * When mouse is over the button uses the overColor, when the mouse gets outside of the button it uses the base color.
		 * 
		 * @method setColor
		 * @param {String} baseColor CSS color for the button background.
		 * @param {String} overColor CSS color for the button when mouse is over it.
		 */
		setColor : function(baseColor, overColor){
			this._elm.style.backgroundColor = baseColor;

			this._elm.onmouseenter = function()	{
				this.style.backgroundColor = overColor;
			};

			this._elm.onmouseleave = function()	{
				this.style.backgroundColor = baseColor;
			};
		},

		/**
		 * Set button styles, the style can be descriped in a object.
		 *
		 * Here is an exaple of a style object:
		 * {
		 * backgroundColor: "#FF0000",
		 * color: "#FFFFFF"
		 * }
		 *
		 * @method setColor
		 * @param {Object} baseStyle Object with the style to be applied as base.
		 * @param {Object} overStyle Object with the style to be applied when mouse is over.
		 */
		setStyles : function(baseStyle, overStyle)	{
			for(var i in baseStyle)
			{
				this._elm.style[i] = baseStyle[i];
			}

			this._elm.onmouseenter = function()	{
				for(var i in overStyle)
				{
					this.style[i] = overStyle[i];
				}
			};

			this._elm.onmouseleave = function()	{
				for(var i in baseStyle)	{
					this.style[i] = baseStyle[i];
				}
			};
		}
	});

	return actions.buttons.Button = Button;
});
define('skylark-widgets-base/mixins/ImageMixin',[
	"skylark-langx-numerics/Vector2",
	"../Widget"
],function(
	Vector2,
	Widget
){
	"use strict";

	var ImageMixin = {
		_buildImage : function (parent) {
			/**
			 * Button icon.
			 * 
			 * @attribute icon
			 * @type {DOM}
			 */
			this.icon = document.createElement("img");
			this.icon.style.pointerEvents = "none";
			this.icon.style.position = "absolute";
			this.icon.style.top = "15%";
			this.icon.style.left = "15%";
			this.icon.style.width = "70%";
			this.icon.style.height = "70%";
			this._elm.appendChild(this.icon);
		},


		/**
		 * Set button drawer icon.
		 *
		 * @method setImage
		 * @param {String} image Image URL.
		 */
		setImage : function(image) {
			this.icon.src = image;
		},

		/**
		 * Set icon scale, the icon will be centered.
		 *
		 * @method setImageScale
		 */
		setImageScale : function(x, y){
			this.icon.style.top = ((1 - y) / 2 * 100) + "%";
			this.icon.style.left = ((1 - x) / 2 * 100) + "%";
			this.icon.style.width = (x * 100) + "%";
			this.icon.style.height = (y * 100) + "%";
		}

	};

	return ImageMixin;
});
define('skylark-widgets-actions/buttons/ButtonImage',[
	"skylark-widgets-base/mixins/ImageMixin",
	"../actions",
	"./Button"
],function(ImageMixin,actions,Button){
	"use strict";

	/**
	 * Button with a centered icon.
	 *
	 * @class ButtonImageToggle
	 * @extends {Button}
	 * @param {Element} parent Parent element.
	 */
	var ButtonImage = Button.inherit({

		_construct : function (parent) {
			Button.prototype._construct.call(this, parent);

			this._buildImage();
			this.setColor(null, Editor.theme.buttonOverColor);
		},

		...ImageMixin

	});

	return actions.buttons.ButtonImage = ButtonImage;
});
define('skylark-widgets-actions/buttons/ButtonDrawer',[
	"skylark-langx-numerics/Vector2",
	"skylark-widgets-base/panels/Panel",
	"../actions",
	"./ButtonImage"
],function(
	Vector2,
	Panel,
	actions,
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
			element.attachTo(this.panel);
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


	return actions.buttons.ButtonDrawer = ButtonDrawer;
});
define('skylark-widgets-actions/buttons/ButtonImageToggle',[
	"../actions",
	"./ButtonImage"
],function(actions,ButtonImage){
	"use strict";

	/**
	 * A image button that can be toggled.
	 * 
	 * @class ButtonImageToggle
	 * @extends {ButtonImage}
	 * @param {Element} parent Parent element.
	 */
	var ButtonImageToggle = ButtonImage.inherit({

		_construct : function (parent) {
			ButtonImage.prototype._construct.call(this, parent);

			this._elm.style.display = "flex";
			this._elm.style.justifyContent = "center";
			this._elm.style.alignItems = "center";
			var skin = this.getSkin();
			//this._elm.style.backgroundColor = Editor.theme.buttonColor;
			this._elm.style.backgroundColor = skin.buttonColor;

			this.selected = false;

			//Click event
			var self = this;
			this._elm.onclick = function()
			{
				self.selected = !self.selected;
			};

			//Mouse over and mouse out events
			this._elm.onmouseenter = function() {
				//self.element.style.backgroundColor = Editor.theme.buttonOverColor;
				self.element.style.backgroundColor = skin.buttonOverColor;
			};

			this._elm.onmouseleave = function() {
				if(!self.selected) {
					//self.element.style.backgroundColor = Editor.theme.buttonColor;
					self.element.style.backgroundColor = skin.buttonColor;
				}
			};
		},


		/**
		 * Set the seleted state of the toggle button.
		 * 
		 * @method setSelected
		 * @param {Boolean} selected
		 */
		setSelected : function(selected) {
			this.selected = selected;
			var skin = this.getSkin();
			//this._elm.style.backgroundColor = this.selected ? Editor.theme.buttonOverColor : Editor.theme.buttonColor;
			this._elm.style.backgroundColor = this.selected ? skin.buttonOverColor : skin.buttonColor;
		},

		/**
		 * Set button callback function.
		 *
		 * @method setOnClick
		 */
		setOnClick : function(callback) {
			var self = this;
			this._elm.onclick = function() 	{
				self.selected = !self.selected;
				callback();	
			};
		}
	});

	return actions.buttons.ButtonImageToggle = ButtonImageToggle;
});
define('skylark-widgets-actions/buttons/ButtonText',[
	"skylark-widgets-base/mixins/TextMixin",
	"../actions",
	"./Button",
],function(TextMixin,actions,Button){
	"use strict";

	/**
	 * Button with text, inherits all methods available on the Text class.
	 * 
	 * Used in menu bars, panels, etc.
	 *
	 * @class ButtonText
	 * @extends {Button, Text}
	 * @param {Widget} parent Parent widget.
	 */
	var ButtonText = Button.inherit({

		_construct : function (parent) {
			Button.prototype._construct.call(this, parent);

			var skin = this.getSkin();

			//this._elm.style.color = Editor.theme.textColor;
			this._elm.style.color = skin.textColor;
			this._elm.style.display = "flex";
			
			/*
			//Span
			this.span = document.createElement("span");
			this.span.style.overflow = "hidden";
			this._elm.appendChild(this.span);

			//Text
			this.text = document.createTextNode("");
			this.span.appendChild(this.text);


			//this.setColor(Editor.theme.buttonColor, Editor.theme.buttonOverColor);
			this.setColor(skin.buttonColor, skin.buttonOverColor);
			this.allowWordBreak(false);
			this.setVerticalAlignment(TextMixin.CENTER);
			this.setAlignment(TextMixin.CENTER);
			*/

			this._buildText();

			//this.setColor(Editor.theme.buttonColor, Editor.theme.buttonOverColor);
			this.setColor(skin.buttonColor, skin.buttonOverColor);

		},
		...TextMixin
	});
	

	return actions.buttons.ButtonText = ButtonText;
});

define('skylark-widgets-actions/menus/ButtonMenu',[
	"../actions",
	"../buttons/ButtonText"
],function(actions,ButtonText){
	"use strict";

	/**
	 * Button used in dropdown menus, context menus, etc.
	 * 
	 * The button has text and its possible to add a icon.
	 *
	 * @class ButtonMenu
	 * @extends {ButtonText}
	 * @param {Widget} parent Parent widget.
	 */
	var ButtonMenu = ButtonText.inherit({

		_construct : function (parent) {
			ButtonText.prototype._construct.call(this, parent);

			this.span.style.textIndent = "25px";

			/**
			 * Icon element.
			 *
			 * @attribute icon
			 * @type {DOM}
			 */
			this.icon = null;

			var skin = this.getSkin();

			//this.setColor(Editor.theme.buttonColor, Editor.theme.buttonOverColor);
			this.setColor(skin.buttonColor, skin.buttonOverColor);
		},


		/**
		 * Set button icon image URL.
		 *
		 * Creates the element if it still doesnt exist.
		 *
		 * @method setIcon
		 * @param {String} icon Image URL.
		 */
		setIcon : function(icon) 	{
			if(this.icon === null) 	{
				this.icon = document.createElement("img");
				this.icon.style.position = "absolute";
				this.icon.style.display = "block";
				this.icon.style.left = "5px";
				this.icon.style.top = "3px";
				this.icon.style.width = "12px";
				this.icon.style.height = "12px";
				this._elm.appendChild(this.icon);
			}
			
			this.icon.src = icon;
		}
	});
	return actions.buttons.ButtonMenu = ButtonMenu;
});
define('skylark-widgets-actions/menus/DropdownMenu',[
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
define('skylark-widgets-actions/menus/ContextMenu',[
	"skylark-langx-numerics/Vector2",
	"skylark-domx-geom",
	"skylark-widgets-base/panels/Panel",
	"../actions",
	"./ButtonMenu",
	"./DropdownMenu"
],function(
	Vector2,
	geom,

	Panel,
	actions,
	ButtonMenu,
	DropdownMenu
){
	"use strict";

	/**
	 * Context menu widget.
	 * 
	 * @class ContextMenu
	 * @extends {Panel}
	 * @param {Widget} parent Parent widget.
	 */
	var ContextMenu = Panel.inherit({

		_construct : function (parent) {	
			Panel.prototype._construct.call(this, parent, "div");

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

	ContextMenu.prototype.addOption = ContextMenu.prototype.addItem;
	ContextMenu.prototype.removeOption = ContextMenu.prototype.removeItem;
	ContextMenu.prototype.updateOption = ContextMenu.prototype.updateItems;

	return actions.menus.ContextMenu = ContextMenu;
});
define('skylark-widgets-actions/main',[
	"./actions",
	"./buttons/Button",
	"./buttons/ButtonDrawer",
	"./buttons/ButtonImage",
	"./buttons/ButtonImageToggle",
	"./buttons/ButtonText",
	"./menus/ButtonMenu",
	"./menus/ContextMenu",
	"./menus/DropdownMenu"
],function(texts){
	return actions;
});
define('skylark-widgets-actions', ['skylark-widgets-actions/main'], function (main) { return main; });


},this);
//# sourceMappingURL=sourcemaps/skylark-widgets-actions.js.map
