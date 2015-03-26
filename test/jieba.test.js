/**
 * 
 * @date 2015-02-14 15:52:44
 * @author vfasky <vfasky@gmail.com>
 */
"use strict";

var jieba = require('../app/lib/jieba');

describe('jieba', function() {

    it('extract', function(done){
        jieba.extract('小明硕士毕业于中国科学院计算所，后在日本京都大学深造', 100, function(err, tl){
            console.log(tl);
            done();
        });
    });

    it('tag', function(done){
        jieba.tag('非阻塞的南京市长江大桥', function(err, tl){
            console.log(tl);
            done();
        });
    });

    it('queryCut', function(done){
        jieba.queryCut('小明硕士毕业于中国科学院计算所，后在日本京都大学深造', function(err, tl){
            console.log(tl);
            done();
        });
    });

    it('cut', function(done){
        jieba.cut('小明硕士毕业于中国科学院计算所，后在日本京都大学深造', function(err, tl){
            console.log(tl);
            done();
        });
    });


});
