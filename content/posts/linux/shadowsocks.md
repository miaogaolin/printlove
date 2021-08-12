---
title: "shadowsocks 最简搭建"
date: 2021-08-12T16:18:56+08:00
draft: false
categories: ["linux"]
tags: ["shadowsocks"]
description: "shadowsocks 服务端和客户端的搭建"
---

shadowsocks 服务端安装在 Linux 下， 客户端在 Windows 下。

## 安装服务端

```shell
# 第一步
wget –no-check-certificate https://raw.githubusercontent.com/teddysun/shadowsocks_install/master/shadowsocks.sh
# 第二步
chmod +x shadowsocks.sh
# 第三步
./shadowsocks.sh 2>&1 | tee shadowsocks.log
```

## 重要文件位置

### 1. 配置文件
```
/etc/shadowsocks.json
```

### 2. 日志文件
作用：可查看客户端访问的所有请求

```
/var/log/shadowsocks.log
```

## 多用户
不同用户可以访问不同的端口，针对不同端口设置密码。
```json
{
    "server":"0.0.0.0",
    "local_address": "127.0.0.1",
    "local_port":1080,
    "port_password":{
         "8989":"password0",
         "9001":"password1",
         "9002":"password2",
         "9003":"password3",
         "9004":"password4"
    },
    "timeout":300,
    "method":"aes-256-cfb",
    "fast_open": false
}
```

 
## 命令
对 shadowsocks 服务进行启动、重启、停止。
```
/etc/init.d/shadowsocks start|restart|stop
```

***
## 客户端安装
[下载地址](https://github.91chifun.workers.dev/https://github.com//shadowsocks/shadowsocks-windows/releases/download/4.2.1.0/Shadowsocks-4.2.1.0.zip)

windows客户端注意点，如图：

![](../images/ss1.png)

* 全局模式：表示抓取windows上的所有请求

* PAC模式：配置指定的网站经过代理。

PAC文件编辑，如果你不能访问哪个网站，可在如下图增加一行：

![](../images/ss2.png)