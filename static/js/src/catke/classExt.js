/**
 * catke 扩展
 * @date 2014-11-10 14:28:50
 * @author vfasky <vfasky@gmail.com>
 * @version $Id$
 */
define('catke/classExt', ['jquery'], function($) {
    "use strict";
    /**
     * @exports module:catke/classExt
     * @author vfasky <vfasky@gmail.com>
     * @type {Object}
     */
    var exports = {};

    var Ctor = function() {};

    var indexOf = Array.prototype.indexOf ? function(arr, item) {
        return arr.indexOf(item);
    } : function(arr, item) {
        for (var i = 0, len = arr.length; i < len; i++) {
            if (arr[i] === item) {
                return i;
            }
        }
        return -1;
    };

    /**
     * mix
     * @param  {Object} r  target
     * @param  {Object} s  soure
     * @param  {undefined} wl
     * @return {Void}
     */
    exports.mix = function(r, s, wl) {
        // Copy "all" properties including inherited ones.
        for (var p in s) {
            if (s.hasOwnProperty(p)) {
                if (wl && indexOf(wl, p) === -1) {
                    continue;
                }
                // 在 iPhone 1 代等设备的 Safari 中，prototype 也会被枚举出来，需排除
                if (p !== "prototype") {
                    r[p] = s[p];
                }
            }
        }
    };

    /**
     * class 事件
     * @constructor
     * @author vfasky <vfasky@gmail.com>
     * @param {Object} event 事件定义
     */
    exports.ClassEvent = function(event) {
        this.event = event || {};
    };

    /**
     * 注册事件
     * @param {String} name 事件名
     */
    exports.ClassEvent.prototype.addEvent = function(name) {
        this.event = this.event || {};
        if (false === $.isArray(this.event[name])) {
            this.event[name] = [];
        }
    };

    /**
     * 监听事件
     * @param  {String} name 事件名
     * @param  {Function} callback 回调
     * @return {module:cepin/classExt.ClassEvent}
     */
    exports.ClassEvent.prototype.on = function(name, callback) {
        if ($.isArray(this.event[name])) {
            this.event[name].push(callback);
        }
        return this;
    };

    /**
     * 移除监听事件
     * @param  {String} name 事件名
     * @return {module:cepin/classExt.ClassEvent}
     */
    exports.ClassEvent.prototype.off = function(name) {
        if ($.isArray(this.event[name])) {
            this.event[name] = [];
        }
        return this;
    };

    /**
     * 触发事件
     * @param  {String} name 事件名
     * @param  {Mixed} e 传递的参数
     * @return {Boolean}
     */
    exports.ClassEvent.prototype.callEvent = function(name, e) {
        var type;
        $.each(this.event[name] || [], function(k, v) {
            type = v(e);
            return type;
        });
        return type;
    };

    /**
     * 继续原型链
     * @param  {Object} proto prototype
     * @return {Object}
     */
    exports.extendProto = Object.hasOwnProperty('__proto__') ? function(proto) {
        return {
            '__proto__': proto
        };
    } : function(proto) {
        Ctor.prototype = proto;
        return new Ctor();
    };

    /**
     * 事件扩展
     * @author vfasky <vfasky@gmail.com>
     * @param  {Object} self  当前 class this 指针
     * @param  {Object} Cls   当前 class 未实例对象
     * @param  {Object} event 事件定义
     * @return {Void}
     */
    exports.event = function(self, Cls, event) {
        self.event = event || {};

        exports.mix(Cls.prototype, exports.ClassEvent.prototype);
    };

    exports.extend = function(Class, definition) {
        definition = $.extend({
            initialize: function() {}
        }, definition || {});

        var initialize = definition.initialize;

        var _New = function() {
            this.superclass = Class.prototype;
            this.superclass.initialize = Class;
            initialize.apply(this, arguments);
        };

        _New.prototype = exports.extendProto(Class.prototype);

        delete definition.initialize;

        for (var k in definition) {
            _New.prototype[k] = definition[k];
        }

        _New.extend = function(definition) {
            return exports.extend(_New, definition);
        };

        return _New;
    };

    return exports;
});
