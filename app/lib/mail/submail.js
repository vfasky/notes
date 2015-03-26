/**
 *
 * @date 2015-01-19 17:01:02
 * @author vfasky <vfasky@gmail.com>
 */

"use strict";

var _ = require('lodash');
var config = require('../../../config');
var querystring = require('querystring');
var https = require('https');


module.exports = function(options) {
    return function(done) {
        options = _.extend({
            apiKey: config.submail.apiKey,
            appid: config.submail.appid,
            from: config.submail.from
        }, options);

        var postData = {
            appid: options.appid,
            from: options.from,
            to: options.to,
            subject: options.subject || options.title,
            html: options.html,
            signature: options.apiKey
        };

        var to = (postData.to || '').split(',').map(function(v) {
            v = v.trim();
            if (v.indexOf('<') !== 0) {
                v = '<' + v + '>';
            }
            return v;
        });
        postData.to = to.join(',');

        var postDataStr = querystring.stringify(postData);

        //https://api.submail.cn/mail/send.json
        var postOptions = {
            host: 'api.submail.cn',
            port: 443,
            path: '/mail/send.json',
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Content-Length': postDataStr.length
            }
        };

        var postReq = https.request(postOptions, function(res) {
            res.setEncoding('utf8');
            res.on('data', function(chunk) {
                var data = JSON.parse(chunk);
                if (data.status === 'success') {
                    return done();
                }
                done(data.msg || chunk);
                //console.log('Response: ' + chunk);
            });
        });

        postReq.on('error', function(e) {
            done(e);
        });

        // post the data
        postReq.write(postDataStr);
        postReq.end();


    };
};
