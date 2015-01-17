/**
 * 封装http请求
 * @module catke/http
 * @author vfasky <vfasky@gmail.com>
 */
define('catke/http', ['jquery', 'catke/popTips'], function($, popTips) {
    "use strict";

    var ajax = function(type, url, data, contentType) {

        var dtd = $.Deferred();

        if (contentType && contentType.indexOf('json') !== -1) {
            data = JSON.stringify(data);
        }

        contentType = contentType || 'application/x-www-form-urlencoded; charset=UTF-8';

        $.ajax(url, {
            type: type,
            cache: false,
            data: data || {},
            dataType: 'json',
            contentType: contentType
        }).done(function(ret) {
            if (ret.state === false) {
                popTips.error(ret.error || '发生未知错误');
                if (ret.url) {
                    setTimeout(function() {
                        window.location.href = ret.url;
                    }, 800);
                }
            } else {
                dtd.resolve(ret);
            }
        }).fail(function() {
            popTips.error('服务端发生错误了');
            dtd.reject();
        });
        return dtd.promise();
    };

    var undef;

    var exports = {
        get: function(url, data, isJson) {
            var contentType = false;
            if (isJson !== undef) {
                contentType = 'application/json;charset=utf-8';
            }
            return ajax('GET', url, data, contentType);
        },
        post: function(url, data, isJson) {
            var contentType = false;
            if (isJson !== undef) {
                contentType = 'application/json;charset=utf-8';
            }
            return ajax('POST', url, data, contentType);
        },
        put: function(url, data, isJson) {
            var contentType = false;
            if (isJson !== undef) {
                contentType = 'application/json;charset=utf-8';
            }
            return ajax('PUT', url, data, contentType);
        },
        head: function(url, data, isJson) {
            var contentType = false;
            if (isJson !== undef) {
                contentType = 'application/json;charset=utf-8';
            }
            return ajax('HEAD', url, data, contentType);
        },
        del: function(url, data, isJson) {
            var contentType = false;
            if (isJson !== undef) {
                contentType = 'application/json;charset=utf-8';
            }
            return ajax('DELETE', url, data, contentType);
        }
    };

    return exports;
});
