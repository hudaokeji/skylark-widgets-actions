/**
 * skylark-widgets-buttons - The skylark button widgets library
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-widgets/skylark-widgets-buttons/
 * @license MIT
 */
define(["skylark-widgets-base/mixins/ImageMixin","./buttons","./Button"],function(t,i,n){"use strict";var e=n.inherit({_construct:function(t){n.prototype._construct.call(this,t),this._buildImage(),this.setColor(null,Editor.theme.buttonOverColor)},...t});return i.ButtonImage=e});
//# sourceMappingURL=sourcemaps/ButtonImage.js.map
