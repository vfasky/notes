/**
 * 封装http请求
 * @module catke/http
 * @author vfasky <vfasky@gmail.com>
 */
define('catke/http', ['jquery', 'catke/popTips'], function($, popTips) {
    "use strict";

    var ajax = function(type, url, data, contentType) {

        var dtd = $.Deferred();

        if (contentType && contentType.indexOf('json') !== -1) {
            data = JSON.stringify(data);
        }

        contentType = contentType || 'application/x-www-form-urlencoded; charset=UTF-8';

        $.ajax(url, {
            type: type,
            cache: false,
            data: data || {},
            dataType: 'json',
            contentType: contentType
        }).done(function(ret) {
            if (ret.state === false) {
                popTips.error(ret.error || '发生未知错误');
                if (ret.url) {
                    setTimeout(function() {
                        window.location.href = ret.url;
                    }, 800);
                }
            } else {
                dtd.resolve(ret.data);
            }
        }).fail(function() {
            popTips.error('服务端发生错误了');
            dtd.reject();
        });
        return dtd.promise();
    };

    var undef;

    var exports = {
        get: function(url, data, isJson) {
            var contentType = false;
            if (isJson !== undef) {
                contentType = 'application/json;charset=utf-8';
            }
            return ajax('GET', url, data, contentType);
        },
        post: function(url, data, isJson) {
            var contentType = false;
            if (isJson !== undef) {
                contentType = 'application/json;charset=utf-8';
            }
            return ajax('POST', url, data, contentType);
        },
        put: function(url, data, isJson) {
            var contentType = false;
            if (isJson !== undef) {
                contentType = 'application/json;charset=utf-8';
            }
            return ajax('PUT', url, data, contentType);
        },
        head: function(url, data, isJson) {
            var contentType = false;
            if (isJson !== undef) {
                contentType = 'application/json;charset=utf-8';
            }
            return ajax('HEAD', url, data, contentType);
        },
        del: function(url, data, isJson) {
            var contentType = false;
            if (isJson !== undef) {
                contentType = 'application/json;charset=utf-8';
            }
            return ajax('DELETE', url, data, contentType);
        }
    };

    return exports;
});

/**
 * placeholder
 * @date 2014-11-10 15:22:41
 * @author vfasky <vfasky@gmail.com>
 * @version $Id$
 */
define('catke/placeholder', ['jquery', 'catke/util', 'catke/task'], function($, util, Task) {
    "use strict";

    if (!util.ie || util.ie > 9) {
        return function() {};
    }

    var id = 0;

    var Widget = function($el, config) {
        var self = this;
        this.id = id;
        id++;
        this.$el = $el;
        this.config = $.extend({
            color: '#999'
        }, config || {});
        this.$tip = this.build();
        this.set(this.$el.attr('placeholder'));
        this.buildCss();


        if (this.isHidden()) {
            new Task(function(task) {
                if (false === self.isHidden()) {
                    self.setPostion();
                    //self.buildCss();
                    task.remove();
                }
            });
        }

        this.$parent = this.$el.parent();

        if (this.$parent.css('position') === 'static') {

            this.$parent.css('position', 'relative');
        }


        this.setPostion();

        this.$tip.insertAfter(this.$el).click(function() {
            self.$el.focus();
        });
        this.$el.on('blur change', function() {
            if ($.trim(self.$el.val()) === '') {
                self.$tip.show();
            } else {
                self.$tip.hide();
            }
        }).on('focus', function() {
            self.$tip.hide();
        });

        if ($.trim(this.$el.val()) !== '') {
            self.$tip.hide();
        }

        $(window).on('resize.placeholder' + this.id + ', scroll.placeholder' + this.id, function() {
            if (false === self.isHidden()) {
                self.setPostion();
            }
        });


    };

    Widget.prototype.isHidden = function() {
        return false === this.$el.is(':visible');
    };

    Widget.prototype.setPostion = function() {
        var position = this.$el.position();
        this.$tip.css(position);
    };

    Widget.prototype.set = function(val) {
        this.$tip.text(val);
        if ($.trim(this.$el.val()) !== '') {
            this.$tip.hide();
        }
    };

    Widget.prototype.build = function() {

        var $el = $('<span></span>');

        return $el;
    };

    Widget.prototype.buildCss = function() {
        var self = this;
        var height = self.$el.outerHeight();

        this.$tip.css({
            color: self.config.color,
            fontSize: self.$el.css('fontSize') || '12px',
            padding: self.$el.css('padding') || '0',
            paddingTop: 0, //self.$el.css('paddingTop'),
            paddingLeft: self.$el.css('paddingLeft'),
            margin: self.$el.css('margin') || '0',

            width: self.$el.outerWidth(),
            height: height,
            lineHeight: height + 'px',
            position: 'absolute'
        });
    };


    return function($els) {
        $els = $els || $('[placeholder]');

        $els.each(function() {
            var $el = $(this);
            var widget = $el.data('placeholder');
            if (!widget) {
                widget = new Widget($el);
                $el.data('placeholder', widget);
            } else if (widget.set) {
                widget.set($el.attr('placeholder'));
                //widget.setPostion();
                //widget.buildCss();
            }
        });
    };
});

/**
 * 弹出提示模块
 * @date 2014-09-10
 * @author kotenei <kotenei@qq.com>
 */
define('catke/popTips', ['jquery'], function($) {
    "use strict";

    /**
     * 弹出提示模块
     * @exports module:catke/popTips
     * @type {Object}
     * @example
     *     require(['catke'], function(catke){
     *         catke.popTips.success('成功');
     *         catke.popTips.error('error');
     *     });
     */
    var popTips = function(){

        var $tips, tm;

        var build = function (status, content, delay, callback) {

            if (tm) {
                clearTimeout(tm);
            }

            if ($.isFunction(delay)) {
                callback = delay;
                delay = 3000;
            }

            callback = callback || function() {};
            delay = delay || 3000;

            if ($tips) {
                $tips.stop().remove();
            }

            $tips = $(getHtml(status, content))
                .appendTo(document.body).hide();

            $tips.css({
                marginLeft: -($tips.width() / 2),
                marginTop: -($tips.height() / 2)
            }).fadeIn('fase', function() {
                tm = setTimeout(function() {
                    $tips.stop().remove();
                    callback();
                }, delay);
            });
        };

        var getHtml = function (status, content) {
            var html = [];
            switch (status) {
                case "success":
                    html.push('<div class="ck-poptips success"><i class="nicon nicon-success"></i>' + content + '</div>');
                    break;
                case "error":
                    html.push('<div class="ck-poptips error"><i class="nicon nicon-error"></i>' + content + '</div>');
                    break;
                case "warning":
                    html.push('<div class="ck-poptips warning"><i class="nicon nicon-warning"></i>' + content + '</div>');
                    break;
            }
            return html.join('');
        };

        return {
            success: function(content, callback, delay) {
                build("success", content, callback, delay);
            },
            error: function(content, callback, delay) {
                build("error", content, callback, delay);
            },
            warning: function(content, callback, delay) {
                build("warning", content, callback, delay);
            }
        };
    };

    return popTips();
});

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
            _intervalTime = setInterval(function(args) {
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

/**
 * 消息提示模块
 * @module catke/tooltips
 * @date 2014-09-05
 * @author kotenei <kotenei@qq.com>
 */
 
define('catke/toolTips', ['jquery'], function ($) {
    "use strict";

    /**
     * 消息提示模块
     * @alias module:catke/tooltips
     * @constructor
     * @param {JQuery} $element - dom
     * @param {Object} options - 参数
     */
    var ToolTips = function ($element, options) {
        this.$element = $element;
        this.options = $.extend({}, {
            delay: 0,
            //title: '',
            content: '',
            tipClass: '',
            placement: 'right',
            trigger: 'hover click',
            container: document.body
        }, options);
        this.init();
    };

    /**
     * 初始化
     * @return {Void}
     */
    ToolTips.prototype.init = function () {
        this.$tips = $('<div class="ck-tooltips"><div class="tooltips-arrow"></div><div class="tooltips-title"></div><div class="tooltips-inner"></div></div>');
        this.$tips.addClass(this.options.placement).addClass(this.options.tipClass);
        //this.setTitle();
        this.setContent();
        this.isShow = false;
        this.$el = this.$tips;
        var triggers = this.options.trigger.split(' ');
        for (var i = 0, trigger; i < triggers.length; i++) {
            trigger = triggers[i];
            if (trigger === 'click') {
                this.$element.on(trigger + ".ck-tooltips", $.proxy(this.toggle, this));
            } else if (trigger !== 'manual') {
                var eventIn = trigger === 'hover' ? 'mouseenter' : 'focus';
                var eventOut = trigger === 'hover' ? 'mouseleave' : 'blur';
                this.$element.on(eventIn, $.proxy(this.show, this));
                this.$element.on(eventOut, $.proxy(this.hide, this));
            }
        }

        this.options.container ? this.$tips.appendTo(this.options.container) : this.$tips.insertAfter(this.$element);
        this.hide();
    };


    /**
     * 设置内容
     * @param {String} content - 内容
     */
    ToolTips.prototype.setContent = function (content) {
        content = $.trim(content || this.options.content);
        if (content.length === 0) {
            content = this.$element.attr('data-content') || "";
        }
        var $tips = this.$tips;
        $tips.find('.tooltips-inner').html(content);
    };

    /**
     * 定位
     */
    ToolTips.prototype.setPosition = function () {
        var pos = this.getOffset();
        this.$tips.css(pos);
    };

    /**
     * 获取定位偏移值
     * @return {Object} 
     */
    ToolTips.prototype.getOffset = function () {
        var placement = this.options.placement;
        //var container = this.options.container;
        var $element = this.$element;
        var $tips = this.$tips;
        var offset = $element.offset();
        var ew = $element.outerWidth();
        var eh = $element.outerHeight();
        var tw = $tips.outerWidth();
        var th = $tips.outerHeight();

        switch (placement) {
            case 'left':
                return { top: offset.top + eh / 2 - th / 2, left: offset.left - tw };
            case 'top':
                return { top: offset.top - th, left: offset.left + ew / 2 - tw / 2 };
            case 'right':
                return { top: offset.top + eh / 2 - th / 2, left: offset.left + ew };
            case 'bottom':
                return { top: offset.top + eh, left: offset.left + ew / 2 - tw / 2 };
        }
    };

    /**
     * 显示tips
     * @return {Void}
     */
    ToolTips.prototype.show = function () {
        if ($.trim(this.options.content).length === 0) {
            this.hide();
            return;
        }
        this.isShow = true;
        this.setPosition();
        this.$tips.show().addClass('in');
    };

    /**
     * 隐藏tips
     * @return {Void}
     */
    ToolTips.prototype.hide = function () {
        this.isShow = false;
        this.$tips.hide().removeClass('in');
    };

    /**
     * 切换
     * @return {Void}
     */
    ToolTips.prototype.toggle = function () {
        if (this.isShow) {
            this.hide();
        } else {
            this.show();
        }
        return false;
    };

    return ToolTips;
});
/**
 * util
 * @author vfasky <vfasky@gmail.com>
 * @version $Id$
 */
define('catke/util', function() {

    "use strict";

    /**
     * util
     * @exports module:catke/util
     * @author vfasky <vfasky@gmail.com>
     * @type {Object}
     */
    var exports = {
        /**
         * 返回ie版本
         * @return {Number}
         */
        ie: (function() {
            var undef,
                v = 3,
                div = document.createElement('div'),
                all = div.getElementsByTagName('i');

            while (
                div.innerHTML = '<!--[if gt IE ' + (++v) + ']><i></i><![endif]-->',
                all[0]
            );

            return v > 4 ? v : undef;
        }())
    };

    return exports;
});

/**
 * 表单验证
 * @module catke/validate
 * @author vfasky <vfasky@gmail.com>
 */	
define('catke/validate', 
  ['jquery', 'validator', 'catke/toolTips'], 
  function($, validator, ToolTips){
	"use strict";

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
	    //'isByteLength',
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

	/**
	 * 取验证实例
	 * @param {Mixed} rule 
	 */
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
	    if (false === $.isArray(rules)) {
	        return [getInstantiate(rules)(value), null, getInstantiate(rules).type];
	    }
	    if (2 === rules.length && $.type(rules[1]) === 'string') {
	        return [getInstantiate(rules[0])(value), rules[1], getInstantiate(rules[0]).type];
	    }
	    var res = [true];

	    $.each(rules, function(k, v) {
	        if ($.isArray(v)) {
	            if (v.length !== 2) {
	                throw new Error('validator rule fail');
	            }

	            if (false === getInstantiate(v[0])(value)) {
	                res = [false, v[1], getInstantiate(v[0]).type];
	                return false;
	            }

	        } else {
	            if (false === getInstantiate(v)(value)) {
	                res = [false, null, getInstantiate(v).type];
	                return false;
	            }
	        }
	    });
	    return res;
	};

	/**
	 * 验证表单
	 * @param {[type]} $el     [description]
	 * @param {[type]} options [description]
	 */
	var Validate = function($el, options){
		this.options = $.extend(Validate.DEFAULTS, options || {});
		this.rules = this.options.rules;
		this.$form = $el;
		this.init();
	};

	/**
     * 获取验证的元素
     * @return {Void} 
     */
    Validate.prototype.getFields = function () {
        this.fields = [];
        var self = this;
        this.$form.find('input[name], select[name], textarea[name]').filter(function () {
            return this.name in self.rules;
        }).each(function(){
        	self.fields.push($(this));
        });
    };

    Validate.prototype.init = function(){
    	var self = this;
    	this.getFields();
    	this.$form.on('focus', 'input[name], select[name], textarea[name]', function(){
    		self.hideError($(this));
    	});
    };

    /**
     * 验证表单
     * @return {[type]} [description]
     */
    Validate.prototype.valid = function(){
    	var res = true;
    	var data = this.getData();
    	var self = this;

    	$.each(this.fields, function(k, $el){
    		self.hideError($el);
       		var name = $el.attr('name');
    		var value = data[name];
    		var resData = check(value, self.rules[name]);
    		res = resData[0];
    		if(false === res){
    			var err = resData[1] || self.getDefErrMsg(resData[2]);
    			self.showError($el, err);
    		}
    		return res;
    	});
    	return res;
    };

    Validate.prototype.hideError = function($el){
    	$el.removeClass(this.options.errorClass);
    	var tip = $el.data('ckTip');

    	if(tip){
    		tip.hide();
    	}
    };

    Validate.prototype.showError = function($el, msg){
    	$el.addClass(this.options.errorClass);
    	var tip = $el.data('ckTip');
    	var self = this;

    	if(!tip){
    		tip = new ToolTips($el, {
    			//tipClass: 'danger',
    			placement: 'bottom',
    			trigger: 'manual',
    			content: '<i class="nicon nicon-warning"></i> ' + msg
    		});
    		tip.$tips.css({
    			zIndex: self.options.tipZindex
    		});
    		$el.data('ckTip', tip);
    	}
    	else{
    		tip.setContent('<i class="nicon nicon-warning"></i> ' + msg);
    	}
    	tip.show();
    };

    /**
     * 默认的错误提示
     * @param  {String} vType 
     * @return {String}       
     */
    Validate.prototype.getDefErrMsg = function(vType){
    	var msg = {
    		required: '这是一个必填项',
    		isEmail: '请正确填写邮箱',
    		isURL: '连接不合法',
    		isAlpha: '只容许字母',
    		isNumeric: '只容许数字',
    		isAlphanumeric: '只容许字母，数字，下划线',
    		isLength: '数值超出范围了',
    		isByteLength: '字符的长度与要求不符'
    	};

    	if(msg[vType]){
    		return msg[vType];
    	}

    	return '与要求不符';
    };

    /**
     * 取表单数据
     * @return {Object}
     */
    Validate.prototype.getData = function () {
        var data = {};
        var self = this;
        self.$form.find('input[name], select[name], textarea[name]').each(function () {
            var $el = $(this);
            if ($el.is('[type=checkbox]') === false && $el.is('[type=radio]') === false) {
                data[$el.attr('name')] = $.trim($el.val());
            }
            else if ($el.is('[type=radio]:checked')) {
                data[$el.attr('name')] = $.trim($el.val());
            }
            else if ($el.is('[type=checkbox]:checked')) {
                var name = $el.attr('name');
                if (!data[name]) {
                    data[name] = [];
                }
                data[name].push($el.val());
            }
        });
        return data;
    };

	/**
	 * 必填
	 */
	Validate.required = function() {
	    var rule = function(x) {
	        return $.trim(String(x || '')).length > 0;
	    };
	    rule.type = 'required';
	    rule.isInstantiate = true;
	    return rule;
	};

	/**
	 * 扩展验证方法
	 */
	$.each(_rules, function(k, v) {
	    Validate[v] = function() {
	    	var total = arguments.length;
	        var args = 1 <= total ? [].slice.call(arguments, 0) : [];

	        var rule = function(x) {
	        	if(total === args.length){
		            args.splice(0, 0, x);
	        	}	
	           	else{
	           		args[0] = x;
	           	} 
	            //console.log(validator, v);
	            return validator[v].apply(null, args);
	        };
	        rule.type = v;
	        rule.isInstantiate = true;
	        return rule;
	    };
	});

	/**
     * 默认参数
     * @type {Object}
     */
    Validate.DEFAULTS = {
        errorClass: 'error',
        rules: {},
        tipZindex: 10
    };

    return Validate;
});
;
define("catke", ["catke/http", "catke/placeholder", "catke/popTips", "catke/task", "catke/toolTips", "catke/util", "catke/validate"], function(_http, _placeholder, _popTips, _task, _toolTips, _util, _validate){
    return {
        "http" : _http,
        "placeholder" : _placeholder,
        "popTips" : _popTips,
        "Task" : _task,
        "ToolTips" : _toolTips,
        "util" : _util,
        "Validate" : _validate
    };
});