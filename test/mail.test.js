/**
 * 
 * @date 2015-01-08 13:58:06
 * @author vfasky <vfasky@gmail.com>
 */
"use strict";


var mail = require('../app/lib/mail');

describe('mail', function() {
    it('default', function(done){
        mail({
            to: 'vfasky@me.com',
            title: 'note test - default',
            html: '<h3>default send</h3>'
        })(function(err, res){
            if(!err || err.message === 'Message limit reached.'){
                return done();
            }
            done(err, res);
        });
    });
});

