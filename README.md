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


# 文章编写

例如，你想下一篇 Goroutine 的文章，就可以在 go 目录下创建如下：
* go
    * goroutine
        * index.md
        * 1.jpg

如果有图片资源，直接放在 goroutine 目录下，index.md 是你编写的文章。引用图片时，使用相对路径。

index.md 文件开头必须填写如下信息:
* title 文章标题
* date 时间
* draft 是否草稿，发布时填写为 false
* categories 分类
* tags 标签
* description 文章描述

举例如下：
```
---
title: "实现HTML元素垂直居中的六种方法"
date: 2021-10-06T10:47:56+08:00
draft: false
categories: ["前端"]
tags: ["css"]
description: "实现HTML元素垂直居中的六种方法"
---
```