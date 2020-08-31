/**
 * skylark-widgets-actions - The skylark action widgets library
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-widgets/skylark-widgets-actions/
 * @license MIT
 */
define(["skylark-widgets-base/mixins/ImageMixin","../actions","./Button"],function(t,i,n){"use strict";var o=n.inherit({_construct:function(t){n.prototype._construct.call(this,t),this._buildImage(),this.setColor(null,Editor.theme.buttonOverColor)},...t});return i.buttons.ButtonImage=o});
//# sourceMappingURL=../sourcemaps/buttons/ButtonImage.js.map
