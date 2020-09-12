/**
 * skylark-widgets-buttons - The skylark button widgets library
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-widgets/skylark-widgets-buttons/
 * @license MIT
 */
define(["skylark-widgets-base/Widget","./buttons"],function(t,e){"use strict";var n=t.inherit({_construct:function(e){t.prototype._construct.call(this,e,"div"),this._elm.style.cursor="pointer",this.preventDragEvents()},setColor:function(t,e){this._elm.style.backgroundColor=t,this._elm.onmouseenter=function(){this.style.backgroundColor=e},this._elm.onmouseleave=function(){this.style.backgroundColor=t}},setStyles:function(t,e){for(var n in t)this._elm.style[n]=t[n];this._elm.onmouseenter=function(){for(var t in e)this.style[t]=e[t]},this._elm.onmouseleave=function(){for(var e in t)this.style[e]=t[e]}}});return e.Button=n});
//# sourceMappingURL=sourcemaps/Button.js.map
