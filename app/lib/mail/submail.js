/**
 * 
 * @date 2015-01-19 17:01:02
 * @author vfasky <vfasky@gmail.com>
 */

"use strict";

var request = require('request');
var _ = require('lodash');
var config = require('../../../config');

module.exports = function(options) {
    return function(done) {
        options = _.extend({
            apiKey: config.submail.apiKey,
            appid: config.submail.appid,
            from: config.submail.from
        }, options);

        request({
            uri: 'https://api.submail.cn/mail/send',
            method: 'POST',
            form: {
                from: options.from,
                to: options.to,
                subject: options.subject || options.title,
                html: options.html,
                signature: options.apiKey
            }
        }, function(err, res, body) {
            if (!err && res.statusCode === 200) {
                return done(null, JSON.parse(body));
            }

            if(err){
                return done({
                    message: err
                });
            }

            done(JSON.parse(body));
        });
    };
};
