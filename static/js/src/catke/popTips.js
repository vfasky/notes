/**
 * 弹出提示模块
 * @date 2014-09-10
 * @author kotenei <kotenei@qq.com>
 */
define('catke/popTips', ['jquery'], function($) {
    "use strict";

    /**
     * 弹出提示模块
     * @exports module:catke/popTips
     * @type {Object}
     * @example
     *     require(['catke'], function(catke){
     *         catke.popTips.success('成功');
     *         catke.popTips.error('error');
     *     });
     */
    var popTips = function(){

        var $tips, tm;

        var build = function (status, content, delay, callback) {

            if (tm) {
                clearTimeout(tm);
            }

            if ($.isFunction(delay)) {
                callback = delay;
                delay = 3000;
            }

            callback = callback || function() {};
            delay = delay || 3000;

            if ($tips) {
                $tips.stop().remove();
            }

            $tips = $(getHtml(status, content))
                .appendTo(document.body).hide();

            $tips.css({
                marginLeft: -($tips.width() / 2),
                marginTop: -($tips.height() / 2)
            }).fadeIn('fase', function() {
                tm = setTimeout(function() {
                    $tips.stop().remove();
                    callback();
                }, delay);
            });
        };

        var getHtml = function (status, content) {
            var html = [];
            switch (status) {
                case "success":
                    html.push('<div class="ck-poptips success"><i class="nicon nicon-success"></i>' + content + '</div>');
                    break;
                case "error":
                    html.push('<div class="ck-poptips error"><i class="nicon nicon-error"></i>' + content + '</div>');
                    break;
                case "warning":
                    html.push('<div class="ck-poptips warning"><i class="nicon nicon-warning"></i>' + content + '</div>');
                    break;
            }
            return html.join('');
        };

        return {
            success: function(content, callback, delay) {
                build("success", content, callback, delay);
            },
            error: function(content, callback, delay) {
                build("error", content, callback, delay);
            },
            warning: function(content, callback, delay) {
                build("warning", content, callback, delay);
            }
        };
    };

    return popTips();
});
