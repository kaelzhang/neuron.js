NR.require
====

NR.require 常用于调用业务的门面（facade）组件，这些组件，必须包含一个叫做 `init` 的 API（否则这些组件不会被调用）。

NR.require 会在组件加载完毕并初始化结束后，调用该模块的 `init` 方法。

Syntax
----

### Overload

	// 1
	NR.require(moduleIdentifier);
	
	// 2
	NR.require({
		mod: moduleIdentifier
	});
	
	// 3
	NR.require({
		mod: moduleIdentifier,
		config: moduleConfiguration
	});
	
	// 其中，1 和 2 是完全等价的。

以上代码的作用是，加载 `moduleIdentifier` 模块到页面中，分析并加载该模块的依赖，初始化模块，并执行该模块的 `init` 方法。若指定了 `moduleConfiguration`，则它会作为 `init` 的参数。

	
### Arguments

#### moduleIdentifier
{string} 模块标识，参见 identifier.md。

#### moduleConfiguration
{Object=} 模块的参数，这些参数会作为 `init` 方法的参数。


使用说明
----
以下均以 [优惠券首页](http://www.dianping.com/shanghai) 为例，但仅仅说明整体上的概念，细节上的实现及代码示例**可能与实际不同**，请注意。

### 使用场景

在一个业务的场景中，通常存在大量的初始化，及其他业务逻辑，这个会给调用者造成困难。

#### 以优惠券首页为例


这个页面中包含至少如下业务模块：
	
- 至少3个的大型轮播（每个轮播中还包含手风琴效果）、标签切换
- 邮件订阅
- 用户地址设置

他们的特点是：

- 包含大量的业务初始化参数
- 许多模块比较类似，但各有不同，抽象出来的价值不大

如果我们不将他们封装为一个门面（是否应该封装为多个门面，这要根据业务的复杂程度，以及业务是否存在条件组合来决定的，这里我们暂且将优惠券首页整体包装成一个门面模块 `'promo::index'`），则会有大量的业务代码出现在页面中。

业务代码出现在页面中（即不使用门面），存在以下弊端：

- 从设计上来说，是实现没有分离。
- 就实际场景来讲，若仅有 JavaScript 逻辑修改，则需要后端 War 包也上线。
- 不利于接口的定义，因为大量的前后端配置参数都散布在代码片段中，没有统一的入口。

### 门面文件说明

对于上面的情况，我们可能会有如下的代码：
	
`promo::index` 的代码：
	
	// 事实上，门面模块没有真正的依赖
	// 所谓依赖，应该是存在逻辑上的调用需求和功能需求
	NR.define(function(NR, require, exports){
		function main(){
			NR.provide('promo::switch', function(Switch){
				// ...
			});
			
			NR.provide('promo::subscribe', function(Sub){
				// ...
			});
			
			NR.provide('promo::user-location', function(Loc){
				// ...
			});
		}
		
		// API 中必须包含一个名为 `init` 的方法
		exports.init = main;
	});
	
#### 代码说明

1. 门面文件中，一般不包含静态的依赖，即 `NR.define` 中不定义依赖项
2. 事实上，'promo::index' 对 'promo::switch' 并不存在逻辑上的依赖关系，只是目前的业务需求中，优惠券首页有这样一个模块而已。
3. `promo::index` 的作用在于，简化页面入口的调用。
