NR.define
====

定义一个模块。


### 语法

	// 包含三种重载方式
	NR.define(factory);
	NR.define(dependencies, factory);
	NR.define(exports);
	

### 返回值
{undefined}


### 参数

#### factory
{function(D, require, exports)} 模块的工厂函数，用于创建该模块的 API。


#### dependencies
{Array.\<string\>} 该模块的依赖项的数组，依赖项是字符串（依赖项的 identifier），若为空数组，则表明该模块没有依赖


#### exports
{Object} 该模块的 API，这种情况下，表明该模块是一个简单的模块，仅包含多个互相独立的工具方法。



工厂函数 factory 说明
----

### 语法

	// 1
	function(D, require){
		var Ajax = require('io/ajax');
		
		return {
			method: function(){
				// ...
			}
		};
	};
	
	// 2
	function(D, require, exports){
		var Ajax = require('io/ajax');
		
		exports.method = function(){
			// ...
		}
	};

### 返回值
{function()|Object} factory 的返回值，即为当前模块的 API。

- 若 factory 没有返回值，或返回值为非真，则当前模块的 API 会默认为 exports（见下面的参数）;
- exports 默认为 {};

### 参数

#### D
{Object} 即 NR 的引用

#### require(dependency)
获取依赖项的 API

##### 返回值
{function()|Object} 模块标识为dependency 的模块的的 API

##### 参数
dependency {string} 需要获取的模块的 identifier

#### exports
{Object} 它是 neuron loader 注入到工厂函数中的一个对象，若工厂函数没有返回值，exports 就会作为该模块的 API，因此工厂函数中可以通过向 exports 中添加属性来为模块添加 API。


重载说明
----

a >. 模块不包含依赖，指定工厂函数

	NR.define(factory);
	
**特别说明** 

1. **目前**上面这种方式，如果在 factory 中尝试使用 require 来获取依赖项的 API，则可能发生模块获取不到的异常，这是因为现阶段从性能上考虑，loader 并没有主动去尝试分析依赖。
	
b >. 模块不包含依赖，直接指定模块的 API
	
	NR.define(exports);
	
c >. 指定包含依赖（或显式指定不包含依赖），指定工厂函数
	
	NR.define(dependencies, factory);


代码示例
----

请直接参见 neuron 项目中 lib/ 文件夹中的代码。

