/**
 * skylark-widgets-actions - The skylark action widgets library
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-widgets/skylark-widgets-actions/
 * @license MIT
 */
define(["skylark-langx/objects","skylark-langx/Evented","skylark-data-collection/HashMap","./base","./ActionManager"],function(t,e,n,i,a){var c=e.inherit({klassName:"Action",name:"",category:"",text:"",tooltip:"",icon:"",shortcut:"",state:{get:function(){return this._state||(this._state=new n({checked:!1,disabled:!1}))}},_construct:function(e){e&&t.mixin(this,e)},_init:function(){},execute:function(t){this._execute&&this._execute(t),this.trigger("executed",{params:t})}});return i.Action=c});
//# sourceMappingURL=sourcemaps/Action.js.map
