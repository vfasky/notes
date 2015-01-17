/**
 * doc
 * @module note/book
 * @author vfasky <vfasky@gmail.com>
 */ 
define('note/book', ['note/view', 'note/api'], function(View, api){
    "use strict";
    return View.extend({
        initialize: function($el, app) {
            this.superclass.initialize.call(this, $el, app);
        },
        run: function(context){
            this.superclass.run.call(this, context);

            this.when(
                this.initAnt('note/book.html', {
                    data:{
                        books: []
                    }
                }),
                api.getBooks()
            ).done(function(ant, res){

                ant.render({
                    books: res.books
                });
            });
        }
    });
});
