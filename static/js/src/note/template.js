/**
 * 模板引擎
 * @module site/template
 * @author vfasky <vfasky@gmail.com>
 */
define('site/template', ['ant'], function(Ant) {
    "use strict";

    var filters = {};

    filters.String = String;
    filters.Number = Number;

    return Ant.extend({
        defaults: {
            filters: filters
        }
    }, {
        load: function(uri) {
            console.log(uri);
        }
    });
});
