/**
 * view
 * @module note/view
 * @author vfasky <vfasky@gmail.com>
 */
define('note/view', ['jquery', 'catke', 'note/template'],
    function($, catke, template) {
        "use strict";
        var http = catke.http;
        var classExt = catke.classExt;

        var View = function($el, app) {
            this.$el = $el;
            this.app = app;

            //模板引擎绑定
            this.template = template;
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

        View.prototype.initAnt = function(tplUrl, initArgs){
            var dtd = $.Deferred();
            var self = this;
           
            if(this.ant){
                dtd.resolve(this.ant);
            }
            else{
                this.template.load(tplUrl).done(function(html){
                    self.$el.html(html);
                    self.ant = self.template(self.$el, initArgs || {});
                    dtd.resolve(self.ant);
                });
            }
            
            return dtd.promise();
        };

        View.extend = function(definition) {
            return classExt.extend(View, definition);
        };

        return View;
    });
