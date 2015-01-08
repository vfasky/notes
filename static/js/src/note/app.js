/**
 * web App 框架
 * @module note/app
 * @author vfasky <vfasky@gmail.com>
 */
define('note/app', ['jquery', 'note/route', 'catke'],
    function($, Route, catke) {
        "use strict";

        var popTips = catke.popTips;
        var Loading = catke.Loading;
        var classExt = catke.classExt;

        var loading = new Loading({
            tip: '加载中 ... '
        });

        var App = function($el, config) {
            //路由绑定
            this._route = {};
            //当前view
            this._view = null;

            //绑定事件绑定
            this.addEvent('viewBeforeShow');
            this.addEvent('viewAfterShow');

            //app 容器
            this.$el = $el;
            //配置
            this.config = $.extend({
                viewClass: 'app-view',
                Template: null
            }, config || {});

            //加载效果
            this.loading = loading;
            //提示效果
            this.popTips = popTips;
        };

        App.prototype = classExt.extendProto(classExt.ClassEvent.prototype);

        App.prototype.callView = function(viewName, context, callback) {
            var self = this;
            var $el;

            this.callEvent('viewBeforeShow', viewName);

            callback = callback || function() {};
            //完成时回调
            var complete = function(view) {
                callback();
                self.callEvent('viewAfterShow', view);
            };

            if (self._view !== null) {
                //已经加载，刷新
                if (self._view.name === viewName) {
                    self._view.instance.run(context);
                    complete(self._view.instance);
                    return;
                }
                //销毁旧view
                else {
                    var oldView = self._view.instance;
                    oldView.destroy();
                }
            }

            self.loading.show();

            var callView = function(View) {
                self.loading.hide();
                $el = $('<div class="' + self.config.viewClass + '"></div>');

                var view = new View($el, self);
                view.run(context);

                self._view = {
                    name: viewName,
                    instance: view
                };

                view.$el.appendTo(self.$el);

                complete(self._view.instance);
            };

            if (typeof(viewName) === 'string') {
                //调度view
                var _require = window.requirejs || window.require;
                _require([viewName], function(View) {
                    callView(View);
                });
            } else {
                callView(viewName);
            }
        };

        /**
         * 注册路由
         *
         * @param {String} path - 路径名
         * @param {String} viewName - 视图名
         * @return {Void}
         */
        App.prototype.route = function(path, constraints, viewName) {
            if (viewName === undefined) {
                viewName = constraints;
                constraints = {};
            }
            this._route[path] = [constraints, viewName];
            return this;
        };

        App.prototype.url = function(viewName) {
            viewName = $.trim(viewName);
            for (var k in this._route) {
                var v = this._route[k];
                if (viewName === v[1]) {
                    return k;
                }
            }
        };

        //启动app
        App.prototype.run = function() {
            var self = this;

            var route = new Route();

            var addPath = function(path){
                var info = self._route[path];
                route.map(path, info[0], function(params) {
                    self.callView(info[1], params || {});
                });
            };

            for (var path in self._route) {
                addPath(path);
            }
            route.init();
        };

        return App;
    });
