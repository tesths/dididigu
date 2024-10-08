---
layout: post
title:  查找 ruby 内存泄漏
date:   2018-05-09
categories: server
---

本文没有深入探讨 ruby 的内存管理问题，本人水平有限，没有去深入看内存管理，而且我现在主要需要实现功能，这里只谈我是怎么解决问题的。

## 起因

提到内存泄漏，这是个非常麻烦以及难以解决的问题，ruby 是自动回收内存，不是像 c 一样手动回收，虽然大部分语言现在都是这样，但是这就导致一个非常麻烦的问题，内存泄漏怎么办。我在解决这个问题的时候心里是有阴影的，因为之前写过一个 swift 的图表动画，运行几次之后就变的特别卡。一直也没有找到原因，后来换了一种非常啰嗦的写法才解决。所以这次是心有余悸的。

事情的起端是我写了一个定时爬取数据的 ruby 程序。基本思路是用 ruby 来调用 python 脚本。然后通过 ruby 的 activerecord 存入数据库。为什么不用 python 直接存数据非得用 ruby 绕一下的理由是，activerocord 很好用，以及我想熟悉 ruby 栈，最后是这样可以和我的服务器 activerecord 无缝对接上，所以就用 ruby 了。

我的需求是每个整点的第 22 分钟时运行一次，这里使用了 ruby 的 [rufus-scheduler](https://github.com/jmettraux/rufus-scheduler)，在这个 gem 里有一个是调用 cron。但是问题在于，真的调用 cron 了吗？我没有看源代码，但是最终根据我内存泄漏的原因，我分析是没有的。起因就是，我把程序上传到服务器上，每次运行 3-4 天之后服务器就无法 ssh，但是可以 ping。查了一下觉得有可能是内存泄漏，于是开始了排查。


## 排查

一开始我傻不拉唧直接在服务器上看内存使用。

```
1.CPU占用最多的前10个进程： 
ps auxw|head -1;ps auxw|sort -rn -k3|head -10
2.内存消耗最多的前10个进程 
ps auxw|head -1;ps auxw|sort -rn -k4|head -10
3.虚拟内存使用最多的前10个进程
ps auxw|head -1;ps auxw|sort -rn -k5|head -10
```

我这里使用了第 2 个。但是这个方法是很傻的，因为你不可能每小时都登服务器，只能大概判断，不过我间隔了一段时间登录之后发现确实程序内存使用上升。于是切换到本地测试。

我把定时任务换成了一个 while 循环，使用了一个函数

```
def report
  p 'Memory ' + `ps ax -o pid,rss | grep -E "^[[:space:]]*#{$$}"`
          .strip.split.map(&:to_i)[1].to_s + 'KB'
end
```

这个程序运行一段时间就会发现内存是在增长的，虽然当内存变大，ruby 的自动回收机制会让内存变小，但是总体还是在不断变大。

## 解决

于是就需要开始排查到底是哪泄漏了。这里用到的 gem 是 [memory_profiler](https://github.com/SamSaffron/memory_profiler)。这里要注意，不能写成死循环检测，也不能循环次数太多检测，不然依然会导致内存使用过高。这是我遇到的坑。

使用 memory_profiler 之后，它会显示 retain 的 object，超级神奇！还会显示内存泄漏的行数。我就不阐述了，非常直观明了。

我的问题在于 ruby 调用 JSON 解析和 Time 的时候。

```
  allData = JSON.parse(result)
  current_time = Time.now.strftime("%H")
```

这里实际上 allData 和 current_time 都已经是对象了。而 rufus-scheduler 并没有真正的调用 cron。所以导致每个小时都有 allData 和 current_time。即使内存回收，这个地方也是不会完全回收。

解决方案很简单，加一个 `= nil` 就 ok。至少目前我修改过的程序已经运行 3 天内存依然比较稳定，希望一直稳定下去...

以上。


