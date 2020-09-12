define([
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