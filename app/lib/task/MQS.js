"use strict";

/**
 * 阿里云的MQS
 * @author vfasky <vfasky@gmail.com>
 */
var config = require('../../../config');
var MQSClient = require('aliyun_mqs');

var _emailQueue = 'note-email';
var _indexQueue = 'note-index';

var nameMap = {
    'email': _emailQueue,
    'index': _indexQueue
};

Object.defineProperty(MQSClient.prototype, 'email', {
    get: function() {
        return nameMap.email;
    }
});

Object.defineProperty(MQSClient.prototype, 'index', {
    get: function() {
        return nameMap.index;
    }
});

var client = new MQSClient(config.MQS);

module.exports = client;


