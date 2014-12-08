
"use strict";

var assert = require('assert');
var model = require('../app/model');


describe('model user role', function() {

    var roles = [];

    before(function(done){
    	var role = new model.Role({
    		code: 'testA',
    		description: '测试角色1'
    	});

    	role.save(function(err, role){
    		if(err){
    			return done(err);
    		}
    		roles.push(role);	
    		done();
    	});	
    });

   
    before(function(done){
    	var role = new model.Role({
    		code: 'testB',
    		description: '测试角色2'
    	});

    	role.save(function(err, role){
    		if(err){
    			return done(err);
    		}
    		roles.push(role);	
    		done();
    	});	
    });

    describe('model user add role', function() {
    	var user = new model.User({
    		name: 'test',
    		email: 'test@mail.com',
    		active: true
    	});

    	it('set roles', function(done){
    		user.setRoles(roles);
    		user.save(done);
    	});

    	it('get roles', function(done){
    		user.getRoles().addBack(function(err, roles){
    			if(err){
    				return done(err);
    			}
    			var hit = 0;

    			roles.forEach(function(v){
    				if(v.code === 'testA' || v.code === 'testB'){
    					hit++;
    				}
    			});

    			assert.equal(2, hit);
    			done();
    		});
       	});

    	after(function(done){
    		user.remove(done);	
    	});

    	after(function(){
    		roles.forEach(function(role){
    			role.remove();	
    		});
    	});
    });
});