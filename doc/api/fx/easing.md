fx/easing
======
返回包含一些预设的缓动方程的对象,除Easing.linear函数外都包含了easeIn（缓入），easeOut（缓出），easeInOut（缓入缓出）的效果。使用前需要require('fx/easing')。[缓动方程的参考文章](http://www.chipwreck.de/blog/2010/02/17/mootools-transitions-explained/)

### Returns
{Object} Easing 实例

### Methods

- linear 线性

### Example
    
    var Easing = require('fx/easing');

    var myFx = new Tween($('myDiv'), {
        property: 'height',
        duration: 1000,
		transition: Easing.linear
    });
	
	myFx.start(300);
	
- Pow 幂
	
### Example
    
    var Easing = require('fx/easing');

    var myFx = new Tween($('myDiv'), {
        property: 'height',
        duration: 1000,
		transition: Easing.Pow.easeIn
    });
	
	myFx.start(300);
	
- Expo 指数
	
### Example
    
    var Easing = require('fx/easing');

    var myFx = new Tween($('myDiv'), {
        property: 'height',
        duration: 1000,
		transition: Easing.Expo.easeOut
    });

	myFx.start(300);
	
- Circ 圆形
	
### Example
    
    var Easing = require('fx/easing');

    var myFx = new Tween($('myDiv'), {
        property: 'height',
        duration: 1000,
		transition: Easing.Circ.easeOut
    });

	myFx.start(300);
	
- Sine 正弦

- Back 先退后进

- Bounce 弹跳

- Elastic 松紧

- Quad 二次方

- Cubic 三次方

- Quart 四次方

- Quint 五次方

