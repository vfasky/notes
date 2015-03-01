/**
 *
 * @date 2015-01-17 22:46:35
 * @author vfasky <vfasky@gmail.com>
 */

define('note/api', ['jquery', 'catke'], function($, catke) {
    "use strict";

    var http = catke.http;
    var apiUri = '/api/v1/';

    var exports = {
        getBook: function(id) {
            return http.get(apiUri + 'book', {
                id: id || ''
            });
        },
        getNote: function(data){
            return http.get(apiUri + 'note', data || {});
        }
    };

    return exports;
});

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
                this.initAnt('note/book.html'),
                api.getBook()
            ).done(function(ant, res){

                ant.render({
                    books: res.books
                });
            });
        }
    });
});

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

/**
 * app 入口
 * @module note/main
 * @author vfasky <vfasky@gmail.com>
 */
define('note/main', ['note/app'],
    function(App) {
        "use strict";
        return function($el) {
            var app = new App($el);

            app.route('/', 'note/book')
               .route('/book', 'note/bookView')
               .run();
        };
    });

/**
 * router
 * @module cepin/router
 * @author kotenei <kotenei@qq.com>
 */
define('note/route', ['jquery'], function($) {
    "use strict";

    /**
     * 事件处理
     * @type {Object}
     */
    /*
     * var eventHelper = {
     *     addEventListener: function(element, type, handle) {
     *         if (element.addEventListener) {
     *             element.addEventListener(type, handle, false);
     *         } else if (element.attachEvent) {
     *             element.attachEvent("on" + type, handle);
     *         } else {
     *             element["on" + type] = handle;
     *         }
     *     },
     *     removeEventListener: function(element, type, handle) {
     *         if (element.removeEventListener) {
     *             element.removeEventListener(type, handle, false);
     *         } else if (element.detachEvent) {
     *             element.detachEvent("on" + type, handle);
     *         } else {
     *             element["on" + type] = null;
     *         }
     *     },
     *     proxy: function(fn, thisObject) {
     *         var proxy = function() {
     *             return fn.apply(thisObject || this, arguments);
     *         };
     *         return proxy;
     *     }
     * };
     */

    /**
     * 路由
     */
    var Router = function() {
        this._routes = [];
    };

    /**
     * 初始化
     * @return {Void}
     */
    Router.prototype.init = function() {
        var self = this;
        $(window).on('hashchange', function(){
            self.listener.apply(self, arguments);
        });
        //eventHelper.addEventListener(window, 'hashchange', eventHelper.proxy(self.listener, this));
        this.listener();
    };


    /**
     * 监听hash变化
     * @return {Void}
     */
    Router.prototype.listener = function() {
        var paths = location.hash.slice(1).split('?');
        var path = paths[0],
            params;

        if (paths[1]) {
            params = this.getUrlParams(paths[1]);
        }

        var route = this.getRoute(path);
        var values, ret = {};

        if (!route) {
            location.replace('#/');
            return;
        }

        values = this.getValues(path, route);

        for (var i = 0; i < route.params.length; i++) {
            ret[route.params[i]] = values[i];
        }

        params = $.extend({}, ret, params);
        route.handle(params);
    };

    /**
     * 取URL参数  param1=value1&param2=value2
     * @param  {String} str  - 带参数的字符串
     */
    Router.prototype.getUrlParams = function(str) {
        var params = {};
        if (!str) {
            return params;
        }
        var arrStr = str.split('&');
        for (var i = 0, arrParams; i < arrStr.length; i++) {
            arrParams = arrStr[i].split('=');
            params[arrParams[0]] = arrParams[1];
        }
        return params;
    };

    /**
     * 设置路由
     * @param  {String} routeUrl  - 路由地址
     * @param  {Object} constraints - 正则约束
     * @return {Object}
     */
    Router.prototype.map = function(routeUrl, constraints, callback) {
        var reg, pattern, result, params = [];
        pattern = routeUrl.replace(/\//g, '\\/');

        if (typeof constraints === 'function') {
            callback = constraints;
            constraints = null;
        }

        if (constraints) {
            for (var k in constraints) {
                reg = new RegExp('\\{' + k + '\\}', 'g');
                pattern = pattern.replace(reg, '(' + constraints[k].replace(/\^/, '').replace(/\$/, '') + ')');
                params.push(k);
            }
        }

        //(?<={)[^}]+(?=}) js不支持零宽断言-_-b
        reg = new RegExp('{([^}]+)}', 'g');
        //result;
        while ((result = reg.exec(pattern)) !== null) {
            params.push(result[1]);
            reg.lastIndex;
        }

        pattern = '^' + pattern.replace(/{[^}]+}/gi, '(.+)') + '$';

        this._routes.push({
            routeUrl: routeUrl,
            pattern: pattern,
            params: params,
            handle: callback || function() {}
        });

        return this;
    };

    /**
     * 获取参数值
     * @param  {String} path  - 路径
     * @param  {Object} route - 路由相关信息
     * @return {Array}
     */
    Router.prototype.getValues = function(path, route) {
        var route, values = [];

        if (path.length === 0) {
            return values;
        }

        route = route || this.getRoute(path);

        if (route !== null) {
            var matches = path.match(route.pattern);
            if (matches.length !== 0) {
                for (var i = 1; i < matches.length; i++) {
                    values.push(matches[i]);
                }
            }
        }
        return values;
    };

    /**
     * 获取匹配路由
     * @param  {String} path - 路径
     * @return {Object}
     */
    Router.prototype.getRoute = function(path) {
        for (var i = 0; i < this._routes.length; i++) {
            if (new RegExp(this._routes[i].pattern).test(path)) {
                return this._routes[i];
            }
        }
        return null;
    };

    return Router;
});

/**
 * 模板引擎
 * @module note/template
 * @author vfasky <vfasky@gmail.com>
 */
define('note/template', ['ant', 'jquery'], function(Ant, $) {
    "use strict";

    var template;
    template = function($el, options) {
        options = $.extend({
            filters: template.filters
        }, options || {});
        return new Ant($el, options);
    };

    template.filters = {
        String: String,
        Number: Number
    };

    template.load = function(uri){
        var dtd = $.Deferred();
        var data = uri.split('/');
        if(data.length !== 2 || data[1].indexOf('.html') === -1){
            dtd.reject('tpl uri error : ' + uri);
        }
        else{
            require(['tpl/' + data[0]], function(tpls){
                dtd.resolve(tpls[data[1]]);
            });
        }
        
        return dtd.promise();

    };

    return template;
});

/**
 * view
 * @module note/view
 * @author vfasky <vfasky@gmail.com>
 */
define('note/view', ['jquery', 'catke', 'note/template', 'validator'],
    function($, catke, template, validator) {
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

            this.validator = validator;
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

        View.prototype.error = function(err){
            catke.popTips.error(err || '发生未知错误', function(){
                if(window.history.length === 0){
                    window.location.href = '#/';
                }
                else{
                    window.history.back();
                }
            }, 3000);

        };

        View.extend = function(definition) {
            return classExt.extend(View, definition);
        };

        return View;
    });

;
define("note", ["note/api", "note/app", "note/book", "note/bookView", "note/main", "note/route", "note/template", "note/view"], function(_api, _app, _book, _bookView, _main, _route, _template, _view){
    return {
        "Api" : _api,
        "App" : _app,
        "Book" : _book,
        "BookView" : _bookView,
        "main" : _main,
        "Route" : _route,
        "Template" : _template,
        "View" : _view
    };
});