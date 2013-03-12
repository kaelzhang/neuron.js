Neuron lib: switch/core
====
Switch 组件

Outline
----
- Switch: Constructor
- plugin()
- on()
- init()
- Events
- 插件说明
- Examples
- 开发者说明


哪些交互效果可以使用 Switch 组件？
----
- 幻灯片：左右，上下滑动切换，或者淡入淡出切换
- 手风琴效果
- Tab切换


基本HTML结构
----

一个轮播的基本结构至少包含：

- 放置切换内容元素的容器（container）

可能包含：

- 分页控制器 （page）

- 前进后退控制 （nav）

假若需要做左右滑动效果，内容元素的容器中，container 还必须为一个**轨道**

- **一个能够滑动的轨道**

一个典型滑动效果的轮播结构：

	div #J_switcher
	    div .wrap
	        ul .container
	            li .item
	            li .item
	            li .item
	       
	    div .pages
	        a .page
	        a .page
	        a .page
	
	    a .prev
	    a .next


Switch: Constructor
----

### Syntax

	new Switch().plugin(plugin, plugin, ...).init(options)
	
我们可以为轮播组件动态加载很多有用的插件，并且根据不同的业务情况，定义不同的初始化参数，下面说明 Switch 组件如何配置：


.plugin()
----
该方法用于为当前的实例动态加载插件，它可以接受多个参数，也就是说，你可以同时为你的轮播实例增加多个插件。

### Example

比如我们需要一个能够自动播放，并且能够无限轮播下去的幻灯片，可以这么写：

	new Switch().plugin('carousel', 'endless', 'autoplay');

对于一个简单的tab切换，我们可以写：

	new Switch().plugin('tabswitch');


.on()
----
`Switch` 实现了 NR.Class.Ext.attrs 的 "接口"，因此可以进行事件的注册，语法请参见 api/neuron/oop/events.md


.init(options)
----
只有当这个方法执行时，轮播才会真正开始，并且这里需要为当前的业务场景配置相应的参数，比如css选择符，轮播速度等参数。

这里的参数，是所有情况下都可以定义的公用参数。

**当加载插件之后，会增加新的选项。** 详细情况请见各个插件说明。

### Options
基础参数是所有的情况下，都可以配置的参数（若为可选参数，下面会特别说明），
有以下选项：

#### CSpre
{string=""} 
当前轮播模块中，其他所有选择符的前缀。
比如一个轮播模块，有如下选择符：
    
- 容器： ＃my-switcher .wrap
- 轮播的元素：    ＃my-switcher .item

那么就可以设置

	CSpre: '#my-switcher'

后面其他的选择符，就可以省略 '#my-switcher'

	containerCS: '.wrap'
	itemCS: '.item'


#### containerCS
{string}
容器的CSS Selector(简称 CS 下同)，该容器必须是直接包裹多个轮播元素的容器，比如上面例子中的 .wrap

#### itemCS
{string} 
轮播元素的CS

#### triggerCS
{string}
分页触发器的CS，如果没有，则不设置

#### nextCS
{string=} “下一个”的触发器的CS，如果没有，则不设置

#### prevCS
{string=} “上一个”的触发器的CS，如果没有，则不设置

#### itemOnCls
{string=} 当某一个轮播元素触发时，需要加上去的class；当它不再激活时，该class会被移除

#### triggerOnCls
{string=} 当某一个触发器触发时，需要加上去的class；当它不再是激活状态时，该class会被移除

#### activeIndex
{int=0} 初始状态激活的页码（减去1）

#### stage
{int=1} 定义舞台的大小，就是可视范围内，包含的元素个数。

#### move
{int=1} 定义每一次轮播，需要切换的元素个数

#### triggerType
{string="click"} 触发控制器的事件，默认效果是鼠标点击，这里可以定义为其他效果:

    'mouseenter'：鼠标进入控制器时触发
    'mouseleave'：鼠标离开控制器时触发
	
	

Events
----
### Event: beforeInit
轮播组件内部，在插件加载完成后，数据初始化之前触发的事件

### Event: afterInit
数据初始化之后触发的事件

### Event: beforeSwitch
在一次轮播开始前触发的事件，如果用户的某一次行为无法触发一次成功的轮播，则该事件不会触发。

### Event: switching
轮播中触发的事件。

大多数情况下，这个事件用于扩展轮播的特效，默认情况下，轮播中什么效果都不会做。

### Event: completeSwitch
一次轮播结束后立即触发的事件

### Event: navDisable
当导航被禁用时触发的事件，当在某些情况下，轮播到最后一张或者第一张的时候，向后或者向后的导航将被禁用，这个时候会触发该事件。

### Event: navEnable
导航被激活时触发的事件。


插件说明
----

### 可选插件
- carousel
- accordion
- autoplay
- endless
- fade
- lazyload
- step
- tabswitch

### 说明
当加载一个插件后，当前的 switch 实例会包含该插件的事件和选项。


Examples
----
以上面的 HTML 例子，如果要初始化一个滑动效果的自动轮播，可以有如下的代码：

	new Switch().plugin('carousel', 'autoplay').init({
		CSPre: '#J_switcher',
		containerCS: '.container',
		itemCS: 'li',
		triggerCS: '.page',
		nextCS: '.next',
		prevCS: '.prev'
	});


开发者说明
----