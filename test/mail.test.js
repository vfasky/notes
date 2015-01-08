/**
 * 
 * @date 2015-01-08 13:58:06
 * @author vfasky <vfasky@gmail.com>
 */
"use strict";

var mail = require('../app/lib/mail');

describe('mail', function() {
    /*
     * it('mailgun', function(done){
     *     mailgun({
     *         to: 'vfasky@me.com',
     *         title: 'note test',
     *         html: '<h3>hello</h3>'
     *     })(done);
     * });
     */

    it('default', function(done){
        mail({
            to: 'vfasky@me.com',
            title: 'note test - default',
            html: '<h3>default send</h3>'
        })(done);
    });
});
