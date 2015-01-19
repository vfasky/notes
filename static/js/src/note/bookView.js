/**
 * 查看笔记本详情
 * @date 2015-01-18 10:18:02
 * @author vfasky <vfasky@gmail.com>
 */

define('note/bookView', ['note/view', 'note/api'],
    function(View, api) {
        "use strict";
        return View.extend({
            initialize: function($el, app) {
                this.superclass.initialize.call(this, $el, app);
            },
            run: function(context) {
                this.superclass.run.call(this, context);
                var self = this;

                if (false === this.validator.isMongoId(this.context.id)) {
                    return this.error('参数异常');
                }

                this.when(
                    this.initAnt('note/bookView.html'),
                    api.getBook(this.context.id),
                    api.getNote({
                        bookId: this.context.id
                    })
                ).done(function(ant, bookApi, noteApi) {
                    var book = bookApi.book;
                    var notes = noteApi.notes; 
                    if (null === book) {
                        return self.error('抱歉，没找到相关笔记本');
                    }
                    console.log(book, notes);

                });
            }
        });

    });
