---
layout: post
title:  成都T技术沙龙小记
date:   2016-06-23
categories: life
---

耽误了那么久才开始写，因为连续考了三天试..那天晚上和坦坦回学校的时候朋友圈发了好长一截，我怕我忘了..闲话少说，开始记录一下吧~

总体给我的感觉，很赞，真心很赞。这算是我第一次参加技术沙龙，Swift的。

时间是上周日，19号。我和坦坦，下文统一为蛋哥。我和蛋哥约在活动中心见面，然后打uber去了天府软件园。去了之后和蛋哥一起吃了KFC，然后就坐在那等蓉姐和肠叔。其实之前和蛋哥有过交流，后来蓉姐来了。我简直就是作为一个记者一样，对蓉姐进行了一个采访，从蓉姐学iOS到工作，问了个遍，下次可以带着录音笔，出个采访稿也是不错的。

## 首见蓉姐

---

蓉姐为啥要单独提出来说？**因为蓉姐是一个做iOS开发的女孩。**对，女孩..

蓉姐和我想象的完全不一样，蓉姐作为一个女孩写iOS，我心里是很佩服的。我从来没有看不起女程序员，我是超级佩服。因为工作室很多学妹在学习编程上都存在大大小小的问题。所以我也问了蓉姐很多问题。蓉姐也超级耐心的和我解答。

蓉姐大三开始学iOS，现在在做智能玩具。我看了蓉姐的博客，写了一个蓝牙的系列，很nice。我还咨询了蓉姐一下iBeacon的问题，蓉姐说其实原生的api其实足够，但是蓝牙也有很多坑。蓉姐还做过php，大一学了c语言之后就做编程了。

蓉姐大概还是个摄影爱好者，相机和脚架很齐全，我很佩服。蓉姐说她在深圳的公司的时候压力很大也坚持下来了。总之，和蓉姐简短的聊天，除了佩服就剩佩服了。有那么一点女汗子的感觉，蓉姐的经历可以让我以后和工作室的学妹说，编程，从来不是难事，是努力可以做好的事情。

我和蛋哥蓉姐回合之后就去了camera360，沙龙在camera360举办，环境超级nice。我很喜欢那里的办公环境，理由很简单，我进去就看到了运动器械...跑步机瑜伽球乒乓球桌投篮机一应俱全。

之后就一起排了一下座位。等大家到起齐就开始了。

## 畅叔开场

---

稍微介绍一下畅叔。畅叔是帮主的大学同学，帮主就是T沙龙的总司令梁杰，梁杰是跨界网红。畅叔之所以叫畅叔就是因为畅叔年级轻轻看上去好老...是真的。当然畅叔也是跨界。

畅叔先是感谢了泊学的赞助~还有camera360的场地提供。

畅叔先是大概介绍了T沙龙的起因以及T沙龙的形式。T沙龙真的要开遍全国，每个月举办线下的沙龙。最重要的是，非盈利，不收费，非盈利，不收费，非盈利，不收费。重要的事情我要说三遍。(偶尔私心一下..必须宣传)

T沙龙已经成功的在北京举办了很多次。像巧大啊，还有臧成威啊，还有虾神，还有sunny神都参加过，总之就是，非常成功。

T沙龙真的是要把热爱Swift的人聚集在一起，分享，交流。

成都这是第一次，当然组织者就是畅叔，蛋哥，还有蓉姐，我是打杂的。

之后，大家自我介绍了。其实程序员是个很开朗的职业，很能扯，很多好玩的。所以大家的自我介绍也很开心欢乐，之后就开始分享啦。

## 从零开始写一个Argo —— ThoughtWork方志刚

---

必须要先隆重的介绍一下方志刚。**我科大的学长**，和蛋哥一届的。但是现在一看，蛋哥仿佛被完爆了...

方志刚分享的是从零开始写一个Argo。Argo是一个解析json的三方库。方志刚采用的方式是..VNC..！！就是远程操控了投影的电脑，然后现场一步一步写来展示整个的过程。

这种形式我是服了。(十分后悔没有用电脑记录一下...现在写这个实在是费劲，想在技术上记录点东西都没机会..)

开始的时候实现了一个简单的parser，然后逐步完善功能。

针对Argo可能存在的一些问题进行了解决。

开始的时候是利用Swift的函数式特性先写了一个简单的parser。之后在此基础上进行了完善。然后写了一个Functor..到这其实我已经有点晕了。不过后面活过来了。

但在此基础上调用方法的话还是显得复杂，于是方志刚用了Swift的运算符重载..用这种方法对方法的调用，只需要用重载后的运算符就行了。

当然，在写的时候可能会出现参数过多的问题，这是camera360的高山问的..之后方志刚推荐了一个很赞的库，[curry](https://github.com/thoughtbot/Curry)，对就是库里..在函数式编程中很重要的一个概念，科里化。利用这个可以无论多长的函数都可以。高山说，在RAC中，写了很长的宏，宏......

之后，就是如果我们在写的时候出现"user.name"这种情况的时候，怎么让我的parse可以解析到后面的name。如果在haskell中，foldl，我没记错是这么个函数。用这个函数可以获得最后的那个字符串。

方志刚提到，由于在Swift中没有foldl，所以我们先reverse一下，然后在解析就可以了。厉害。我是服了。

之后的茶歇时间，之所以我后面这块记得那么清楚，是因为我在茶歇时间和他交流了一下..方志刚人很nice啊，我问最后reverse的时候他超级耐心的和我解释了，他一说foldl我就明白大概了..我还问了运算符重载在haskell的地方，他说他不知道，我问他学过haskell没，他来了一句，我都是用到再查...当时就跪了，瞬间智商碾压啊。我TM按顺序看都看不懂啊！！人家就直接stackoverflow查给我看了。他还问我是不是学过，有个free monad的概念很烧脑...我说我没学过..所以我准备后面几天学一下然后下次有机会当面再交流一下monad。

包括茶歇时间听蛋哥和许国卿和TW的另一外工程师官勤交流了一下函数式在生产环境里的使用，真的是，受益匪浅。

## Rethink NSNotifucation in Swift —— Camera360高山

---

高山是camera360的iOS开发工程师。**我科大学长。**他分享了他在平时开发中对于回调，通知，这些使用的一些心得，同时分享了他们团队利用RAC来代替这些的方法。

虽然没有方志刚那种现场写代码的感觉，但是还是有很多收获。

之后高山提出了关于RAC的一些问题我们讨论了一下，觉得还是很棒的~

## 茶歇

---

茶歇之所以单独提出来，是因为我们买了奇葩饮料...陈佳因为来迟到了，喝了崂山🐍水。我喝了，难喝死了。

茶歇各种闲扯交流，也是受益匪浅。

## wwdc讨论

---

畅叔和蛋哥在嘉宾分享之后加了一个环节就是wwdc的讨论，因为前几天才开了wwdc..由我开头，我之前写了一片博客，提到了apple逼死了一波软件。之后又提到了ipad上的swift playground..我说我觉得那个好鸡肋，本来准备买ipad的都不打算买了。我刚说完。陈佳拿出iOS10的ipad说没有那么坑。

然后大家就开始围观playground啊！！我们用quicktime把ipad投影出来，然后方志刚在ipad上写了几段代码。当时那种感觉，就是，我可以考虑买ipad！

因为当时觉得就是一个给娃娃学编程的软件..现在发现还是有实际用处的，可以写动画，而且苹果把Uikit都给封装进去了。非常的nice。

如果不是陈佳，我就真觉得苹果坑了。

之后蛋哥说了他看的session，提到了最新的Session 219 What’s New in UICollectionView in iOS 10。就是苹果官方对collectionview进行了优化。Session 414 Using and Extending the Xcode Source Editor。Xcode提供了更加的强大的编辑功能！蓉姐还提到了Session 406 Optimizing App Startup Time..大家纷纷表示国内厂商都用这个做广告..大家纷纷针对这些都讨论了一下。还是很有收获的。

之后，都准备合影了..许国卿和陈佳开始玩起了iOS10的iMessage..我勒个去，那个酷炫，我是服了。当时准备录小视频的，没来及。

## 感想&心得

---

其实我觉得，现场的边写代码边讲超级过瘾，尤其还是函数式。

很早之前我就觉得，函数式迟早会火。这种上古的语言，是时候重新回归到大众的眼前了。Swift给了那么一个契机，让程序员们去学习，去了解这么一门博大精深的编程语言。这是Swift的功劳，不得不承认。这次沙龙结束，我也有更加充分的理由去强迫性的去让工作室的娃们学习函数式。

听完方志刚的分享，我这次下狠心学haskell了，为了下次可以很好的交流一下free monad..不过我估计我一个月学不会。因为太难了。

这次交流不仅听到了大牛的分享，终于见到蓉姐和畅叔，畅叔没有想象的帅，蓉姐比我想象的要厉害。蛋哥，蛋哥很早之前就认识了。蛋哥的故事，是可以完完整整写一篇博客的。我真的，每次想到蛋哥，除了佩服还是佩服。

说实话，我觉得这次沙龙比较成功，认识了很多大神啊！而且真的不仅学到了东西，还了解了很多camera360公司写代码的一些方式，还有TW的一些工作方式，真的觉得不错啊。

**最主要的是，科大撑起半边天。**

这次去完，真的觉得。这句话要单独提出来说。

**Swift改变世界！**

Swift值得所有人去学习，这门新兴的语言，必将走上历史的顶峰。此处必须表达一下我对某门语言的态度。后台迟早都是Swift，安卓迟早也是Swift。对我就是想说，那门可以干这两件事情的语言，你迟早gg。

**我相信，&lt;T&gt;沙龙在成都会越来越好的。**

## 感谢

---

真的，还是感谢。超级感谢，其实第一个感谢的应该是网红梁杰，也就是蛋哥老说的帮主。没有帮主的组织，不可能有 T 沙龙。

其次要感谢的，当然是畅叔，蛋哥，蓉姐。没有他们的组织，也就没有成都这次的沙龙。

当然，要感谢泊学和camera360（按照我博客的访问量，此处赞助商应该加钱）。没有赞助，也没有这次沙龙的资金和场地。

当然的当然，感谢方志刚和高山的分享，还有大家的很多交流，学到了很多很多东西。

从现在，哦，不，从那天晚上开始，我其实就已经开始期待下一次的沙龙了。