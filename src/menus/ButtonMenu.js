define([
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