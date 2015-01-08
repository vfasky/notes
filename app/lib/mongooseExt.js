"use strict";

var mongoose = require('mongoose');
var MPromise = mongoose.Promise;

module.exports = exports = function(Schema) {
    Schema.methods.saveAsync = function() {
        var self = this;
        var promise = new MPromise();

        self.save(function(err, data) {
            if (err) {
                return promise.reject(err);
            }
            promise.resolve(null, data);
        });

        return promise;
    };

    Schema.methods.removeAsync = function() {
        var self = this;
        var promise = new MPromise();

        self.remove(function(err, data) {
            if (err) {
                return promise.reject(err);
            }
            promise.resolve(null, data);
        });

        return promise;    
    };
};
