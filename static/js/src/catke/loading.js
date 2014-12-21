/**
 * loading
 * @date 2014-11-11 16:33:41
 * @author vfasky <vfasky@gmail.com>
 * @version $Id$
 */

define('catke/loading', ['jquery'], function($){
    "use strict";
    
    var tpl = '<div class="ck-tooltips success"> <span> </span> </div>';

    var Loading = function(config){
        this.config = $.extend({
            tip: 'loading ...'
        }, config || {});

        this.$el = $(tpl).hide();
        this.$el.find('span').html(this.config.tip);

        this.$el.appendTo($('body'));
        this.$el.css({ marginLeft: -(this.$el.width() / 2), marginTop: -(this.$el.height() / 2) });
    };

    Loading.prototype.show = function(){
        this.$el.show();
        return this;
    };

    Loading.prototype.hide = function(){
        this.$el.hide();
        return this;
    };

    Loading.prototype.remove = function(){
        this.$el.remove();
        return this;
    };

    return Loading;
});