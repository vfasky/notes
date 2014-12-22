一个写笔记的web应用
=============================

[![Build Status](https://img.shields.io/travis/vfasky/notes.svg?style=flat-square)](https://travis-ci.org/vfasky/notes) 
[![Coverage Status](https://img.shields.io/coveralls/vfasky/notes.svg?style=flat-square)](https://coveralls.io/r/vfasky/notes?branch=master)

使用 koa


### 创建配置文件

打开 `config` 文件夹， 新建 `user.json`， 并添加以下内容

```json
{
	"superUserEmail": "your email"
}
```

## 开发环境

### 安装

```
npm install notes.catke
```

### 测试

```
make install & make test
```



## 部署

### 安装

```
npm install notes.catke
npm install --production
```

