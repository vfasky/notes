"use strict";

// 载入模块
var Segment = require('segment').Segment;
// 创建实例
var segment = new Segment();

var _ = require('lodash');

segment.useDefault();

module.exports = function(text) {
    var keywords = {};

    var skips = [
        2048, //标点符号
        8192, //的,了
        4194304, //百份比
        65536, //这些
    ];

    var addKeyword = function(word) {
        if (keywords[word]) {
            keywords[word] ++;
        } else {
            keywords[word] = 1;
        }
    };

    var isWriteBook = false;
    var writeBookTotal = 0;
    var writeBookTemp = [];

    _.each(segment.doSegment(text), function(v) {
        if (v.w.length < 2 && v.w !== '《' && v.w !== '》') {
            return;
        }
        if (!v.p) {
            addKeyword(v.w);
        } else if (skips.indexOf(v.p) === -1) {
            addKeyword(v.w);
        }

        //写入书名
        if (v.w === '《') {
            isWriteBook = true;
            writeBookTotal = 0;
            writeBookTemp = [];
        } else if (v.w === '》') {
            isWriteBook = false;
            if (writeBookTemp.length > 0) {
                addKeyword(writeBookTemp.join(''));
            }
        } else if (isWriteBook) {
            writeBookTotal++;
            if (writeBookTotal > 20) {
                isWriteBook = false;
                return;
            }
            writeBookTemp.push(v.w);
        }
    });

    return keywords;
};
