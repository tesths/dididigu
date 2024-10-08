---
layout: post
title:  让所有网页变成RSS —— Huginn 
date:   2016-07-15
categories: life
---

> 如果你不知道什么是 RSS，赶紧去查查是什么然后用起来吧，相信我，用了就再也离不开了。

我是一个重度 RSS 使用者，一般来说，我获取信息有微博，微信，邮件，还有就是 RSS 。每次打开 Chrome 之后第一个打开的就是 Feedly，看看有没有新的内容更新，省去我了一次性打开多个网站的麻烦。但是问题来了，有些网站没有 RSS 怎么办？

前几天在[利器](http://liqi.io/)的群里，看到有在讨论一个叫 [Huginn](https://github.com/cantino/huginn) 的东西，一个叫祥子的朋友还很热心的给大家解答一些关于这个的问题，我稍微查了查，发现这个东西可以解决我一直的一个痛点，就决定花时间来倒腾一下。

Huginn 是一个 Github 的开源项目，已经上万 Star 了。简单的说这个东西是一个 IFTTT 形式的东西，可以把所有网页转换成 RSS 输出。更简单的说，就是工作流形式，类似于 iPhone 上的 Workflow。

## 安装

安装有很多的方式，官方提了有 Heroku，docker，还有服务器。

祥子专门写了文章介绍怎么利用 Heroku 来安装。[Huginn安装教程—建立你自己的IFTTT](http://www.jianshu.com/p/2e6e3f845bc3)，写的非常详细，需要的可以去看这个。

我是用我日本的 vps 来搭建的，但是由于官方的文档实在是太详细了...导致我想写安装发现没啥好写的，我就把遇到的几个问题略微叙述一下。

### [官方文档安装教程地址](https://github.com/cantino/huginn/blob/master/doc/manual/installation.md)

### 坑1. 官方最开始有一步 Import node.js repository...

`curl -sL https://deb.nodesource.com/setup_0.12 | sudo bash -`

这一步官方用了脚本执行，可以不复制那个 curl 开头的，新版本的 nodejs 安装只需要用 `apt-get install nodejs` 就可以了。

因为官方在后面 Install the required packages 中有 nodejs 的安装，所以 Import node.js repository 这一步其实可以不去做。

### 坑2. 需要在开始的时候设置主机语言

如果不设置主机语言的话，会在后面有很神奇的错误。设置主机语言的命令是

`export LC_ALL=en_US.UTF-8` （需要设置中文自行 google，可能这样设置还不够..最好查一下怎么设置语言）

### 坑3. 需要设置时区

不设置时区抓取的时候时间会有问题，不过这一步问题不大。命令如下。

`sudo dpkg-reconfigure tzdata`

### 坑4. 全部安装完毕 css 不显示

Rails 静态资源需要编译，不然 css 不显示。我已经提了 issue ，遇到这个问题可以参看这个 issue。

[css and image is not load](https://github.com/cantino/huginn/issues/1581)

### 坑5. [Install Init Script](https://github.com/cantino/huginn/blob/master/doc/manual/installation.md#install-init-script)

在这一步中是 **或** 的关系，一定要搞明白。

我选择的是在这步把

```
# web: bundle exec unicorn -c config/unicorn.rb
# jobs: bundle exec rails runner bin/threaded.rb
```

这两行的 **#** 去掉了的。

### 坑6. 配置 nginx

**YOUR\_SERVER\_FQDN** 这个改成你的主机ip就可以了。我没有域名不知道域名的怎么弄。

> 备注：我没有使用 https ，所以如果有需要 https 自己踩下吧。

> 作者很耐心，提 issue 的话很快就能回复，而且问题定位比较准确。提的时候先查看有没有重复的，然后记得用英文就好。

### 坑7. 在bundle install的时候显示“Cannot allocate memory - git”

简单的说，swap不够了..具体方法见[How To Add Swap on Ubuntu 14.04](https://www.digitalocean.com/community/tutorials/how-to-add-swap-on-ubuntu-14-04)

## 使用

使用的方式我捉摸了很久才搞定..我会举个把网页转换成RSS的详细的例子。

开始之前首先需要解释几个东西。

1. 网页的格式是 html，RSS 的格式是 xml。
2. xpath 是你用来确定网页元素的方法，这一步我会有一个很简单的方法来教大家怎么去搞定元素的确定。
3. 由于是工作流的形式，所以我们整个的过程其实有两步，第一步是抓取网页的信息，第二步是返回 RSS 的地址。

下面开始举例子。我们现在要把[我的博客 http://walkginkgo.com/](http://walkginkgo.com/)转换成 RSS。

按照3中说的，我们需要先抓取网页信息。抓取网页信息，要创建一个 Website Agent。

![2016-07-15_huginn1.png](images/2016-07-15_huginn1.png)

按照图示，名字随便起，其他可以先默认。（全部解释太麻烦）

![2016-07-15_huginn2.png](images/2016-07-15_huginn2.png)

然后是关键的一步，我们要开始确定网页的元素。

点击 **Toggle View** 到文本编辑模式。我们要修改我圈出来的两个地方。

![2016-07-15_huginn3.png](images/2016-07-15_huginn3.png)

我们需要修改url到我们的网址，在这里就是 **http://walkginkgo.com/** 了。

**extract** 是我们要提取的信息，我们这里要提取博客的题目，网址，发布日期，简述。

我们现在打开[tesths](http://walkginkgo.com/)这个博客进去来看怎么抓取元素。

在 Chrome 打开，然后选择你要的元素，**右键**选择 **Inspect**。可以看到 Chrome 下面的审查元素信息已经出来了。

![2016-07-15_huginn4.png](images/2016-07-15_huginn4.png)

可以看到我们的元素在 **span** 标签里，这时候我们如图**右键**选择之后然后复制。

![2016-07-15_huginn5.png](images/2016-07-15_huginn5.png)

![2016-07-15_huginn6.png](images/2016-07-15_huginn6.png)

复制的东西如下。

`/html/body/div[1]/div/div/ul/li[1]/h2/a/span/text()`

把之前的 css 改成 xpath 然后直接复制就可以了。点击下面的 Dry Run，可以看到我们的标题已经搞定了。（css 使用见下面备注）

![2016-07-15_huginn7.png](images/2016-07-15_huginn7.png)

但是还有两个问题，一个是，我们只爬了一个标题，二是标题有空格。

![2016-07-15_huginn8.png](images/2016-07-15_huginn8.png)

**解决问题1**，需要把我们的 xpath 改成这样。

`/html/body/div[1]/div/div/ul/li/h2/a/span/text()`

是因为 **li[1]** 代表我们第一个标题，所以把[1]去了就可以了。

**解决问题2**，需要我们加上一句话。

`"value": "normalize-space(.)"`

这句话的意思就是把空格去了。

最后就是这样。

![2016-07-15_huginn9.png](images/2016-07-15_huginn9.png)

下面我们把链接按照这个方法也爬下来。找到链接的地方，因为链接在a标签里面，所以我们要加一个 value，选择到 href。剩下我就不具体叙述了，我把最后完整的截图出来。

![2016-07-15_huginn10.png](images/2016-07-15_huginn10.png)

日期什么的方法类似，也不多说。这样其实没有什么 html 的基础也可以爬网页了。

![2016-07-15_huginn11.png](images/2016-07-15_huginn11.png)

**Dry Run** 之后的结果如图。

![2016-07-15_huginn22.png](images/2016-07-15_huginn22.png)

别忘记 **Save**。

> 备注：官方默认创建用的是 css，Chrome 提供了复制 css 的方式，格式稍微改动成和官方例子那样**空格**来代替**>**就可以了。

这么我们就完成了工作的第一步，抓取网页，下一步要输出 RSS。

前面都随便写，记得 **Sources** 选择我们之前的 tesths blog。

![2016-07-15_huginn13.png](images/2016-07-15_huginn13.png)

下面是继续配置 **Option**，这就比之前简单了。

但是注意我们之前的链接没有前面的 **http://walkginkgo.com/** 这一串，我们要加上。

![2016-07-15_huginn14.png](images/2016-07-15_huginn14.png)

最后完整的是这样的。

![2016-07-15_huginn15.png](images/2016-07-15_huginn15.png)

还要记得把你博客的 link 加上。

![2016-07-15_huginn23.png](images/2016-07-15_huginn23.png)

之后选择 **Save** 就到了这。

![2016-07-15_huginn16.png](images/2016-07-15_huginn16.png)

可以看到已经有 xml 格式的输出了。

最后一步我们要烧录 RSS。用到的时谷歌家的服务 [feedburner](https://feedburner.google.com/)

![2016-07-15_huginn17.png](images/2016-07-15_huginn17.png)

然后next。

![2016-07-15_huginn18.png](images/2016-07-15_huginn18.png)

继续next。

![2016-07-15_huginn19.png](images/2016-07-15_huginn19.png)

把网址复制到 Feedly 里面，大功告成！

## 更多备注

因为我个人 RSS 主要是看有没有更新，所以抓取的内容不详细，需要抓取全文在手机看的话就自己倒腾啦。

如果输出 RSS 没有结果的话，可以看下是否允许，没运行点击一下 run 就可以了。

![2016-07-15_huginn21.png](images/2016-07-15_huginn21.png)

如果你遇到输出的结果有问题，可以看下是不是event多了。

![2016-07-15_huginn20.png](images/2016-07-15_huginn20.png)

如果多了就全部删除重新运行。

总之真的没有很难，最难的是 xpath 获取元素，但是我已经用了最简单的方式来教大家了，剩下的无论是不是专业学编程的都能很快搞定啦，就看大家怎么去玩这个了。

至于抓取 RSS 的频率，正在测试中..敬请关注更新。


参考链接

1. [HUGINN:烧录RSS的神器](http://walden.farbox.com/post/huginn-a-rss-master-piece)
2. [Huginn安装教程—建立你自己的IFTTT](http://www.jianshu.com/p/2e6e3f845bc3)
3. [cantino/huginn](https://github.com/cantino/huginn)

