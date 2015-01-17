/**
 * 
 * @date 2015-01-17 22:46:35
 * @author vfasky <vfasky@gmail.com>
 */

define('note/api', ['jquery', 'catke'], function($, catke){
    "use strict";
    
    var http = catke.http;
    var apiUri = '/api/v1/';

    var exports = {
        getBooks: function(page, pageSize){
            return http.get(apiUri + 'book', {
                page: page || 1,
                pageSize: pageSize || 10
            });
        }
    };

    return exports;
});
