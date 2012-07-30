Neuron Loader API
====

Outline
----

- DP.define
- DP.provide	
- DP.require


DP.define
----
见 module-defining.md


DP.provide
----
见 module-providing.md


DP.require
----
加载一个页面级别业务模块（门面模块），并执行该模块的 init 方法。
请参见 identifier.md 中的相对定义。


### Syntax

	DP.require(moduleIdentifier [, moduleIdentifier [, ...]]);
	DP.require(moduleData [, moduleData [, ...]]);
	
	DP.require([moduleIdentifier || moduleData]{1, });
	
### Returns
{undefined}

### Arguments

#### moduleIdentifier
{string} 需要加载业务模块标识

#### moduleData
{
	mod: {string} 需要加载业务模块标识
	config: {Object=} 模块的初始化配置，它会当作该模块的 init 方法的参数。
}

### Example

	// 使用这种方式，则 config 为 undefined
	DP.require('promo::index');
	
或者

	DP.require({
		mod: 'promo::index',
		config: {}
	});



### 说明
使用 `DP.require` 载入的模块，需要包含名为 init 的方法，否则将不会产生任何效果。


### 用法及场景

`DP.require` 最大的作用在于，将业务模块的初始化进行有效的封装（[Facade](http://en.wikipedia.org/wiki/Facade_pattern)）。并为前后端进行页面元素的模块化，提供配置映射的可能。

##### 入口
在每个 App 根部（见 identifier.md ）的文件，都是页面级别的模块文件。这些模块仅包含一个叫做 init 的方法。我们就是通过这样的模块文件，来将页面中多个初始化逻辑集合起来，为后端程序提供一个友好而简单的 **入口**。

##### 规则映射
对于复杂的页面，根据不同的数据情况，页面中不同的元素，可能会遵循规则引擎进行排列组合。这种情况下，我们可以将页面分成多个 pagelet，每个 pagelet 都对应一个门面模块（facade module）。

但是这种划分，我们希望是必要的。如果后端对页面进行了这样有效的切分，并且很好的模块化，那么我们也可以做相对应的划分。否则就没有这个必要。不希望大家在使用 Neuron 框架的时候，过度的使用这种设计模式。

**举一个例子：**

假若，

商户的首页中有 A，B，C，D 四个 pagelet，并且后端程序也进行了这样的划分，在某一种情况下，规则引擎告诉前台程序，需要输出 A，B，D 三个模块。

因此，我们对应这 4 个 pagelet，也创建 4 个门面模块，分别为 `'shop::main/a'`，`'shop::main/b'`，`'shop::main/c'`，`'shop::main/d'`（这里是为了举例的方便，使用了 abcd 的例子，请实际开发中，避免这样的命名）。

那么，我们在前后端建立一个 *后端模块 -> 前端模块* 的映射，那么后端的前台程序仅需要在页面中输出如下的 JavaScript 代码，

	DP.require(
		'shop::main/a', 
		'shop::main/b', {
			mod: 'shop::main/d',
			config: {
				shopId: 500000,
				abtest: 'a'
			}
		}
	);

就可以完成页面所有的初始化。



