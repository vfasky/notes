"use strict";

var config = require('../config');
var assert = require('assert');
var path = require('path');

describe('read config', function() {
	it('rootPath', function(){
		assert.equal(config.rootPath, path.join(__dirname, '../'));
	});
});