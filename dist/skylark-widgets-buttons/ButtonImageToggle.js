/**
 * skylark-widgets-buttons - The skylark button widgets library
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-widgets/skylark-widgets-buttons/
 * @license MIT
 */
define(["./buttons","./ButtonImage"],function(t,e){"use strict";var o=e.inherit({_construct:function(t){e.prototype._construct.call(this,t),this._elm.style.display="flex",this._elm.style.justifyContent="center",this._elm.style.alignItems="center";var o=this.getSkin();this._elm.style.backgroundColor=o.buttonColor,this.selected=!1;var n=this;this._elm.onclick=function(){n.selected=!n.selected},this._elm.onmouseenter=function(){n.element.style.backgroundColor=o.buttonOverColor},this._elm.onmouseleave=function(){n.selected||(n.element.style.backgroundColor=o.buttonColor)}},setSelected:function(t){this.selected=t;var e=this.getSkin();this._elm.style.backgroundColor=this.selected?e.buttonOverColor:e.buttonColor},setOnClick:function(t){var e=this;this._elm.onclick=function(){e.selected=!e.selected,t()}}});return t.ButtonImageToggle=o});
//# sourceMappingURL=sourcemaps/ButtonImageToggle.js.map
