---
layout: post
title:  OpenWrt小记
date:   2016-01-21
categories: linux
---

### 慎哥开博客了，博客做的很好看！欢迎访问~[cbsfly](http://cbsfly.github.io)

> 请合理利用互联网，不要对国家安全造成任何威胁！

因为要做比赛所以倒腾了[OpenWrt](https://openwrt.org/)倒腾了不到一天，做个小的记录。

前天上网买的路由器昨天就到货了，淘宝，33，硬改了的。16M闪存64内存好像。

昨天和店家交流了一下，店家人真的不错。然后我就开始把店家装好的操作系统重装，这次买的路由器是可以刷官方原版的，我就下载了一个最新版的[chaos_calmer](http://downloads.openwrt.org/chaos_calmer/15.05/)。

什么是OpenWrt，简单的说，就是在你的路由器里面装个Linux操作系统。装上Linux的操作系统，是吧，你们懂得。基本上啥都能干了。

如果你家用的是极路由或者是小米路由，你要清楚，那都是深度定制的OpenWrt...

我倒腾了如下几个东西。一，中继。二，jump gfw。三，8021x校园网拨号。具体如下。

## 预备
1. 首先你得有个硬件能刷操作系统的路由器。我建议某宝买硬改的，很便宜。
2. 在ubuntu中，操作系统更新和安装软件用的是apt-get，在OpenWrt里用的是opkg(我觉得是OpenWrt Package的缩写)
3. 第二步可以联网进行操作，也可以本地安装。当然我一直觉得联网的好，不用编译配置啥的了...
4. 刚刷完操作系统的时候路由器的无线网默认是关闭的，需要登录打开。
5. 因为是操作系统，所以我们可以通过ssh root@192.168.1.1来对操作系统进行操作。
6. 刷完路由器的那个web界面叫luci。下文会用到。
7. 没找到中文语言包，所以下文全是英文。

## 中继
OpenWrt可以作为无线中继。在此感谢班长和姜导提供该技能包。

所谓无线中继，就是你用OpweWrt连接无线网，然后再把这个无线网的信号扩展了。这样就解决了一个路由器信号不够强的问题。其次，前文说道，OpenWrt是个Linux的操作系统，我们安装软件需要让路由器联网。

让路由器联网有两种方式，一种直接插网线到lan口。事实证明这样我就找不到路由器的ip了...

在咨询了班长之后我选择了无线中继的方式。

这有篇[百度文库的教程](http://wenku.baidu.com/link?url=X8GEcVGOxcygQFB3EmYr1pfvLFbn_JvY4-7aGNoBft2ykQCnd8-yTAVybONuVi7X-dhGqmgIHYKxGyI_v6MlnXxERGFTwGz8h_uSouBK4tS)写得很详细了我就不对步骤进行赘述了（百度文库还能有这种好材料...）因为我刷的是最新的cc版本路由器，所以界面不太一样，但是没啥差别。我只强调一个问题。

在第一步里，一定要设置lan口的ip，不能在同一个网段。我设置成192.168.10.1，设置完成之后，OpenWrt路由器会通过上级路由器获得一个ip，通过OpenWrt这个路由连接的设备，ssh的ip地址变成192.168.10.1，web访问也变成192.168.10.1。

全部设置完就可以通过OpenWrt路由器上网了，此时ssh到OpenWrt，发现已经可以ping了。

## jump gfw
前几天发朋友圈问了个敏感问题，没想到那么多人回复...

我现在是要入党的人，但是我又是程序员，有时候确实不得不那什么。

所以在此也说一下，你们有需求可以私聊我，我很乐意帮忙，具体手机和电脑怎么做我就不写了。路由器也是因为要做比赛才倒腾的。

我用的是shadowsocks的方式，也可以用vpn，我们工作室的极路由提供了vpn的接口，表示vpn太难搭建。

[openwrt-shadowsocks](https://github.com/shadowsocks/openwrt-shadowsocks)Github地址。

首先下载预编译的ipk到本地安装。在[shadowsocks-libev](http://sourceforge.net/projects/openwrt-dist/files/shadowsocks-libev/2.4.3-33429ad/)找到对应的机型。我的是ar71xx，然后找到那个下载次数最多的shadowsocks-libev-spec版本。这个是针对OpenWrt的优化版本。

下载完毕之后，通过scp命令上传到OpenWrt上，先`opkg update`，这一步是更新源，和我们ubuntu的update一样。

接着

`opkg install shadowsocks-libev-spec_2.4.3-1_ar71xx.ipk`

安装，他会自动的把需要的依赖包一并下载了。到这就完成了对ss的安装。

在shadowsocks-libev-spec从v1.5.2开始可以使用luci配置界面。所以我就找了一下luci的package，所有的package都在[packages列表](https://downloads.openwrt.org/chaos_calmer/15.05/ar71xx/generic/packages/)。luci-app-shadowsocks-spec_1.3.7-1_all.ipk我的叫这个，我就下载了然后继续scp上传，然后

`opkg install luci-app-shadowsocks-spec_1.3.7-1_all.ipk`

之后登陆web界面，这时候就有可视化的配置界面了。

![openwrt](/images/openwrt.png)

输入你的ss账号密码就可以了。但是需要在最下面添加ignore list，让国内的网站直接连接网络，不然的话像我，就没法看nba直播了，很多视频优酷什么的也不能看了...

这一步其实是关键的，新建一个后缀为list的文件，然后输入这串命令

`wget -O- 'http://ftp.apnic.net/apnic/stats/apnic/delegated-apnic-latest' | awk -F\| '/CN\|ipv4/ { printf("%s/%d\n", $4, 32-log($5)/log(2)) }' > /dev/ignore.list`

然后把ignore的路径设置到你配置的那个文件就可以了。

这时候在开腾讯nba就能看直播了...我简直，为了看球什么都干得出来。然后再连接路由器就可以Jump gfw了~

## 8021x校园网拨号
不过我们不用更换源，首先我们需要

`opkg remove wpad-mini`

然后`opkg install wpad`和`opkg install wpa-cli`。

然后配置8021x的文件就可以上网了。

因为我走了中继，所以这个没有具体实践到拨号，只实践到安装依赖包。

具体参考迪哥的博客[极路由root并8021x校园网拨号经验分享](http://cindyfn.com/jiluyou/2015/02/04/ji-lu-you-8021.html)

## 结尾
> 请合理利用互联网，不要对国家安全造成任何威胁！

## 参考链接
1. [Openwrt无线中继教程](http://wenku.baidu.com/link?url=X8GEcVGOxcygQFB3EmYr1pfvLFbn_JvY4-7aGNoBft2ykQCnd8-yTAVybONuVi7X-dhGqmgIHYKxGyI_v6MlnXxERGFTwGz8h_uSouBK4tS)
2. [极路由root并8021x校园网拨号经验分享](http://cindyfn.com/jiluyou/2015/02/04/ji-lu-you-8021.html)
3. [openwrt-shadowsocks](https://github.com/shadowsocks/openwrt-shadowsocks)
4. [OpenWRT之Shadowsocks更新ignore.list](http://blog.tshine.me/openwrt%E4%B9%8Bshadowsocks%E6%9B%B4%E6%96%B0ignore-list.html)