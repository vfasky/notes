"use strict";

var bcrypt = require('bcrypt');

/**
 * bcrypt 加密
 * @author vfasky <vfasky@gmail.com>
 * @date   2014-12-12
 * @param  {String} str 要加密的代码
 * @return {Function}
 */
exports.bhash = function (str) {
	return function(done){
		bcrypt.hash(str, 10, done);	
	};
};

/**
 * bcrypt 配对
 * @author vfasky <vfasky@gmail.com>
 * @date   2014-12-12
 * @param  {String} str 源代码
 * @param  {String} hash 加密后的代码
 * @return {Function}
 */
exports.bcompare = function (str, hash) {
	return function(done){
		bcrypt.compare(str, hash, done);
	};
};