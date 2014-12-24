"use strict";

/**
 * 阿里云的MQS
 * @author vfasky <vfasky@gmail.com>
 */	
var config = require('../../config');
var MQSClient = require('aliyun_mqs');


var client = new MQSClient(config.MQS);

var _emailQueue = 'note-email';
var _indexQueue = 'note-index';

var nameMap = {
	'email': _emailQueue,
	'index': _indexQueue
};

module.exports = client;

module.exports.install = function(){
	return function(done){
		client.queue.create(_emailQueue).then(function(){
	    	client.queue.create(_indexQueue).then(function(){
	    		done(); 
	    	}, done);
	    }, done);
	};
};

module.exports.send = function(type, msg){
	return client.message.send(nameMap[type], {
        msg: JSON.stringify(msg)
    });
};

module.exports.get = function(type, wait){
	return function(done){
		client.message.get(nameMap[type], wait).then(function(data){
			console.log(data);
			done(data);
		}, done);
	};
};