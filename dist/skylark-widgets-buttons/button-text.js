/**
 * skylark-widgets-buttons - The skylark button widgets library
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-widgets/skylark-widgets-buttons/
 * @license MIT
 */
define(["skylark-widgets-base/mixins/text-mixin","./buttons","./button"],function(t,o,e){"use strict";var i=e.inherit({_construct:function(t){e.prototype._construct.call(this,t);var o=this.getSkin();this._elm.style.color=o.textColor,this._elm.style.display="flex",this._buildText(),this.setColor(o.buttonColor,o.buttonOverColor)},...t});return o.ButtonText=i});
//# sourceMappingURL=sourcemaps/button-text.js.map
