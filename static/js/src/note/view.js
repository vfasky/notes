/**
 * view
 * @module note/view
 * @author vfasky <vfasky@gmail.com>
 */
define('note/view', ['jquery', 'catke'],
    function($, catke) {
        "use strict";
        var http = catke.http;
        var classExt = catke.classExt;

        var View = function($el, app) {
            this.$el = $el;
            this.app = app;

            //模板引擎绑定
            if (app.config.Template) {
                this.Template = app.config.Template;
            }

            //封装一个 promise 规范的http helper
            this.http = http;
        };


        View.prototype.when = function() {
            return $.when.apply(this, arguments);
        };

        View.prototype.run = function(context) {
            this.context = context;
        };

        View.prototype.destroy = function() {
            this.$el.remove();
        };

        View.extend = function(definition) {
            return classExt.extend(View, definition);
        };

        return View;
    });
