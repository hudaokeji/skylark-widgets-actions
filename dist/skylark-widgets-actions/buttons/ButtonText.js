/**
 * skylark-widgets-actions - The skylark action widgets library
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-widgets/skylark-widgets-actions/
 * @license MIT
 */
define(["skylark-widgets-base/mixins/TextMixin","../actions","./Button"],function(t,o,i){"use strict";var e=i.inherit({_construct:function(t){i.prototype._construct.call(this,t);var o=this.getSkin();this._elm.style.color=o.textColor,this._elm.style.display="flex",this._buildText(),this.setColor(o.buttonColor,o.buttonOverColor)},...t});return o.buttons.ButtonText=e});
//# sourceMappingURL=../sourcemaps/buttons/ButtonText.js.map
