模块名（特性名）
=======

- 开头处书写模块名，若一个大模块为了检索方便，按照特性拆分为多个文档，则在括号中予以说明
- 在文件的顶部填写对该md文档必要的说明。
- 每个文档顶部需有"概览"，描述该文档包含的函数。
- 参数列表及返回值若为空则可以不填写。保持简单。
- 参数部分说明承诺接受的参数类型，基本类型首字母小写，其他类型首字母大写。
- 标题格式
	- 文档中模块的实例的方法直接写函数名加括号，如 `read()`，就表示它是一个实例方法
		- 若该方法可能包含参数，则括号中包含参数名，如 `send(data)`;
		- 若该方法的参数为可选，则在参数名后加上 `=` 号，如 `send(data=)`;
		- 若该方法的参数有默认值，可在参数后加上 `=<default-value>`，如 `remove(destroy=true)`;
		- 有多个参数，用逗号（`,`）隔开;
		- 若该方法包含多种重载，可分为多个标题来书写 ———— 或者不写参数，在 Syntax 中进行描述。
	- 静态函数写作 \<namespace>.<function-name>，如 Cookie.read()；
	- 构造器做特殊对待，写作 ClassName: Constructor；
	- 事件写做 Event: <event-name>。
	
- 更多具体格式做法参照下文。

Outline
------

- Constructor
- Cookie.read
- read

Cookie: Constructor
---------
****
方法的简介

### Syntax（此处列出最基本的用法，重载情况）

	new Cookie(arg, callback, options)
	
### Returns
{string} 返回值的说明

### Arguments

#### arg
{boolean|string} 对参数 `arg` 的说明

#### callback
参数是函数的情况

{function(event)}

#### options
{Object} 对参数 `options` 的说明

- type {string} 对于 `options.type` 的说明
- holder {DOM|string} 对于 `options.holder` 的说明


### Example

1. 示例1（若模块与html结构相关，建议以一下方式说明）

	html
		
		<div>...</div>	
	
	javascript
		
		new Func(...)	
	
	result

		<div a="bcd">...</div>

2. 示例2（若为纯js，可以直接以注释方式写出返回结果）

	new Func(...) // result


### 注意

1. 注意点1
2. 注意点2

Event: someEvent
----
****
对名为 `'someEvent'` 的事件进行的描述。


Cookie.read()
----
****
这是一个静态方法
### Syntax
### Example
...


read()
----
****
这是一个实例方法。

以下略