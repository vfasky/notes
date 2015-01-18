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
