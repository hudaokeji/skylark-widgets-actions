/**
 * skylark-widgets-actions - The skylark action widgets library
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-widgets/skylark-widgets-actions/
 * @license MIT
 */
define(["../actions","../buttons/ButtonText"],function(t,i){"use strict";var n=i.inherit({_construct:function(t){i.prototype._construct.call(this,t),this.span.style.textIndent="25px",this.icon=null;var n=this.getSkin();this.setColor(n.buttonColor,n.buttonOverColor)},setIcon:function(t){null===this.icon&&(this.icon=document.createElement("img"),this.icon.style.position="absolute",this.icon.style.display="block",this.icon.style.left="5px",this.icon.style.top="3px",this.icon.style.width="12px",this.icon.style.height="12px",this._elm.appendChild(this.icon)),this.icon.src=t}});return t.buttons.ButtonMenu=n});
//# sourceMappingURL=../sourcemaps/menus/ButtonMenu.js.map
