"use strict";

module.exports = exports = function(time) {
    return function (next) {
        setTimeout(function *(){
        	yield * next;
        }, time);
    };
};
