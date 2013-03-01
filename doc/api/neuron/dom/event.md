Neuron: DOM/event
====
Neuron 的事件绑定不支持 namespace

Outline
----
- on
- off
- NR.ready


本文档参数
----
#### type
{string} 需要绑定的事件的类型，如 "click", "mouseenter" 等

#### selector
{string} css选择符

#### handler
{function()} 事件的回调函数

#### typeMap
{Object} 包含多个 \<type: handler\> 的对象。

.on(type [, selector], handler)
----
绑定一个事件或事件代理

### Syntax
	
	.on(type, handler);
	.on(type, selector, handler);

### Returns
{NR.DOM} 原 Neuron DOM 对象
	
### Usage
若传递了 `selector` 参数，则会进行事件代理

### Example

html

	<div id="container">
		<a href="javascript:" class="trigger-1 trigger"></a>
		<a href="javascript:" class="trigger-2 trigger"></a>
	</div>
	
javascript

	// 为 #container .trigger-1 元素绑定一个 click 事件
	NR.DOM('#container .trigger-1').on('click', function(e){
		e.preventDefault();
		// do something...
	});

	// 为 #container 中所有的 .trigger 代理 click 事件
	NR.DOM('#container').on('click', '.trigger', function(e){
		e.preventDefault();
		// do something...
	});

.on(typeMap [, selector] )
----
为当前的集合绑定同时绑定多个事件

### Returns
{NR.DOM} 原 Neuron DOM 对象

### Example
	
	NR.DOM('#container').on({
		click: function(e){
			// code ...
		},
		
		mouseenter: function(e){
			// code ...
		}
	});
	
.off(type [, selector], handler)
----
为当前集合中的每个元素，移除一个**满足条件的**事件或事件代理

### Syntax

	.off(type, handler)
	.off(type, selector, handler)
	.off(type, '**', handler)
	
### 特别说明
1. 被移除的事件，必须同时匹配 `type`, `selector`(若被定义), 且 handler 是该事件回调的**引用**，具体见 #Example-1

2. 若未传递 `selector`，则不会移除非事件代理事件，具体见 #Example-2

3. 若 `selector` 为 `"**"`，则会匹配每个元素中，事件类型为 `type` 的所有 selector

### Example-1

html

	<div class="#container">
		<div class="item"></div>
		<div class="item"></div>
		<div class="box"></div>
		<div class="box"></div>
		<div class="box"></div>
	</div>
	
javascript（注：不同的代码段之间没有关联）
	
不正常的使用方式：	

	NR.DOM('#container')
		.on('mouseenter', function(){
			console.log('mouseenter');
		})
		
		// 由于 .on() 方法的返回值为当前的 Neuron DOM 对象，
		// 因此可以使用链式操作
		// 请特别注意，这里没有移除任何事件，为什么？
		.off('mouseenter', function(){
			console.log('mouseenter');
		});
		
不正常的使用方式：

	var handler = function(){
		console.log('mouseenter')
	};
	
	NR.DOM('#container')
		.on('mouseenter', '.item', handler)
		
		// 实际上，这里没有移除任何事件，因为 selector 不匹配
		.off('mouseenter', '.box', handler)
		
正常的使用方式：
	
	var handler = function(){
		console.log('mouseenter')
	};
	
	NR.DOM('#container')
		.on('mouseenter', handler)
		.off('mouseenter', handler) // 事件被成功移除
		.on('mouseenter', '.item', handler)
		.off('mouseenter', '.item', handler); // 事件代理被成功移除
	


.off(type [, selector])
----
移除所有类型为 `type` 的事件；

若传递了 selector 参数，则会移除所有类型为 `type`，代理给CSS选择符为 `selector` 的所有事件。

.off()
----
若 `.off()` 方法没有传递任何参数，则移除所有事件和所有事件代理，**请谨慎使用**。


.off(typeMap [, selector])
----
为当前集合中的每个元素，移除多个事件或事件代理。


NR.ready(callback)
----
注册一个回调函数，它会在页面 domready 的时候触发。若调用该方法的时候，页面的 domready 已经触发过，则该回调会立即执行。

# 特别说明

- domready 是页面中所有的 DOM 元素都可以被安全操作的标志，这个时候：
	- 页面中所有同步载入的元素，都可以被正常获取到
	- 你可以安全地对元素进行修改、遍历、和移动操作
	
- 若 domready 与 `window` 的 "load" 事件被同时 事件一定会在 之后触发；
- 使用 `NR.ready()`注册的回调函数，会在触发后被自动释放。





