fx/tween
======

Outline
------

- Constructor
- start
- stop
- cancel
- pause
- resume


fx/tween: Constructor
------

渐变动画，使对象的某一项CSS属性的值渐变

### Syntax

	var myFx = new Tween(element,options=);
	
### Returns
{Object} Tween 实例
	
### Arguments

#### element
{string} css选择符

#### options
{Object} 构造器的参数

**常用参数**

- property {string} 执行动画的对象属性
- duration {number=500} 动画时长（毫秒），默认值500


**其他参数**

- fps {number=60} 帧率，默认60帧/秒
- unit {string=false} 单位，默认false，可选'px', 'em', or '%'
- frames {number=null} 动画帧数，默认为根据duration和fps计算出
- frameSkip {boolean=true} 是否允许跳帧
- link {string='ignore'} 动画的连续方式 可选值为'ignore','cancel','chain'。设为'ignore'则进行中的动画对新的start事件忽视，设为'cancel'则进行中的动画立即执行新的start事件，原动画取消，设为'chain'则将新的start事件存入队列，当前进行中的动画结束后立即执行。
- transition {Object} 动画过渡效果，可以从fx/easing中选取预设的函数或自定义函数

### Example

    var myFx = new Tween($('.myDiv'), {
        property: 'height',
        duration: 1000 
    });
	
    myFx.start(100,500);


Event: start
------

动画开始时触发的事件

### callback
该事件的回调函数参数是执行动画的DOM元素

### Example

    var myFx = new Tween($('.myDiv'), {
        property: 'top',
        duration: 3000	
    }).on('start',function(){
		console.log('The animation is starting!');
	});	
	
	myFx.start(250);
	
Event: complete
------

动画完成时触发的事件

### callback
该事件的回调函数参数是执行动画的DOM元素

### Example
用法同start

Event: stop
------

动画停止且未完成时触发的事件

### callback
该事件的回调函数参数是执行动画的DOM元素

### Example
用法同start


Event: cancel
------

动画被取消时触发的事件

### callback
该事件的回调函数参数是执行动画的DOM元素

### Example
用法同start


Event: step
------

动画每一帧触发的事件

### callback
该事件的回调函数参数是动画的内部对象，其value属性值为当前帧的动画property的值

### Example
用法同start


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
    var myFx = new Tween($('.myDiv'), {
        property: 'width',
		link: 'cancel',
        duration: 500 
    });
	
    myFx.start(200);


.stop()
------

停止一个动画，如动画已完成则触发'complete'事件，否则触发'stop'事件。

### Syntax

	myFx.stop();
	
### Returns
{Object} Fx 实例

### Example
    var myFx = new Tween($('.myDiv'), {
        property: 'left',
		link: 'cancel',
        duration: 5000 
    }).on('stop',function(){
		console.log('stopped')
	});
	
	myFx.start(300);
	
    $('.btn').on('click',function(e){
		e.stop();
		myFx.stop();
	});


.cancel()
------

取消一个动画，动画对象立即抵达动画目标状态。触发'cancel'事件。

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





