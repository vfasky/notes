/**
 * app 入口
 * @module note/main
 * @author vfasky <vfasky@gmail.com>
 */
define('note/main', ['note/app'],
    function(App) {
        "use strict";
        return function($el) {
            var app = new App($el, {
                Template: null
            });

            app.route('/', 'note/book')
                .run();
        };
    });
