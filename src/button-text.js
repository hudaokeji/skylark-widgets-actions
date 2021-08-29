define([
	"skylark-widgets-base/mixins/text-mixin",
	"./buttons",
	"./button",
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
