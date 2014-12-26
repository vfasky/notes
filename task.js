"use strict";
/**
 * 执行任务
 * @author vfasky <vfasky@gmail.com>
 */	
var config = require('./config');
var validator = require('validator');
var MQS = require('./app/lib/MQS');
var model = require('./app/model');
/**
 * 长连接，等待2秒
 * @type {Number}
 */
var wait = 2;

/**
 * 执行完，休息 2 秒再执行
 * @type {Number}
 */
var sleep = 2;

/**
 * 错误记录
 * @author vfasky <vfasky@gmail.com>
 * @date   2014-12-26
 * @param  {String} type 
 * @param  {[type]} err [description]
 * @return {[type]} [description]
 */
var log = function(type, err){
	//TODO 记录
	console.log(type + ': ' + err);	
};

/**
 * 取笔记索引任务
 * @author vfasky <vfasky@gmail.com>
 * @date   2014-12-26
 * @param  {Function} callback 完成后回调
 */
var getNoteIndexTask = function(callback){
	var next = function(){
		setTimeout(callback, sleep * 1000);
	};

	MQS.message.get(MQS.index, wait).then(function(data){
		//console.log(data.MessageBody);
		var id = data.MessageBody;
		if(validator.isMongoId(id)){
			model.Note.findOne({
				_id: id
			}, function(note, err){
				if(err){
					log('index', err);
					return next();
				}
				if(null === note){
					//console.log('note is Null');
					MQS.message.remove(MQS.index, data.ReceiptHandle)
					   .then(next, function(err){
							log('index', err);	
					   });
				}
				else{
					note.buildIndex()(next);
				}
			});
		}
		else{
			MQS.message.remove(MQS.index, data.ReceiptHandle)
			   .then(next, function(err){
					log('index', err);	
			   });
		}
		
	}, function(err){
		if('Message not exist.' !== err){
			log('index', err);
		}
		next();
	});
};

var noteIndexLoop = function(){
	getNoteIndexTask(noteIndexLoop);
};

if(config.MQS.accessKeyId !== 'you accessKeyId'){
	noteIndexLoop();
}
else{
	throw Error ('MQS config error');
}