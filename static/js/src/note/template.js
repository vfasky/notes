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
