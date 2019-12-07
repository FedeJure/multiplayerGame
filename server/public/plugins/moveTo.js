!function(t,e){"object"==typeof exports&&"object"==typeof module?module.exports=e():"function"==typeof define&&define.amd?define([],e):"object"==typeof exports?exports.rexmovetoplugin=e():t.rexmovetoplugin=e()}(window,function(){return function(t){var e={};function n(i){if(e[i])return e[i].exports;var r=e[i]={i:i,l:!1,exports:{}};return t[i].call(r.exports,r,r.exports,n),r.l=!0,r.exports}return n.m=t,n.c=e,n.d=function(t,e,i){n.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:i})},n.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},n.t=function(t,e){if(1&e&&(t=n(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var i=Object.create(null);if(n.r(i),Object.defineProperty(i,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var r in t)n.d(i,r,function(e){return t[e]}.bind(null,r));return i},n.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return n.d(e,"a",e),e},n.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},n.p="",n(n.s=293)}({10:function(t,e,n){"use strict";var i=n(3);function r(t,e){for(var n=0;n<e.length;n++){var i=e[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(t,i.key,i)}}var o=Phaser.Utils.Objects.GetValue,s=function(){function t(e,n){!function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,t),this.parent=e,this._isRunning=!1,this.tickingState=!1,this.setEventEmitter(o(n,"eventEmitter",void 0)),this.setTickingMode(o(n,"tickingMode",1))}var e,n,i;return e=t,(n=[{key:"boot",value:function(){2!==this.tickingMode||this.tickingState||this.startTicking()}},{key:"shutdown",value:function(){this.destroyEventEmitter(),this.tickingState&&this.stopTicking()}},{key:"setTickingMode",value:function(t){"string"==typeof t&&(t=u[t]),this.tickingMode=t}},{key:"startTicking",value:function(){this.tickingState=!0}},{key:"stopTicking",value:function(){this.tickingState=!1}},{key:"start",value:function(){return this.isRunning=!0,this}},{key:"pause",value:function(){return this.isRunning=!1,this}},{key:"resume",value:function(){return this.isRunning=!0,this}},{key:"stop",value:function(){return this.isRunning=!1,this}},{key:"complete",value:function(){this.isRunning=!1,this.emit("complete",this.parent,this)}},{key:"isRunning",get:function(){return this._isRunning},set:function(t){this._isRunning!==t&&(this._isRunning=t,1===this.tickingMode&&t!=this.tickingState&&(t?this.startTicking():this.stopTicking()))}}])&&r(e.prototype,n),i&&r(e,i),t}();Object.assign(s.prototype,i.a);var u={no:0,lazy:1,always:2};e.a=s},194:function(t,e,n){"use strict";var i=n(56);e.a=i.a},293:function(t,e,n){"use strict";n.r(e);var i=n(194);function r(t){return(r="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}function o(t,e){for(var n=0;n<e.length;n++){var i=e[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(t,i.key,i)}}function s(t,e){return!e||"object"!==r(e)&&"function"!=typeof e?function(t){if(void 0===t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return t}(t):e}function u(t){return(u=Object.setPrototypeOf?Object.getPrototypeOf:function(t){return t.__proto__||Object.getPrototypeOf(t)})(t)}function a(t,e){return(a=Object.setPrototypeOf||function(t,e){return t.__proto__=e,t})(t,e)}var c=function(t){function e(t){return function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,e),s(this,u(e).call(this,t))}var n,r,c;return function(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),e&&a(t,e)}(e,Phaser.Plugins.BasePlugin),n=e,(r=[{key:"start",value:function(){this.game.events.once("destroy",this.destroy,this)}},{key:"add",value:function(t,e){return new i.a(t,e)}}])&&o(n.prototype,r),c&&o(n,c),e}();e.default=c},3:function(t,e,n){"use strict";e.a={setEventEmitter:function(t,e){return void 0===e&&(e=Phaser.Events.EventEmitter),this._privateEE=void 0===t,this._eventEmitter=this._privateEE?new e:t,this},destroyEventEmitter:function(){this._eventEmitter&&this._privateEE&&this._eventEmitter.shutdown()},getEventEmitter:function(){return this._eventEmitter},on:function(){return this._eventEmitter&&this._eventEmitter.on.apply(this._eventEmitter,arguments),this},once:function(){return this._eventEmitter&&this._eventEmitter.once.apply(this._eventEmitter,arguments),this},off:function(){return this._eventEmitter&&this._eventEmitter.off.apply(this._eventEmitter,arguments),this},emit:function(){return this._eventEmitter&&this._eventEmitter.emit.apply(this._eventEmitter,arguments),this},addListener:function(){return this._eventEmitter&&this._eventEmitter.addListener.apply(this._eventEmitter,arguments),this},removeListener:function(){return this._eventEmitter&&this._eventEmitter.removeListener.apply(this._eventEmitter,arguments),this},removeAllListeners:function(){return this._eventEmitter&&this._eventEmitter.removeAllListeners.apply(this._eventEmitter,arguments),this},listenerCount:function(){return this._eventEmitter?this._eventEmitter.listenerCount.apply(this._eventEmitter,arguments):0},listeners:function(){return this._eventEmitter?this._eventEmitter.listeners.apply(this._eventEmitter,arguments):[]}}},4:function(t,e,n){"use strict";var i=n(5);e.a=function(t){return Object(i.a)(t)?t:t.scene&&Object(i.a)(t.scene)?t.scene:t.parent&&t.parent.scene&&Object(i.a)(t.parent.scene)?t.parent.scene:void 0}},5:function(t,e,n){"use strict";var i=Phaser.Scene;e.a=function(t){return t instanceof i}},56:function(t,e,n){"use strict";var i=n(10),r=n(4);function o(t){return(o="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}function s(t,e){for(var n=0;n<e.length;n++){var i=e[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(t,i.key,i)}}function u(t,e){return!e||"object"!==o(e)&&"function"!=typeof e?function(t){if(void 0===t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return t}(t):e}function a(t,e,n){return(a="undefined"!=typeof Reflect&&Reflect.get?Reflect.get:function(t,e,n){var i=function(t,e){for(;!Object.prototype.hasOwnProperty.call(t,e)&&null!==(t=c(t)););return t}(t,e);if(i){var r=Object.getOwnPropertyDescriptor(i,e);return r.get?r.get.call(n):r.value}})(t,e,n||t)}function c(t){return(c=Object.setPrototypeOf?Object.getPrototypeOf:function(t){return t.__proto__||Object.getPrototypeOf(t)})(t)}function f(t,e){return(f=Object.setPrototypeOf||function(t,e){return t.__proto__=e,t})(t,e)}var h=Phaser.Utils.Objects.GetValue,l=Phaser.Math.Distance.Between,p=Phaser.Math.Linear,y=Phaser.Math.Angle.Between,v=function(t){function e(t,n){var i;return function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,e),(i=u(this,c(e).call(this,t,n))).gameObject=t,i.scene=Object(r.a)(t),i.resetFromJSON(n),i.boot(),i}var n,o,v;return function(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),e&&f(t,e)}(e,i["a"]),n=e,(o=[{key:"resetFromJSON",value:function(t){return this.isRunning=h(t,"isRunning",!1),this.setEnable(h(t,"enable",!0)),this.timeScale=h(t,"timeScale",1),this.setSpeed(h(t,"speed",400)),this.setRotateToTarget(h(t,"rotateToTarget",!1)),this.targetX=h(t,"targetX",0),this.targetY=h(t,"targetY",0),this}},{key:"toJSON",value:function(){return{isRunning:this.isRunning,enable:this.enable,timeScale:this.timeScale,speed:this.speed,rotateToTarget:this.rotateToTarget,targetX:this.targetX,targetY:this.targetY,tickingMode:this.tickingMode}}},{key:"boot",value:function(){a(c(e.prototype),"boot",this).call(this),this.gameObject.once&&this.gameObject.once("destroy",this.destroy,this)}},{key:"shutdown",value:function(){a(c(e.prototype),"shutdown",this).call(this),this.gameObject=void 0,this.scene=void 0}},{key:"destroy",value:function(){this.shutdown()}},{key:"startTicking",value:function(){a(c(e.prototype),"startTicking",this).call(this),this.scene.events.on("update",this.update,this)}},{key:"stopTicking",value:function(){a(c(e.prototype),"stopTicking",this).call(this),this.scene&&this.scene.events.off("update",this.update,this)}},{key:"setEnable",value:function(t){return void 0==t&&(t=!0),this.enable=t,this}},{key:"setSpeed",value:function(t){return this.speed=t,this}},{key:"setRotateToTarget",value:function(t){return this.rotateToTarget=t,this}},{key:"moveTo",value:function(t,n){if("number"!=typeof t){var i=t;t=h(i,"x",void 0),n=h(i,"y",void 0)}return null==t||null==n?this:(this.targetX=t,this.targetY=n,a(c(e.prototype),"start",this).call(this),this)}},{key:"update",value:function(t,e){if(!this.isRunning||!this.enable)return this;var n=this.gameObject,i=n.x,r=n.y,o=this.targetX,s=this.targetY;if(i===o&&r===s)return this.complete(),this;if(0===this.speed||0===e||0===this.timeScale)return this;var u,a,c=e*this.timeScale/1e3,f=this.speed*c,h=l(i,r,o,s);if(f<h){var v=f/h;u=p(i,o,v),a=p(r,s,v)}else u=o,a=s;return n.setPosition(u,a),this.rotateToTarget&&(n.rotation=y(i,r,u,a)),this}}])&&s(n.prototype,o),v&&s(n,v),e}();e.a=v}}).default});
