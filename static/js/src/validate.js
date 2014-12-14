/**
 * 表单验证
 * @module catke/validate
 * @author vfasky <vfasky@gmail.com>
 */	
define('catke/validate', 
  ['jquery', 'validator', 'catke/tooltips'], 
  function($, validator, Tooltips){
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
    		tip = new Tooltips($el, {
    			//tipClass: 'danger',
    			placement: 'bottom',
    			trigger: 'manual',
    			content: msg
    		});
    		tip.$tips.css({
    			zIndex: self.options.tipZindex
    		});
    		$el.data('ckTip', tip);
    	}
    	else{
    		tip.setContent(msg);
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
	        var args = 1 <= arguments.length ? [].slice.call(arguments, 0) : [];

	        var rule = function(x) {	
	            args.splice(0, 0, x);
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