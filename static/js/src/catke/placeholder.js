/**
 * placeholder
 * @date 2014-11-10 15:22:41
 * @author vfasky <vfasky@gmail.com>
 * @version $Id$
 */
define('catke/placeholder', ['jquery', 'catke/util', 'catke/task'], function($, util, Task) {
    "use strict";

    if (!util.ie || util.ie > 9) {
        return function() {};
    }

    var id = 0;

    var Widget = function($el, config) {
        var self = this;
        this.id = id;
        id++;
        this.$el = $el;
        this.config = $.extend({
            color: '#999'
        }, config || {});
        this.$tip = this.build();
        this.set(this.$el.attr('placeholder'));
        this.buildCss();


        if (this.isHidden()) {
            new Task(function(task) {
                if (false === self.isHidden()) {
                    self.setPostion();
                    //self.buildCss();
                    task.remove();
                }
            });
        }

        this.$parent = this.$el.parent();

        if (this.$parent.css('position') === 'static') {

            this.$parent.css('position', 'relative');
        }


        this.setPostion();

        this.$tip.insertAfter(this.$el).click(function() {
            self.$el.focus();
        });
        this.$el.on('blur change', function() {
            if ($.trim(self.$el.val()) === '') {
                self.$tip.show();
            } else {
                self.$tip.hide();
            }
        }).on('focus', function() {
            self.$tip.hide();
        });

        if ($.trim(this.$el.val()) !== '') {
            self.$tip.hide();
        }

        $(window).on('resize.placeholder' + this.id + ', scroll.placeholder' + this.id, function() {
            if (false === self.isHidden()) {
                self.setPostion();
            }
        });


    };

    Widget.prototype.isHidden = function() {
        return false === this.$el.is(':visible');
    };

    Widget.prototype.setPostion = function() {
        var position = this.$el.position();
        this.$tip.css(position);
    };

    Widget.prototype.set = function(val) {
        this.$tip.text(val);
        if ($.trim(this.$el.val()) !== '') {
            this.$tip.hide();
        }
    };

    Widget.prototype.build = function() {

        var $el = $('<span></span>');

        return $el;
    };

    Widget.prototype.buildCss = function() {
        var self = this;
        var height = self.$el.outerHeight();

        this.$tip.css({
            color: self.config.color,
            fontSize: self.$el.css('fontSize') || '12px',
            padding: self.$el.css('padding') || '0',
            paddingTop: 0, //self.$el.css('paddingTop'),
            paddingLeft: self.$el.css('paddingLeft'),
            margin: self.$el.css('margin') || '0',

            width: self.$el.outerWidth(),
            height: height,
            lineHeight: height + 'px',
            position: 'absolute'
        });
    };


    return function($els) {
        $els = $els || $('[placeholder]');

        $els.each(function() {
            var $el = $(this);
            var widget = $el.data('placeholder');
            if (!widget) {
                widget = new Widget($el);
                $el.data('placeholder', widget);
            } else if (widget.set) {
                widget.set($el.attr('placeholder'));
                //widget.setPostion();
                //widget.buildCss();
            }
        });
    };
});
