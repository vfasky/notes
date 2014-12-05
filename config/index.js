/**
 * 配置
 * @module config
 * @author vfasky <vfasky@gmail.com>
 */

"use strict";

var fs = require('fs');
var path = require('path');
var _ = require('lodash');

/**
 * 默认配置
 * @type {Object}
 */
var defaultConfig = JSON.parse(fs.readFileSync(
    path.join(__dirname, 'default.json')
), 'utf8');

/**
 * 用户配置
 * @type {Object}
 */
var userConfig = {};
var configPath = path.join(__dirname, 'user.json');
if (fs.existsSync(configPath)) {
    userConfig = JSON.parse(fs.readFileSync(configPath), 'utf8');
}

/**
 * 配置文件
 * @type {Object}
 */
var config = _.extend(
    defaultConfig,
    userConfig
);

/**
 * app 根目录
 * @type {String}
 */
config.rootPath = path.join(__dirname, '../');


module.exports = config;
