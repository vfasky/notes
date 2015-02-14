/**
 * Created by vfasky on 15/2/14.
 */
"use strict";

var nodejieba = require('nodejieba');
var path = require('path');
var _ = require('lodash');

var jiebaDictPath = path.join(__dirname, '../../node_modules/nodejieba/dict');

var isLoadDict = {};

/**
 * 加载词典
 *
 * @param {String} type 类型
 * @return {Void}
 */
var loadDict = function(type){
    if(isLoadDict[type]){
        return;
    }
    switch(type){
        case 'extract':
            nodejieba.keywordLoadDict(
                path.join(jiebaDictPath, 'jieba.dict.utf8'),
                path.join(jiebaDictPath, 'hmm_model.utf8'),
                path.join(jiebaDictPath, 'idf.utf8'),
                path.join(jiebaDictPath, 'stop_words.utf8'),
                path.join(jiebaDictPath, 'user.dict.utf8')
            );
            break;

        case 'tag':
            nodejieba.taggerLoadDict(
                path.join(jiebaDictPath, 'jieba.dict.utf8'),
                path.join(jiebaDictPath, 'hmm_model.utf8'),
                path.join(jiebaDictPath, 'user.dict.utf8')
            );
            break;

        case 'cut':
            nodejieba.loadDict(
                path.join(jiebaDictPath, 'jieba.dict.utf8'),
                path.join(jiebaDictPath, 'hmm_model.utf8'),
                path.join(jiebaDictPath, 'user.dict.utf8')
            );
            break;

        case 'queryCut':
            nodejieba.queryLoadDict(
                path.join(jiebaDictPath, 'jieba.dict.utf8'),
                path.join(jiebaDictPath, 'hmm_model.utf8'),
                4
            );
            break;

    }

    isLoadDict[type] = true;
};

module.exports = exports = {
    extract: function(text, len, done){
        loadDict('extract');

        nodejieba.extract(text, len, function(lt){
            done(null, lt);
        });
    },
    tag: function(text, done){
        loadDict('tag');

        nodejieba.tag(text, function(ls){
            if(_.isArray(ls)){
                done(null, _.map(ls, function(v){
                    return v.split(':');
                }));
            }
            else{
                done(null, []);
            }
        });
    },
    queryCut: function(text, done){
        loadDict('queryCut');
        
        nodejieba.queryCut(text, function(ls){
            done(null, ls);
        });
    },
    cut: function(text, done){
        loadDict('cut');
        
        nodejieba.cut(text, function(ls){
            done(null, ls);
        });
    }

};
