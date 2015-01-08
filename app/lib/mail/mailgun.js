/**
 *
 * @date 2015-01-08 13:30:23
 * @author vfasky <vfasky@gmail.com>
 */

"use strict";

var request = require('request');
var _ = require('lodash');
var config = require('../../../config');

module.exports = function(options) {
    return function(done) {
        options = _.extend({
            apiKey: config.mailgun.apiKey,
            from: config.mailgun.from
        }, options);

        request({
            uri: config.mailgun.url,
            method: 'POST',
            auth: {
                user: 'api',
                pass: options.apiKey
            },
            form: {
                from: options.from,
                to: options.to,
                subject: options.subject || options.title,
                html: options.html
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
