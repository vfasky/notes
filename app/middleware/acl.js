"use strict";
/**
 * 访问控制
 * @author vfasky <vfasky@gmail.com>
 */    

var _ = require('lodash');

/**
 * 错误处理
 * @type {Void}
 */
var failureHandler = function() {
    var t = this.accepts('json', 'html');
    if (t === 'json') {
        this.status = 403;
        this.body = {
            state: false,
            error: 'Access Denied'
        };
    } else {
        this.redirect('/login');
    }
};

/**
 * 容许访问的角色
 * @type {Function}
 */
exports.allow = function() {
    var roles = 1 <= arguments.length ? [].slice.call(arguments, 0) : [];

    return function *(next) {

        var user = this.session.user || null;

        if (null === user || user.roles.length === 0) {
            return failureHandler.call(this);
        }

        var isPass = false;
        _.each(roles, function(r) {
            if (user.roles.indexOf(r) !== -1) {
                isPass = true;
                return false;
            }
        });

        if (false === isPass) {
            return failureHandler.call(this);
        }

        yield * next;
    };
};
