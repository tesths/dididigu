---
layout: post
title:  快捷指令下载 Instagram 图像及 Story（7.10 更新）
date:   2018-08-06
categories: ins
---

## 7.10 更新

**目前只需要在捷径最前面填写即可。详情见图！**

## 6.2 更新

~~Story 下载两个地方都需要增加 Cookie 啦，见截图。~~

## 5.24 更新

**Instagram 单独下载一条也需要登录了，单独下载一条设置 Cookie 的方式同 Story。**

在查询了一些资料之后，我找到了 Instagram Story 的下载方式，并根据这个方式完成了 Workflow 的版本。感谢 [instastories-backup](https://github.com/tensojka/instastories-backup)项目。

## 原理

Instagram 是需要登录验证的，但实际经过我的测试，Instagram 只会检测 cookie 和 user-agent。那么只要在网络请求的 headers 加入 cookie 和 user-agent 实际上就可以了。

user-agent 是可以直接伪造的，而 cookie 值，需要通过网络版本的 chrome 获取。

在这个地方，cookie 建议使用自己的，或者是专门注册一个帐号用于下载。如果 cookie 泄露，理论上可以利用 cookie 对相应的用户进行数据篡改。

## 获取 cookie

打开 Chrome，进入到 www.instagram.com 并登录。1111

**Windows 用户按 f12，Mac 用户按 option+cmd+j，打开控制台。**

此时刷新页面，找到 www.instagram.com 的请求。找到 cookie，然后找到 sessionid。复制这串 140122... （这串数字+字母+符号，每个人不同，有人可能是 5124...等）如图所示。

![](images/ins0.png)

然后把这么一长串，粘贴到捷径中最开始的 sessionid= 后面即可进行下载操作。

### 普通下载版本截图

![](images/ins2.png)

### Story 版本下载截图

![](images/ins3.png)

## 注意事项

cookie 一定不能泄漏，不然会造成安全问题。

每个 cookie 的有效期是 90 天，需要时常更新。

这里通过的是 Instagram 的私有 API 进行操作，所以 workflow 单人单用以免出现滥用。