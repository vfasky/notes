"use strict";

/**
 * 验证请求
 * @author vfasky <vfasky@gmail.com>
 */

var _ = require('lodash');
var validator = require('validator');

/**
 * 支持的验证规则
 * @type {Array}
 * @link https://github.com/chriso/validator.js
 */
var _rules = [
    'equals',
    'contains',
    'matches',
    'isEmail',
    'isFQDN',
    'isURL',
    'isIP',
    'isAlpha',
    'isNumeric',
    'isAlphanumeric',
    'isBase64',
    'isHexadecimal',
    'isHexColor',
    'isLowercase',
    'isUppercase',
    'isInt',
    'isFloat',
    'isDivisibleBy',
    'isNull',
    'isLength',
    'isByteLength',
    'isUUID',
    'isDate',
    'isAfter',
    'isBefore',
    'isIn',
    'isCreditCard',
    'isISBN',
    'isJSON',
    'isMultibyte',
    'isAscii',
    'isFullWidth',
    'isHalfWidth',
    'isVariableWidth',
    'isSurrogatePair',
    'isMongoId'
];

var getInstantiate = function(rule) {
    if (!rule.isInstantiate) {
        rule = rule();
    }

    return rule;
};

/**
 * 检查规则
 * @param  {Mixed} value
 * @param  {Mixed} rules
 * @return {Array}
 */
var check = function(value, rules) {
    if (false === _.isArray(rules)) {
        return [getInstantiate(rules)(value)];
    }
    if (2 === rules.length &&  _.isString(rules[1])) {
        return [getInstantiate(rules[0])(value), rules[1]];
    }
    var res = [true];

    _.each(rules, function(v) {
        if (_.isArray(v)) {
            if (v.length !== 2) {
                throw new Error('validator rule fail');
            }

            if (false === getInstantiate(v[0])(value)) {
                res = [false, v[1]];
                return false;
            }

        } else {
            if (false === getInstantiate(v)(value)) {
                res = [false];
                return false;
            }
        }
    });
    return res;
};

/**
 * body 数据验证
 * @author vfasky <vfasky@gmail.com>
 * @module app/middleware/validate
 * @example
 * app.get('/test/validator', validate({
 *     email: [
 *         [validate.required, 'not Null'],
 *         validate.isEmail
 *     ]
 * }), function *(next){
 * 	   if(this.validateError){
 * 	       return next(this.validateError);
 * 	   }
 *     this.body = this.request.body.email;
 * });
 */
module.exports = exports = function(rules) {
    return function*(next) {
        var self = this;
        var keys = Object.keys(rules);
        var body = this.request.body || {};

        self.validateError = null;

        _.each(keys, function(v) {
            var res = check(body[v], rules[v]);

            if (false === res[0]) {

                if (res.length === 2) {
                    self.validateError = res[1];
                } else {
                    self.validateError = v + ' Validation fails';
                }
                return false;
            }
        });

        yield * next;
    };
};

/**
 * 必填
 */
module.exports.required = function() {
    var rule = function(x) {
        return String(x || '').trim().length > 0;
    };
    rule.isInstantiate = true;
    return rule;
};

/**
 * 扩展验证方法
 */
_.each(_rules, function(v) {
    module.exports[v] = function() {
        var args = 1 <= arguments.length ? [].slice.call(arguments, 0) : [];

        var rule = function(x) {
            args.splice(0, 0, x);
            return validator[v].apply(null, args);
        };
        rule.isInstantiate = true;
        return rule;
    };
});
