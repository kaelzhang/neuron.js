io/jsonp
======

Outline
------

- Constructor
- send
- cancel


JSONP: Constructor
------

发送一个 XHR（XML Http Request）请求

### Syntax

	new JSONP(options);
	
常见的用法是：

	new JSONP(options).on(events).send();

### Returns
{Object} JSONP 实例
	
### Arguments

#### options
{Object} 构造器的参数

**常用参数**

- url {string} 请求地址
- data {(Object|string)=} JSONP 发送的query，可以为 query string 或者 object


**其他参数**

- timeout {number=0} 请求超时的时间（毫秒），若为 0，则不会超时。超时会触发 `error` 事件和 `timeout` 事件
- cache {boolean=false} 默认情况下，我们会对 jsonp 请求强制进行请求，而不允许浏览器缓存。

### Example

	new JSONP({
		url: '/blah-blah-blah.jsonp',
		data: {
			uid: 123
		}
	
	}).on({
		success: function(){
			// code...
		}
		
	}).send();


.cancel()
------

取消一个 JSONP 请求。调用这个方法，会触发 `'cancel'` 事件。

### Returns
{Object} 当前的 JSONP 实例


.send()
------

发送该 JSONP 请求

### Syntax

	.send()
	.send(data)
	
### Returns
{Object} 当前的 JSONP 实例

### Arguments

#### data
{Object=} 该 JSONP 发送的对象，该参数为可选，如果不传递，则会使用 `options.data`，若 `options.data` 未定义，则该请求不包含query


Event: success
------

JSONP 响应成功返回时触发的事件。

### callback( response, xhr )
response {Object|string} 经过 `options.santitizer` 和 `options.parser` 处理过后的响应，根据 dataType 的不同，类型会不同。若 dataType 为 `'json'`，则`response` 为 parse 之后的对象；否则，`response` 为字符串。

xhr {Object} XMLHttpRequest 对象

Event: error
------

出现错误时触发的事件。下列情况，都会触发 `'error'` 事件：

- 超时

### 特别说明
由于 JSONP 的实现方式是使用 <script> 元素将请求当做脚本来载入到页面，因此，请确保返回值严格符合 JavaScript 语法，否则将直接报错。

### callback

Event: cancel
------

JSONP 请求，被取消之后触发的事件

### callback
该事件的回调函数没有参数


