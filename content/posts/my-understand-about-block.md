---
layout: post
title:  Block 我所理解的回调
date:   2015-05-29
categories: IOS
---

FOR CM AND PLUSUB
---

##  废话
>开发iOS距离一年还有四个月。block的文章看了很多。也在项目中使用了，但是使用率很低，仅限于最最简单的界面传值。

>我最近处于一个深度学习和补作业做实验的阶段(重点是补作业和做实验)，而且经历了两个项目现在对于OC的理解又更进了一步。于是抽时间把之前下载的关于block的视频又翻出来看了一下。有一些感受写出来，以便CM和PLUSUB以后的iOSer可以很快的学习到关于block的使用。以后这样的文章都会在标题加一个FOR CM AND PLUSUB。


##  概述
>block就是闭包，可以用来回调。

>再简单一点，指向函数的指针。

>我现在只会简单的使用block，下午写了个demo利用block封装了afnetworking然后在另一个界面调用afnetworking的请求。当然不复杂。

>上代码吧，不然再废话都解释不清楚什么是block。

##  _part1 block的简单定义_
我现在定义一个简单的block。
{% highlight objc %}
void (^myBlock)(NSString *str);//1
myBlock = ^(NSString *str)
{
    NSLog(@"---%@", str);//2
};
myBlock(@"11111");//3
// Outputs:---11111
{% endhighlight %}
可以这么理解，我定义了一个返回值为void类型的block。void后面跟了一个函数，但是这个函数函数名是以^开头的，需要用括号包起来，参数也需要用括号包起来。参数可以是一个int类型，可以是一个NSString类型，还可以是一个函数！可以是多个参数还可以是一个函数。当然如果是int类型的block就需要return一个返回值了。

然后我们开始对这个void类型的函数进行定义。就是令它等于一个“^+参数”然后里面像定义一个函数一样就行了。
在调用这个block的时候就直接就myBlock加参数就可以了。

我们可以打断点来看一下整个block的执行顺序。我在代码后面加了标示。

执行顺序是1 3 2，可以看到myBlock没有按照程序执行的顺序来调用而是在调用之后执行了2的代码。这个例子可能不那么明显，但是可以开始初步理解回调。

##  _part2 传参block_
下面把难度加大一点，我们把block当参数传。然后看一个block的例子。
首先来回顾一个c语言里伟大的typedef，我们开头会利用typedef定义一个block。如果不利用typedef定义一个block，那么函数传参的时候会写很多代码。一会我会详述。
{% highlight objc %}
#import "ViewController.h"
typedef void (^MyBlock)(NSString *str);//typedef定义一个block

@interface ViewController ()
@end

@implementation ViewController
- (void)viewDidLoad {
    [super viewDidLoad];
    MyBlock tblock = ^(NSString *str) {
	NSLog(@"-----%@", str);//1
    };
    [self testBlock:tblock];//2
}
- (void)testBlock:(MyBlock)mBlock
//如果开始没有用typedef定义的话，此处的函数变为- (void)testBlock:(void(^)(NSString *str))myblock
//简单的说格式就是 “返回值 + (^) + 参数 + 名字”
{
    mBlock(@"1111");//3
}
// Outputs:-----1111
{% endhighlight %}

在上面的代码中，我们写了一个testBlock的函数，将我们的tblock作为参数传到了testBlock函数里面，然后再testBlock里用mBlock调用了我们所写的MyBlock这个函数。

打断点看一下整体的运行流程，2 3 1。这里可以更加明显理解“回调”的含义。

##  _part3 点击button触发block_
经历了上面两个part基本上应该对block有个简单的理解。下面再加一点难度，用按钮触发一个回调来改变按钮的颜色。

不多解释，直接上代码。
{% highlight objc %}
#import "ViewController.h"
typedef void (^MyBlock)(UIColor *color);
@interface ViewController ()
@property (nonatomic, strong) UIButton *testbtn;
@end

@implementation ViewController
- (void)viewDidLoad {
    [super viewDidLoad];
    self.testbtn = [UIButton buttonWithType:UIButtonTypeSystem];
    self.testbtn.frame = CGRectMake(0, 0, 200, 40);
    self.testbtn.backgroundColor = [UIColor greenColor];
    [self.view addSubview:self.testbtn];
    [self.testbtn addTarget:self action:@selector(testfunc) forControlEvents:UIControlEventTouchUpInside];
}
- (void)testfunc
{
    MyBlock myblock = ^(UIColor *color) {
	self.testbtn.backgroundColor = color;
    };
    [self testBlock:myblock];
}
- (void)testBlock:(MyBlock)myBlock
{
    UIColor *color = [UIColor redColor];
    myBlock(color);
}
{% endhighlight %}

##  _part4 利用回调分离afnetwork的请求_
直接上代码了。

TestNetworkViewController是afnetwork使用的地方。
TestViewController是我们需要调用网络请求的地方。
SearchModel是一个model，我用来解析数据的。
{% highlight objc %}
//  TestNetworkViewController.h
#import <UIKit/UIKit.h>
#import "SearchModel.h"
typedef void (^GetModel)(SearchModel *model);
@interface TestNetworkViewController : UIViewController
+ (void)getUrl:(GetModel)getmodel;
@end

//TestNetworkViewController.m
#import "TestNetworkViewController.h"
@interface TestNetworkViewController ()
@end
@implementation TestNetworkViewController
- (void)viewDidLoad {
    [super viewDidLoad];
}
+ (void)getUrl:(GetModel)getmodel
{
    AFHTTPRequestOperationManager *manager = [AFHTTPRequestOperationManager manager];
    [manager GET:@"http://xxx.xx.xxx.xx:xxxx/app/search_haosou" parameters:@{@"keyword":@"android"} success:^(AFHTTPRequestOperation *operation, id responseObject) {
	NSLog(@"JSON: %@", responseObject);
	SearchModel *service = [MTLJSONAdapter modelOfClass:SearchModel.class fromJSONDictionary:responseObject error:nil];
	getmodel(service);
    } failure:^(AFHTTPRequestOperation *operation, NSError *error) {
	NSLog(@"Error: %@", error);
    }];
}
@end

//  TestViewController.h
#import <UIKit/UIKit.h>
#import "SearchModel.h"
@interface TestViewController : UIViewController
@end

#import "TestViewController.h"
#import "TestNetworkViewController.h"
#import "SearchModel.h"
@interface TestViewController ()
@property (nonatomic, strong) SearchModel *test;
@end

@implementation TestViewController
- (void)viewDidLoad {
    [super viewDidLoad];
    // Do any additional setup after loading the view.
    UIButton *testBtn = [UIButton buttonWithType:UIButtonTypeSystem];
    [testBtn setTitle:@"test" forState:UIControlStateNormal];
    [testBtn setTitleColor:[UIColor redColor] forState:UIControlStateNormal];
    testBtn.frame = CGRectMake(0, 100, 200, 40);
    [testBtn addTarget:self action:@selector(getUrl) forControlEvents:UIControlEventTouchUpInside];
    [self.view addSubview:testBtn];
    self.view.backgroundColor = [UIColor whiteColor];
}
- (void)getUrl
{
    [TestNetworkViewController getUrl:^(SearchModel *model) {
	self.test = model;
	NSLog(@"\n\n\n\n%@", self.test);
    }];
}
{% endhighlight %}

##  总结
> 首先还是得说一下我这里只是演示了最最简单的block使用，因为作为一个iOS开发者不会block，那么有一大半的代码是看不懂的，在后面理解RAC的时候也会出现很大的问题。所以这里我只是做了简单的说明，至于在block里为什么不能调用self，自从segmentfault上有人问过之后我答错之后现在也算是理解了一部分了，但是牵扯到了内存回收的问题，我还需要一段时间来消化。消化完之后会继续写博客的。

> 总之，block非常的有用，初期写block非常的难过，但是难过过了也就慢慢会喜欢上block的。

##  post-credits scene
> 最近实在是忙的不可开交，一星期两场考试四个实验。还欠了人jobdeer.com一篇博客还没写，人送的书都没时间看。抽时间还要补起来。

> 最近博客的更新频率也是大大降低...唉。都是泪。

> 先写到这了。
