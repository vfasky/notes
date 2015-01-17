"use strict";
/**
 * 执行任务
 * @author vfasky <vfasky@gmail.com>
 */
var config = require('./config');
var validator = require('validator');
var task = require('./app/lib/task');
var model = require('./app/model');
/**
 * 长连接，等待2秒
 * @type {Number}
 */
var wait = 2;

/**
 * 执行完，休息 1 秒再执行
 * @type {Number}
 */
var sleep = 1;

/**
 * 错误记录
 * @author vfasky <vfasky@gmail.com>
 * @date   2014-12-26
 * @param  {String} type
 * @param  {[type]} err [description]
 * @return {[type]} [description]
 */
var log = function(type, err) {
    //TODO 记录
    console.log(type + ': ' + err);
};

/**
 * 取任务
 */
var getTask = function(type, callback) {
    var next = function() {
        setTimeout(callback, sleep * 1000);
    };

    var remove = function(receiptHandle) {
        task.message.remove(type, receiptHandle)
            .then(next, function(err) {
                log(type, err);
                next();
            });
    };

    var run = {};

    //创建索引任务
    run[task.index] = function(data) {
        var id = data.MessageBody;
        if (validator.isMongoId(id)) {
            model.Note.findOne({
                _id: id
            }, function(note, err) {
                if (err) {
                    log(type, err);
                    return next();
                }
                if (null === note) {
                    remove(data.ReceiptHandle);
                } else {
                    note.buildIndex()(function(err) {
                        if (err) {
                            log(type, err);
                            return next();
                        }
                        remove(data.ReceiptHandle);
                    });
                }
            });
        } else {
            remove(data.ReceiptHandle);
        }
    };

    task.message.get(type, wait).then(function(data) {

        run[type](data);

    }, function(err) {
        if ('Message not exist.' !== err) {
            log('index', err);
        }
        console.log('not ' + type + ' task');
        next();
    });
};

var taskLoop = function() {
    getTask(task.email, function() {
        getTask(task.index, taskLoop);
    });
};

if (config.MQS.accessKeyId !== 'you accessKeyId') {
    taskLoop();
} else {
    throw Error('MQS config error');
}
