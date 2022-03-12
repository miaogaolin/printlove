# 在线工具
1. [JSON转GO](https://printlove.cn/tools/json2go)
2. [SQL转GORM](https://printlove.cn/tools/sql2gorm)
3. [SQL转go-zero](https://printlove.cn/tools/sql2gozero)
4. [SQL转entgo](https://printlove.cn/tools/sql2ent)
5. [YAML转GO](https://printlove.cn/tools/yaml2go)
6. [XML转JSON](https://printlove.cn/tools/xml2json)
7. [SQL转ES](https://printlove.cn/tools/sql2es)
8. [SQL转MongoDB](https://printlove.cn/tools/sql2mongodb)

# 文章目录
所有文章都放置于 `/content/posts` 目录，所有子目录含义如下：

* books：图书分享
* docker：docker 相关文章
* english：英语相关文章
* go：Golang 零碎知识点
* gobasic：[《Go基础系列》](https://printlove.cn/categories/go%E5%9F%BA%E7%A1%80%E7%B3%BB%E5%88%97/)
* linux：Linux 相关文章
* tool：工具使用分享，例如：编辑器
* web：前端
* ms：[《深入微服务》](https://printlove.cn/categories/%E6%B7%B1%E5%85%A5%E5%BE%AE%E6%9C%8D%E5%8A%A1/)系列文章
* me：关于我

# Hugo 文件
>该博客使用 hugo 生成静态文件。
>
index.md 文件开头必须填写如下信息:
* title 文章标题
* date 时间
* draft 是否草稿，发布时填写为 false（默认），如果为 true，则不可访问
* categories 分类
* tags 标签，对应 meta 的 keywords
* description 文章描述,不写默认截取文章内容
* notshow 为 true 则不显示在列表，但可以通过链接访问
* featured 为 true 标记为精选文章
* url 自定义访问地址

举例如下：
```
---
title: "实现HTML元素垂直居中的六种方法"
date: 2021-10-06T10:47:56+08:00
categories: ["前端"]
tags: ["css"]
---
```