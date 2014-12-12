"use strict";

var util = require('../app/lib/util');
var assert = require('assert');


describe('util', function() {
	it('bcrypt', function(){

		util.bhash('vfasky')(function(err, has){
			util.bcompare('vfasky', has)(function(err, is){
				assert.equal(true, is);
			});
		});	

	});
});