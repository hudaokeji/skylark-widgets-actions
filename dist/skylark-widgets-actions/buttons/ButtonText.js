/**
 * skylark-widgets-actions - The skylark action widgets library
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-widgets/skylark-widgets-actions/
 * @license MIT
 */
define(["skylark-widgets-base/mixins/TextMixin","../actions","./Button"],function(t,i,n){"use strict";var o=n.inherit({_construct:function(t){n.prototype._construct.call(this,t);var i=this.getSkin();this._buildText(),this.setColor(i.buttonColor,i.buttonOverColor)},...t});return i.buttons.ButtonText=o});
//# sourceMappingURL=../sourcemaps/buttons/ButtonText.js.map
