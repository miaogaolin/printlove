---
title: "Vercel + Notion 建个人博客"
date: 2021-12-17
url: vercel-notion
categories: ["工具"]
tags: ["Vercel", "Notion", "博客"]
keywords: ["Vercel", "Notion"]
description: "以 Notion 为后台，建造一个免费的博客，不需要服务器。"
---
大家好，我是 “潇洒哥老苗”。

今天我带大家创建一个站，不需要购买服务器，只需要掏钱买个自己喜欢的域名即可。

## 涉及

- Vercel：免费静态网站托管

- Notion：内容后台

- CloudFlare：CDN 加速

- 域名

- nextjs-notion-starter-kit：以 Notion 为后台的网站

## nextjs-notion-starter-kit

地址：[https://github.com/transitive-bullshit/nextjs-notion-starter-kit](https://github.com/transitive-bullshit/nextjs-notion-starter-kit)

### 1. fork

打开该网址，然后 fork 该项目。

### 2. 修改项目名(可选)

如果 fork 后的项目名不喜欢，可以修改自己喜欢的。

![image](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/977979bb-800b-4afb-9bdf-cfe7ded4af82/Untitled.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20211222%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20211222T084615Z&X-Amz-Expires=3600&X-Amz-Signature=fc579a214815d17d5163104d76329b1c30f096f67903799684746ce0f7f1b266&X-Amz-SignedHeaders=host&x-id=GetObject)

### 3. 修改配置

在项目根目录打开  `site.config.js` 文件，点击修改，如下：

![image](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/71d046b6-9958-4a48-8111-b18ab3507d4e/Untitled.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20211222%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20211222T084615Z&X-Amz-Expires=3600&X-Amz-Signature=6fea4753552ab80470848361f2110a723b745fee7472bd23fe1253022ced280f&X-Amz-SignedHeaders=host&x-id=GetObject)

然后修改几处内容，刚开始只需要看有中文描述的几处。

```javascript
module.exports = {
  // where it all starts -- the site's root Notion page (required)
  // Notion 根页面的 ID
  rootNotionPageId: 'c811c01b7d824f5ba966f688ee37652b',

  // if you want to restrict pages to a single notion workspace (optional)
  // (this should be a Notion ID; see the docs for how to extract this)
  rootNotionSpaceId: null,

  // basic site info (required)
  name: '老苗', // 站名
  domain: 'laomiao.site', // 域名
  author: '老苗', // 作者

  // open graph metadata (optional)
  description: '专注技术、持续学习', // 网站描述
  socialImageTitle: 'Transitive Bullshit',
  socialImageSubtitle: 'Hello World! 👋',

  // social usernames (optional)
  // 社交账号
  twitter: 'laomiao_', 
  github: 'miaogaolin',
  linkedin: '',

  // default notion icon and cover images for site-wide consistency (optional)
  // page-specific values will override these site-wide defaults
  defaultPageIcon: null,
  defaultPageCover: null,
  defaultPageCoverPosition: 0.5,

  // image CDN host to proxy all image requests through (optional)
  // NOTE: this requires you to set up an external image proxy
  imageCDNHost: null,

  // Utteranc.es comments via GitHub issue comments (optional)
  utterancesGitHubRepo: null,

  // whether or not to enable support for LQIP preview images (optional)
  // NOTE: this requires you to set up Google Firebase and add the environment
  // variables specified in .env.example
  isPreviewImageSupportEnabled: false,

  // map of notion page IDs to URL paths (optional)
  // any pages defined here will override their default URL paths
  // example:
  //
  // pageUrlOverrides: {
  //   '/foo': '067dd719a912471ea9a3ac10710e7fdf',
  //   '/bar': '0be6efce9daf42688f65c76b89f8eb27'
  // }
  pageUrlOverrides: null
}
```

改完后直接提交。

### 4. rootNotionPageId

从这个 ID 页面开始同步网站，该页面必须公开，选中下图 **Share to Web**。

![image](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/d7e0c49e-5e7c-4129-a1ce-892ba490d18b/Untitled.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20211222%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20211222T084615Z&X-Amz-Expires=3600&X-Amz-Signature=a05ad72fdba2c76ce04e1a27eda122aac9e8dfa4bf4e119b4db5fdaec1018fdf&X-Amz-SignedHeaders=host&x-id=GetObject)

**ID** 从网址上找，例如：

![image](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/d441d40a-68d6-4afb-b094-68c64ccb7c2f/Untitled.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20211222%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20211222T084615Z&X-Amz-Expires=3600&X-Amz-Signature=c4d0b51b85652582f8ea0c35a221fc0e8fc146542002dba2c5d82df5aa7d7ebb&X-Amz-SignedHeaders=host&x-id=GetObject)

## Vercel

下来做的是，将 Notion 的内容同步到 [https://vercel.com/](https://vercel.com/)  网站，等这个完了再解析域名即可。

### 1. Github

使用 Github 登录

### 2. 创建项目

![image](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/2533fe7d-1be2-40b6-8f24-879b3b990711/Untitled.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20211222%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20211222T084615Z&X-Amz-Expires=3600&X-Amz-Signature=9de669111490f0e8665de62b79c202cb0b421cf3bc9626122c44b35552b406d0&X-Amz-SignedHeaders=host&x-id=GetObject)

### 3. Import & Deploy

导入 Github 上 fork 后的项目，**import** 后再点击 **deploy，**下来需要耐心等会。

![image](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/6b760b2f-8b08-4b6c-b4fb-51869f197b9f/Untitled.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20211222%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20211222T084615Z&X-Amz-Expires=3600&X-Amz-Signature=46baee03979e999dfd8953c28b3d7fb31e611737ec69fb2b38b2076646b94fc8&X-Amz-SignedHeaders=host&x-id=GetObject)

![image](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/08d5acf0-ee64-4029-8e2d-bc90d6cff7bc/Untitled.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20211222%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20211222T084615Z&X-Amz-Expires=3600&X-Amz-Signature=dae7f7dcd1f09a22a0af20e1f666c2b0f1a43b9cb9b6580bba50c31b9deba45f&X-Amz-SignedHeaders=host&x-id=GetObject)

### 4. 域名

完成后点击 Go to Dashboard > View Domains，再添加自己的域名。

![image](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/752b41aa-4382-4be9-ae93-4a79e244d641/Untitled.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20211222%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20211222T084615Z&X-Amz-Expires=3600&X-Amz-Signature=ff584f438bb533080cf435e28cf3eceb7fe2268609a69faa67457311b8559ab8&X-Amz-SignedHeaders=host&x-id=GetObject)

添加完后，再解析自己的域名，我的域名在阿里云购买的，先复制上图中蓝色框的内容，这个是在 Vercel 站上给你分配的域名。这个域名不方便，所以用自己的。

![image](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/be7242f3-cd3f-4eef-b7bf-01ee2e03e4c9/Untitled.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20211222%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20211222T084615Z&X-Amz-Expires=3600&X-Amz-Signature=fcb2e3328e0e3a4272cff5b33a2454f5b7ab2061f2640fb358b6ecb54e1c9da0&X-Amz-SignedHeaders=host&x-id=GetObject)

**图解：**

- 记录类型：CNAME

- 记录值：填写自己的

![image](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/d0679270-0a4b-417b-96ae-6c7b9c5774d9/Untitled.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20211222%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20211222T084615Z&X-Amz-Expires=3600&X-Amz-Signature=612ba801a699a649931bdda4d9b7e08b2227acd18c78fee84a80f21dd9278030&X-Amz-SignedHeaders=host&x-id=GetObject)

## CloudFlare

当然也可以不使用 CloudFlare 加速网站，但是如果使用 Vercel 部署的网站在国内访问起来会比较慢，所以还是建议用。

### 1. 添加网站

打开 CloudFlare 网站，添加自己的域名，[cloudflare.com](http://cloudflare.com/)，后面咱简称 **CF**。

![image](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/605be502-ef16-4a96-be37-7c88deaa7f24/Untitled.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20211222%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20211222T084615Z&X-Amz-Expires=3600&X-Amz-Signature=9837c5169adc9a36307bd38d29a6074ac7d8ef52f77b276dcdac758b9ffa7ee0&X-Amz-SignedHeaders=host&x-id=GetObject)

### 2. DNS 

找到自己购买的域名，然后修改 DNS 服务器，修改成什么样呢？

先打开 CloudFlare 后台，找到 DNS 服务器地址，如下：

![image](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/1614c37d-933c-4187-95dd-493c63cfbb3d/Untitled.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20211222%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20211222T084615Z&X-Amz-Expires=3600&X-Amz-Signature=15b403e8bc4373da0e5b2c754fcd8fb0b38608f09edfe15298c21e9863a8e87a&X-Amz-SignedHeaders=host&x-id=GetObject)

然后修改域名的 DNS 服务器地址，如下：

![image](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/f049ae48-866e-4c59-aa1c-d8748cdd322a/Untitled.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20211222%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20211222T084615Z&X-Amz-Expires=3600&X-Amz-Signature=740be3fd5046f51093f0377785d8b7ada20459aaee3099a2382f7e48d0971ee6&X-Amz-SignedHeaders=host&x-id=GetObject)

CF 上解析 DNS，如下：

![image](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/f5c60302-db1d-4734-82c6-f928251223a7/Untitled.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20211222%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20211222T084615Z&X-Amz-Expires=3600&X-Amz-Signature=d3e968f91232799e8fc4c873c15b38fed60afbfedfd37dc3aa53f07b3499f536&X-Amz-SignedHeaders=host&x-id=GetObject)

图解：

- 内容：复制该 IP 地址，这是 Vercel 的 IP。

- 代理状态：设置为仅限 DNS。

### 3. 规则

在 CF 上添加两条规则，记着要根据自己的域名配置，这些配置是为了解决 SSL 证书问题，具体的，咱没深究。

![image](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/b6c773b5-d1b2-450d-b65d-97f7c98cffc9/Untitled.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20211222%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20211222T084615Z&X-Amz-Expires=3600&X-Amz-Signature=fb11dfdb99b00bc835b7c3da3334700e6a6c335afb6e00fccecad181604f766f&X-Amz-SignedHeaders=host&x-id=GetObject)

### 4. 边缘证书

点击 SSL/TLS > 边缘证书，关闭 Https，至于为啥，暂时也没深究，我在第一次操作时没有添加，网站访问速度还是，后面加上后好了，不知道是巧合还是什么。

![image](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/8d969452-5c84-4077-ade0-6d3379a62be6/Untitled.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20211222%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20211222T084615Z&X-Amz-Expires=3600&X-Amz-Signature=f9165440f8b044325090835084385334659ec53f5752ab1f20f6e04868825510&X-Amz-SignedHeaders=host&x-id=GetObject)

## 扩展

配置都完了，现在可以再访问了，如果你还想分析网站的访问速度情况，可以打开 Vercel 的分析模块。

![image](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/5ccbbada-5267-4375-b67f-a4bf850546d7/Untitled.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20211222%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20211222T084615Z&X-Amz-Expires=3600&X-Amz-Signature=48ababc917ddccc87b42a81b6e10611792bdd78add75912290185183e4fc408b&X-Amz-SignedHeaders=host&x-id=GetObject)

## 参考

- [https://while.work/vercel](https://while.work/vercel)

## 相关阅读