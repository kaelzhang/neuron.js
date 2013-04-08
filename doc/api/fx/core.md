fx/core
======

Outline
------

- Constructor
- start
- stop
- cancel
- pause
- resume


fx/core: Constructor
------

动画核心函数，tween，morph的基础

### Syntax

	var myFx = new Fx(options);
	
### Returns
{Object} Fx 实例
	
### Arguments

#### options
{Object} 构造器的参数

**常用参数**

- property {(Object|string)} 执行动画的对象属性
- duration {number=500} 动画时长（毫秒），默认值500


**其他参数**

- fps {number=60} 帧率，默认60帧/秒
- unit {string=false} 单位，默认false，可选'px', 'em', or '%'
- frames {number=null} 动画帧数，默认为根据duration和fps计算出
- frameSkip {boolean=true} 是否允许跳帧
- link {string='ignore'} 动画的连续方式 可选值为'ignore','cancel','chain'。设为'ignore'则进行中的动画对新的start事件忽视，设为'cancel'则进行中的动画立即执行新的start事件，原动画取消，设为'chain'则将新的start事件存入队列，当前进行中的动画结束后立即执行。
- transition {Object} 动画过渡效果，可以从fx/easing中选取预设的函数或自定义函数
Event: start
------

动画开始时触发的事件

### callback
该事件的回调函数参数是执行动画的DOM元素


Event: complete
------

动画完成时触发的事件

### callback
该事件的回调函数参数是执行动画的DOM元素


Event: stop
------

动画停止且未完成时触发的事件

### callback
该事件的回调函数参数是执行动画的DOM元素


Event: cancel
------

动画被取消时触发的事件

### callback
该事件的回调函数参数是执行动画的DOM元素

Event: step
------

动画每一帧触发的事件

### callback
该事件的回调函数参数是动画的内部对象，其value属性值为当前帧的动画property的值


.start()
------

开始一个动画，触发'start'事件。

### Syntax

	myFx.start(from[, to]);

### Arguments

	- from {mixed} 动画起始参数值，如果只设置一个参数，则视为动画目标参数值
	- to {mixed} 动画目标参数值
	
### Returns
{Object} Fx 实例

### Example
用法参见tween和morph中的例子


.stop()
------

停止一个动画，如动画已完成则触发'complete'事件，否则触发'stop'事件。

### Syntax

	myFx.stop();
	
### Returns
{Object} Fx 实例


.cancel()
------

取消一个动画，动画对象立即抵达动画目标状态。触发'cancel'事件。

### Syntax

	myFx.cancel();
	
### Returns
{Object} Fx 实例


.cancel()
------

取消一个动画，触发'cancel'事件。

### Syntax

	myFx.cancel();
	
### Returns
{Object} Fx 实例


.pause()
------

暂停一个动画。

### Syntax

	myFx.pause();
	
### Returns
{Object} Fx 实例

### 注意

1. 暂停的动画可通过resume方法来继续
2. 暂停的动画对start方法，将清除原有的计时器来执行新的动画


.resume()
------

继续当前暂停的动画。

### Syntax

	myFx.resume();
	
### Returns
{Object} Fx 实例





