/**
 * doc
 * @module note/book
 * @author vfasky <vfasky@gmail.com>
 */	
define('note/book', ['note/view'], function(View){
	"use strict";
	return View.extend({
		initialize: function($el, app) {
            this.superclass.initialize.call(this, $el, app);
        },
		run: function(context){
			this.superclass.run.call(this, context);
		}
	});
});