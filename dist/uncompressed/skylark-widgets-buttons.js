/**
 * skylark-widgets-buttons - The skylark button widgets library
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-widgets/skylark-widgets-buttons/
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

define('skylark-widgets-buttons/buttons',[
	"skylark-langx/skylark"
],function(skylark) {


	return skylark.attach("widgets.buttons",{});

});


define('skylark-widgets-buttons/Button',[
	"skylark-widgets-base/Widget",
	"./buttons"	
],function(Widget,buttons){
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

	return buttons.Button = Button;
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
define('skylark-widgets-buttons/ButtonImage',[
	"skylark-widgets-base/mixins/ImageMixin",
	"./buttons",
	"./Button"
],function(ImageMixin,buttons,Button){
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

	return buttons.ButtonImage = ButtonImage;
});
define('skylark-widgets-buttons/ButtonDrawer',[
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


	return buttons.ButtonDrawer = ButtonDrawer;
});
define('skylark-widgets-buttons/ButtonImageToggle',[
	"./buttons",
	"./ButtonImage"
],function(buttons,ButtonImage){
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

	return buttons.ButtonImageToggle = ButtonImageToggle;
});
define('skylark-widgets-buttons/ButtonText',[
	"skylark-widgets-base/mixins/TextMixin",
	"./buttons",
	"./Button",
],function(TextMixin,buttons,Button){
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
	

	return buttons.ButtonText = ButtonText;
});

define('skylark-widgets-buttons/main',[
	"./buttons",
	"./Button",
	"./ButtonDrawer",
	"./ButtonImage",
	"./ButtonImageToggle",
	"./ButtonText"
],function(buttons){
	return buttons;
});
define('skylark-widgets-buttons', ['skylark-widgets-buttons/main'], function (main) { return main; });


},this);
//# sourceMappingURL=sourcemaps/skylark-widgets-buttons.js.map
