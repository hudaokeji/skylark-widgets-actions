/**
 * skylark-widgets-actions - The skylark action widgets library
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-widgets/skylark-widgets-actions/
 * @license MIT
 */
define(["skylark-widgets-base/mixins/TextMixin","../actions","./Button"],function(t,n,i){"use strict";var o=i.inherit({_construct:function(t){i.prototype._construct.call(this,t);var n=this.getSkin();this._buildTextSpan(),this.setColor(n.buttonColor,n.buttonOverColor)},...t});return n.buttons.ButtonText=o});
//# sourceMappingURL=../sourcemaps/buttons/ButtonText.js.map
