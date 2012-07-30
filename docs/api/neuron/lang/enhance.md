neuron/lang/enhance
===================

这里包含如下的内容：

- 常用，但ECMA标准中没有包含的方法
- ECMA标准中包含，但现阶段使用老的JavaScript特性无法完美实现，只能降级使用的方法
- 框架中与ECMA定义稍微不同的方法


DP.mix
----
***
### 语法
	DP.mix(receiver, sender, override, copylist)
	
### 返回值
{Object} mix 之后的 receiver 引用

### 参数

#### receiver
{Object} mix 操作的接收者

#### sender
{Object} mix 操作的发送者

#### override
{boolean} 如果 receiver 上已经存在某 key，是否要使用 sender 上的对应key，覆盖 receiver 上的值。默认为 false

#### copylist
{Array.<string>} 仅将 copylist 中的 key mix到 receiver 上


DP.guid
----
***
### 返回值
{number} 全局的唯一id值


DP.each
----
与 for-in 不同，DP.each 不会遍历原型中的属性。

### 语法
	DP.each(obj, fn, context)
	
### 参数

#### obj
{Object|Array} 需要遍历的对象，

- {Object} 遍历非原型上的属性
- {Array} 简单的数组遍历

#### fn
{function(value, key)} 回调函数

##### value
{mixed} 遍历的值

##### key
{number|string} 数组下标（如果obj为对象） / 属性名（如果obj为数组）


DP.clone
----
***
创建一个 shadow copy

### 语法
	DP.clone(obj, filter)
	
### 参数

#### obj
{Object} 被 clone 的对象

#### filter
{function(value, key, depth)} 过滤函数

##### value
{mixed} 当前复制的属性的值

##### key
{string} 当前复制的 key

##### depth
{number} 当前复制的属性，位于原始对象的深度。初始从 1 开始


DP.bind
----
***
绑定一个函数的上下文

### 语法
	DP.bind(fn, bind)
	
### 返回值
{function()} 绑定后的函数

### 参数(模式一)

#### fn
{function()} 需要绑定的函数

#### bind
{Object} fn 需要被绑定的 this

### 参数(模式二)

#### fn
{string} 需要绑定的函数，对应的属性名

#### bind
{Object} 对应的对象


DP.makeArray
----
****
将目标包装，转化成数组

### 语法
	DP.makeArray(array, host)
	
### 返回
{Array} 包装或者转化为的数组

### 参数

	

