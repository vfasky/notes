/**
 * view
 * @module note/view
 * @author vfasky <vfasky@gmail.com>
 */	
define('note/view', 
['jquery', 'catke/http', 'catke/classExt'], 
function($, http, classExt){
	"use strict";

	var View = function($el, app){
        this.$el = $el;
        this.app = app;

        //模板引擎绑定
        if(app.config.Template){
            this.Template = app.config.Template;
        }

        //封装一个 promise 规范的http helper
        this.http = http;
    };


    View.prototype.when = function(){
        return $.when.apply(this, arguments);
    };

    View.prototype.run = function(context){
        this.context = context;
    };

    View.prototype.destroy = function(){
        this.$el.remove();
    };

    View.extend = function(definition){
        definition = $.extend({
            initialize: function(){}
        }, definition || {});

        var initialize = definition.initialize;

        var _View = function($el, app){
            this.superclass = View.prototype;
            this.superclass.initialize = View;
            initialize.call(this, $el, app);
        };

        _View.prototype = classExt.extendProto(View.prototype);

        delete definition.initialize;

        for(var k in definition){
            _View.prototype[k] = definition[k];
        }
        return _View;
    };
	
	return View;
});