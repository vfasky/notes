/**
 * util
 * @author vfasky <vfasky@gmail.com>
 * @version $Id$
 */
define('catke/util', function() {

    "use strict";

    /**
     * util
     * @exports module:catke/util
     * @author vfasky <vfasky@gmail.com>
     * @type {Object}
     */
    var exports = {
        /**
         * 返回ie版本
         * @return {Number}
         */
        ie: (function() {
            var undef,
                v = 3,
                div = document.createElement('div'),
                all = div.getElementsByTagName('i');

            while (
                div.innerHTML = '<!--[if gt IE ' + (++v) + ']><i></i><![endif]-->',
                all[0]
            );

            return v > 4 ? v : undef;
        }())
    };

    return exports;
});
