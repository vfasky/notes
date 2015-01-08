/**
 * 任务队列
 * @module catke/task
 * @author vfasky <vfasky@gmail.com>
 * @example
 *     require(['catke'], function(catke){
 *         var i = 0;
 *         var task = new catke.Task(function(){
 *             i++;
 *
 *             if(i === 3){
 *                 task.remove(); //执行3次后,移除
 *             }
 *             else{
 *                 console.log(i); // 结果 => 1 2
 *             }
 *         });
 *     });
 */
define('catke/task', ['jquery'], function($) {
    "use strict";

    //任务id
    var _intervalId = 0;

    // 定时任务列表
    var _intervalList = [];

    // interval Id
    var _intervalTime = null;

    //取任务总数
    var getTaskLength = function() {
        var total = 0;
        $.each(_intervalList, function(k, v) {
            if (v) {
                total++;
            }
        });
        return total;
    };

    //运行任务
    var runTasks = function() {
        if (!_intervalTime && getTaskLength() > 0) {
            _intervalTime = setInterval(function() {
                $.each(_intervalList, function(k, v) {
                    if (v && $.isFunction(v.callback)) {
                        v.callback(v);
                    }
                });
            }, 200);
        }
    };

    /**
     * 在后台添加每200ms执行的任务
     * @alias module:cepin/task
     * @constructor
     * @param {Function} callback
     */
    var Task = function(callback) {
        this.id = _intervalId;
        this.callback = callback;
        _intervalId++;
        this.run();
    };

    Task.prototype.run = function() {
        var isIn = false;
        var self = this;
        $.each(_intervalList, function(k, v) {
            if (v && v.id === self.id) {
                isIn = true;
                return false;
            }
        });
        if (false === isIn) {
            _intervalList.push(this);
        }
        runTasks();
    };

    /**
     * 移除任务
     * @return {Void}
     */
    Task.prototype.remove = function() {
        var self = this;
        $.each(_intervalList, function(k, v) {
            if (v && v.id === self.id) {
                delete _intervalList[k];
                return false;
            }
        });
        //没有任务,清空定时任务
        if (0 === getTaskLength() && _intervalTime) {
            clearInterval(_intervalTime);
            _intervalList = [];
            _intervalTime = null;
        }
    };

    return Task;
});
