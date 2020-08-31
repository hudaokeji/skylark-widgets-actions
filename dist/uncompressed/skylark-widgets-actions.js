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
	"skylark-widgets-base/Widget",
	"./ButtonImage"
],function(
	Vector2,
	Element,
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


			this._elm.style.zIndex = "200";
			this._elm.style.backgroundColor = Editor.theme.buttonColor;
			this._elm.style.overflow = "visible";

			this.panel = new Widget(this, "div");
			this.panel.element.style.overflow = "visible";
			this.panel.element.style.backgroundColor = Editor.theme.barColor;
			this.panel.element.style.zIndex = "250";

			/** 
			 * List of the options in this panel.
			 *
			 * @attribute options
			 * @type {Array}
			 */
			this.options = [];

			/**
			 * Number of maximum options per row
			 *
			 * @attribute optionsPerLine
			 * @type {Number}
			 */
			this.optionsPerLine = 3;
			
			/**
			 * Size of each option, also affects the size of the panel.
			 *
			 * @attribute optionsSize
			 * @type {Vector2}
			 */
			this.optionsSize = new Vector2(40, 40);

			/**
			 * Scale of the inner icon of the options created from the addOption() method.
			 *
			 * @attribute optionsScale
			 * @type {Vector2}
			 */
			this.optionsScale = new Vector2(0.7, 0.7);

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
				self.element.style.backgroundColor = Editor.theme.buttonOverColor;
				self.setExpanded(true);
			};
			this._elm.onmouseleave = function()
			{
				self.element.style.backgroundColor = Editor.theme.buttonColor;
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
			for(var i = 0; i < this.options.length; i++)
			{
				this.options[i].destroy();
			}
			
			this.options = [];
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
		 * @method insertOption
		 * @param {Widget} Widget of the option to be inserted in the drawer
		 */
		insertOption : function(element){
			element.attachTo(this.panel);
			this.options.push(element);
		},


		/**
		 * Add new option to the menu.
		 * 
		 * @method addOption
		 * @param {String} image
		 * @param {Function} callback
		 * @param {String} altText
		 */
		addOption : function(image, callback, altText){
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

			this.options.push(button);
		},

		/**
		 * Remove an option from the menu.
		 *
		 * @method removeOption
		 * @param {Number} index
		 */
		removeOption : function(index) 	{
			if(index >= 0 && index < this.options.length)
			{
				this.options[index].destroy();
				this.options.splice(index, 1);
			}
		},

		/**
		 * Updates drawer panel size based on the number of options available.
		 * 
		 * @method updatePanelSize
		 */
		_updatePanelSize : function()	{
			var optionsPerLine = (this.options.length < this.optionsPerLine) ? this.options.length : this.optionsPerLine;

			this.panel.size.x = (this.optionsSize.x * optionsPerLine);
			this.panel.size.y = (this.optionsSize.y * (Math.floor((this.options.length - 1) / optionsPerLine) + 1));
			this.panel.updateSize();

			this.panel.position.set(this.optionsSize.x, 0);
			this.panel.updatePosition();
		},

		/**
		 * Update drawer options position and size.
		 *
		 * Should be called after change in options displacement variables).
		 *
		 * @method updateOptions
		 */
		_updateOptions : function()	{
			this.updatePanelSize();

			var optionsPerLine = (this.options.length < this.optionsPerLine) ? this.options.length : this.optionsPerLine;

			for(var i = 0; i < this.options.length; i++)
			{
				this.options[i].size.set(this.optionsSize.x, this.optionsSize.y);
				this.options[i].position.x = this.optionsSize.x * (i % optionsPerLine);
				this.options[i].position.y = this.optionsSize.y * Math.floor(i / optionsPerLine);
				this.options[i].updateInterface();
			}
		},

		_updateVisibility : function()	{
			this._elm.style.display = this.visible ? "block" : "none";
		}
	});


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
define('skylark-widgets-base/mixins/TextMixin',[
	"skylark-langx-numerics/Vector2",
	"../Widget"
],function(
	Vector2,
	Widget
){
	"use strict";

	/**
	 * Text element without background.
	 * 
	 * @class Text
	 * @extends {Widget}
	 * @param {Widget} parent Parent widget.
	 */

	var TextMixin = {
		_buildText : function() {
			var skin = this.getSkin();

			this._elm.style.pointerEvents = "none";
			//this._elm.style.color = Editor.theme.textColor;
			this._elm.style.color = skin.textColor;
			this._elm.style.display = "flex";

			/** 
			 * Span DOM element used to represent the text.
			 *
			 * @attribute span
			 * @type {DOM}
		 	 */
			this.span = document.createElement("span");
			this.span.style.overflow = "hidden";
			this._elm.appendChild(this.span);

			//Text
			this.text = document.createTextNode("");
			this.span.appendChild(this.text);

			/**
			 * If set to true the text container will automatically fit the text size.
			 *
			 * @attribute fitContent
			 * @type {Boolean}
			 */
			this.fitContent = false;

			this.allowWordBreak(false);
			this.setVerticalAlignment(TextMixin.CENTER);
			this.setAlignment(TextMixin.CENTER);		
		},

		/**
		 * Set font to use for the text.
		 * 
		 * @method setFont
		 * @param {String} fontFamily Font family.
		 * @param {Number} fontWeight Font weigth, sets how thick or thin characters in text should be displayed.
		 * @param {String} fontStyle Font style, specifies the font style for a text.
		 */
		setFont : function(fontFamily, fontWeight, fontStyle) {
			this.span.style.fontFamily = fontFamily;

			if(fontWeight !== undefined) {
				this.span.style.fontWeight = fontWeight;
			}

			if(fontStyle !== undefined) {
				this.span.style.fontStyle = fontStyle;
			}
		},

		/**
		 * Enable of disable word breaking.
		 *
		 * @method allowWordBreak
		 * @param {Boolean} line If true words can be breaked.
		 */
		allowWordBreak : function(value) {
			if(value === true) {
				this.span.style.whiteSpace = "normal";
				this.span.style.wordBreak = "break-word";
			} else 	{
				this.span.style.whiteSpace = "pre";
				this.span.style.wordBreak = "normal";
			}
		},

		/**
		 * Set text.
		 *
		 * @method setText
		 * @param {String} text Text. 
		 */
		setText : function(text){
			this.text.data = text;
		},

		/**
		 * Set text border.
		 *
		 * @method setTextBorder
		 * @param {Number} size Border size in pixels.
		 * @param {String} color CSS Color. 
		 */
		setTextBorder : function(size, color) {
			this.span.style.textShadow = "-" + size + "px 0 " + color + ", 0 " + size + "px " + color + ", " + size + "px 0 " + color + ", 0 -" + size + "px " + color;
		},

		/**
		 * Set Text size, in pixels.
		 * 
		 * @method setTextSize
		 * @param {Number} size Size in pixel for this text element.
		 */
		setTextSize : function(size) {
			this._elm.style.fontSize = size + "px";
		},

		/**
		 * Set text color.
		 * 
		 * @method setTextColor
		 * @param {String} color Color code.
		 */
		setTextColor : function(color) {
			this.span.style.color = color;
		},

		/**
		 * Set text overflow handling
		 *
		 * @method setOverflow
		 * @param {Number} overflow
		 */
		setOverflow : function(overflow) {
			if(overflow === TextMixin.ELLIPSIS) {
				this.span.style.whiteSpace = "nowrap";
				this.span.style.textOverflow = "ellipsis";
			} else 	{
				this.span.style.whiteSpace = "pre";
				this.span.style.textOverflow = "clip";
			}
		},

		/**
		 * Set text horizontal alignment.
		 *  - TextMixin.CENTER
		 *  - TextMixin.LEFT
		 *  - TextMixin.RIGHT
		 * 
		 * @method setAlignment
		 * @param {Number} align Alingment mode.
		 */
		setAlignment : function(align) 	{
			if(align === TextMixin.CENTER) {
				this._elm.style.justifyContent = "center";
				this._elm.style.textAlign = "center";
			} else if(align === TextMixin.LEFT) {
				this._elm.style.justifyContent = "flex-start";
				this._elm.style.textAlign = "left";
			} else if(align === TextMixin.RIGHT) {
				this._elm.style.justifyContent = "flex-end";
				this._elm.style.textAlign = "right";
			}
		},

		/**
		 * Set text vertical alignment.
		 *  - TextMixin.CENTER
		 *  - TextMixin.TOP
		 *  - TextMixin.BOTTOM
		 * 
		 * @method setVerticalAlignment
		 * @param {Number} align Alingment mode.
		 */
		setVerticalAlignment : function(align) {
			if(align === TextMixin.CENTER) {
				this._elm.style.alignItems = "center";
			} else if(align === TextMixin.TOP) {
		 		this._elm.style.alignItems = "flex-start";
			} else if(align === TextMixin.BOTTOM) {
				this._elm.style.alignItems = "flex-end";
			}
		},

		/**
		 * Get size of the text inside of this component in px.
		 * 
		 * @method measure
		 * @return {Vector2} A vector with the size of the text. 
		 */
		measure : function() 	{
		 	return new Vector2(this.span.offsetWidth, this.span.offsetHeight);
		},

		/**
		 * Set text internal margin in pixels.
		 * 
		 * @method setMargin
		 * @param {Number} margin Margin size in pixels.
		 */
		setMargin : function(margin) {
			this.span.style.margin = margin + "px";
		},

		updateSize : function() {
			if(this.fitContent) { 
				this.size.x = this.span.clientWidth;
				this.size.y = this.span.clientHeight;
			}
			
			Widget.prototype.updateSize.call(this);
		},

		CENTER : 0,
		LEFT : 1,
	    RIGHT : 2,
	    TOP : 3,
	    BOTTOM : 4,

	    CLIP : 10,
	    ELLIPSIS : 11

	};


	return TextMixin;
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

			/*
			//this._elm.style.color = Editor.theme.textColor;
			this._elm.style.color = skin.textColor;
			this._elm.style.display = "flex";
			
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

			this._buildTextSpan();

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
	"skylark-widgets-base/mixins/TextMixin",

	"./ButtonMenu"
],function(
	Vector2,
	geom,
	
	Widget,
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

		_construct : function (parent) {
			Widget.prototype._construct.call(this, parent, "div");

			this._buildTextSpan();


			this._elm.style.backgroundColor = Editor.theme.buttonColor;
			this._elm.style.cursor = "pointer";
			this._elm.style.pointerEvents = "auto";

			this.preventDragEvents();

			/**
			 * Panel element, where the options are stored.
			 *
			 * This DOM element is added directly to the parent DOM element.
			 *
			 * @attribute panel
			 * @type {DOM}
			 */
			this.panel = new Widget(parent, "div");
			this.panel._elm.style.overflow = "visible";
			this.panel._elm.style.display = "none";
			this.panel._elm.style.zIndex = "300";

			/**
			 * Option icon image, the element is only created when a icon is set.
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
			this.optionsSize = new Vector2(150, 20);

			/**
			 * Options available in the dropdown.
			 *
			 * Options are stored as: {button:button, value:object, name:string}
			 *
			 * @attribute options
			 * @type {Array}
			 */
			this.options = [];

			var self = this;

			this._elm.onmouseenter = function()
			{
				self.setExpanded(true);
				self._elm.style.backgroundColor = Editor.theme.buttonOverColor;
			};

			this._elm.onmouseleave = function()
			{
				self.setExpanded(false);
				self._elm.style.backgroundColor = Editor.theme.buttonColor;
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
		 * Set location to where options should open.
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
		 * Remove option from menu.
		 *
		 * @method removeOption
		 * @param {Number} index
		 */
		removeOption : function(index) {
			if(index >= 0 && index < this.options.length) {
				this.options[index].destroy();
				this.options.splice(index, 1);
			}
		},

		/**
		 * Add new option to menu
		 *
		 * @method addOption
		 * @param {String} name of the option
		 * @param {Function} callback Callback function
		 * @param {String} icon Icon URL.
		 * @return {ButtonMenu} Button created for the new option.
		 */
		addOption : function(name, callback, icon) {
			var button = new ButtonMenu(this.panel);
			button._elm.style.zIndex = "200";
			button.setText(name);
			button.setAlignment(Text.LEFT);
			button.position.set(25, 0);

			var self = this;
			button.setOnClick(function(){
				callback();
				self.setExpanded(false);
			});

			if(icon !== undefined) 	{
				button.setIcon(icon);
			}

			this.options.push(button);

			return button;
		},

		/**
		 * Add new menu to menu.
		 *
		 * @method addOption
		 * @param {String} name Name of the option.
		 * @param {String} icon Optional icon, image URL.
		 * @return {DropdownMenu} The new menu created.
		 */
		addMenu : function(name, icon) {
			var menu = new DropdownMenu(this.panel);
			menu.setText(name);
			menu.setDirection(DropdownMenu.LEFT);
			menu.showArrow();
			menu.setAlignment(Text.LEFT);
			menu.setMargin(25);
			
			if(icon !== undefined)
			{
				menu.setIcon(icon);
			}

			this.options.push(menu);

			return menu;
		},

		/** 
		 * Update expanded state, position all options in this dropdown.
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
					var out = geom.testAsis(this.panel);

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
					var out = geom.testAsis(this.panel);
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
					var out = geom.testAsis(this.panel);
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
					var out = geom.testAsis(this.panel);
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
		 * Update all options in the menu.
		 * 
		 * @method updateOptions
		 */
		updateOptions : function() {
			for(var i = 0; i < this.options.length; i++) {
				this.options[i].size.set(this.optionsSize.x, this.optionsSize.y);
				this.options[i].position.set(0, this.optionsSize.y * i);
				this.options[i].updateInterface();
			}

			this.panel._elm.style.width = this.size.x + "px";
			this.panel._elm.style.height = (this.optionsSize.y * this.options.length) + "px";
		},

		destroy : function() {
			Widget.prototype.destroy.call(this);

			this.parent.destroy();
		},

		updateSize : function() {
//			Text.prototype.updateSize.call(this);

			this.updateOptions();
		},


		...TextMixin

	});


	DropdownMenu.DOWN = 0;
	DropdownMenu.UP = 1;
	DropdownMenu.LEFT = 2;
	DropdownMenu.RIGHT = 3;



	return DropdownMenu;
});
define('skylark-widgets-actions/menus/ContextMenu',[
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
