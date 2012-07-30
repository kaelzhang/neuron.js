DP.provide
====

动态加载一个或多个模块；或当这些模块加载完成后，使用他们完成既定的事情。

### Syntax

	DP.provide(module, callback);
	DP.provide(modules, callback);
	
因此，如下的代码都是合法的：

	DP.provide('io/ajax', function(){ ... });
	DP.provide(['io/ajax'], function(){ ... });
	DP.provide(['io/ajax', 'switch/core'], function(){ ... });
	
### Returns
{undefined}

### Arguments

#### module
{string} 需要加载模块的 identifier

#### modules
{Array.<string>} 需要加载的模块的 identifier 的数组

#### callback
{function(D, moduleExports1, moduleExports2, ...)} 当模块（或多个模块都）加载完成之后，执行的回调函数


回调函数 callback 说明
----

### Arguments

#### D
{Object} DP 对象的引用

#### moduleExports
{function()|Object} callback 从第二个开始的参数，为 `DP.provide` 第一个参数中所包含的模块。

比如，有如下的代码

	DP.provide(['io/ajax', 'util/cookie'], function(D, Ajax, Cookie){
	});
	
那么，Ajax 为前面 'io/ajax' 对应的模块的 API， Cookie 为 'util/cookie' 的 API;


特别说明
----

请特别注意，`DP.provide` 是一个 **异步** 调用的过程，因此第二次调用 `DP.provide` 的时候无法保证第一个 callback 已经完成了。

因此，如下的代码是 **错误** 的：

	var Module1;
	
	DP.provide(['test/module1'], function(D, M1){
		Module1 = M1;
	});
	
	DP.provide(['test/module2'], function(D, M2){
	
		// 错误！！！在这个位置，无法保证 'test/module1' 模块已经加载完成
		// 这个地方，Module1 的值可能为 undefined
		new Module1(); 
		new M2();
	});
	
上面的代码可以修改为：

	DP.provide(['test/module1', 'test/module2'], function(D, M1, M2){
		new M1();
		new M2();
	});



代码示例
----

假若，我们需要在页面中调用 ajax 

	DP.provide('io/ajax', function(D, Ajax){
		new Ajax({
			url: 'abc.php'
		}).on({
			success: function(){
				// ...
			}
		}).send();
	});
