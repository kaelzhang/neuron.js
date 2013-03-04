io/jsonp
======

Outline
------

- Constructor
- send
- cancel


Ajax: Constructor
------

发送一个 XHR（XML Http Request）请求

### Syntax

	new JSONP(options);
	
常见的用法是：

	new JSONP(options).on(events).send();

### Returns
{Object} Ajax 实例
	
### Arguments

#### options
{Object} 构造器的参数

**常用参数**

- url {string} 请求地址
- data {(Object|string)=} ajax 发送的query，可以为 query string 或者 object

**高级参数**

- isSuccess {function(response)} 该方法接受 `response` 作为参数，用于在业务中判断本次请求是否成功，默认情况下，该方法永远返回真。以 **点评** 的业务情况为例，我们经常需要处理 code: 200 作为成功响应，这个时候，在 `'success'` 和 `'error'` 的事件中都需要去处理失败的情况，对于这种场景，使用这个参数，就可以将 	`code` 不为 200 的情况从成功事件的回调中移除，使逻辑变得清晰。

**其他参数**

- timeout {number=0} 请求超时的时间（毫秒），若为 0，则不会超时。
- headers {Object=} 自定义请求头，但是最终的请求头可能会受到其他参数的影响，部分属性会被覆盖
- cache {boolean=false} 默认情况下，我们会对 `'GET'` 类的 Ajax 请求强制进行请求，而不允许浏览器缓存。

### Example(options.isSuccess)

假如，在业务场景中，我们将 response.code 不为 200 的情况都认为是错误。
	
我们可以这样来写代码：
	
	new Ajax({
		url: '/ajax/json/blahblahblah',
		data: {}
		
	}).on({
		success: function(json){
			if(json && json.code === 200){
				// do the right thing...
			}else{
				// something wroing
			}
		},
		error: function(){
			// something wrong...
		}
	}).send();
	
可以看到，上面的代码中，错误处理我们写了两次。其实我们可以用下面的代码让逻辑更加清晰：
	
	new Ajax({
		url: '/ajax/json/blahblahblah',
		data: {},
		isSuccess: function(response){
			return !!response && response.code === 200;
		}
	}).on({
		success: function(json){
			// do the right thing...
		},
		error: function(){
			// something wrong...
		}
	}).send();
	
### Example(options.santitizer)

假若，我们要求，服务器端一定要使用 JSON 格式的返回值。但是残酷的现实是，后端响应为：

	{'code': 200, 'msg': 'success!'}
	
这个响应根本不是 JSON（JSON应当使用双引号），会引起 JSON.parse 出错。而且那个肇事者可怜巴巴的告诉你，这次上线可能来不及改了。Oh, shit！

但是不用怕，我们可以用下面的代码：

	new Ajax({
		url: '/blahblah',
		santitizer: function(response){
			// 其实这里进行简单的替换并不靠谱（为什么？），
			// 这里只是为了说明用法，对替换规则进行了简化
			return response.replace(/'/g, '"');
		}
	}).on({
		success: function(){
			// ...
		}
	}).send();

.cancel()
------

取消一个 Ajax 请求。调用这个方法，会触发 `'cancel'` 事件。

### Returns
{Object} 当前的 Ajax 实例


.send()
------

发送该 Ajax 请求

### Syntax

	.send()
	.send(data)
	
### Returns
{Object} 当前的 Ajax 实例

### Arguments

#### data
{(Object|string)=} 该 Ajax 发送的query，该参数为可选，如果不传递，则会使用 `options.data`，若 `options.data` 未定义，则该请求不包含query


Event: success
------

Ajax 响应成功返回时触发的事件。

### callback( response, xhr )
response {Object|string} 经过 `options.santitizer` 和 `options.parser` 处理过后的响应，根据 dataType 的不同，类型会不同。若 dataType 为 `'json'`，则`response` 为 parse 之后的对象；否则，`response` 为字符串。

xhr {Object} XMLHttpRequest 对象

Event: error
------

出现错误时触发的事件。下列情况，都会触发 `'error'` 事件：

- `options.isXHRSuccess` 返回值为非真，默认情况下，若 http status 不在 [200, 300) 范围内即会触发错误事件。
- `options.isSuccess` 返回值为非真
- 若 dataType 为 json，当 responseText 不是一个标准的 json 格式，无法转化成 JavaScript 对象的时候。

### callback

Event: cancel
------

Ajax 请求，被取消之后触发的事件

### callback
该事件的回调函数没有参数


