define([
	"skylark-widgets-base/mixins/image-mixin",
	"./buttons",
	"./button"
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