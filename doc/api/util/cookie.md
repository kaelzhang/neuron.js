util/cookie
======

Outline
------

- write
- read
- dispose


cookie: write
------

写入cookie

### Syntax

	Cookie.write(key,value,options)
	

### Returns
{Object} Cookie 实例
	
### Arguments

#### key
{string} cookie键值

#### value
{string} cookie键对应值

#### options 
{object} cookie额外参数

**参数**

- encode {string} 对cookie值进行encodeURIComponent转码，可选为 true 或者 false，默认为true

- domain {string} 同一个主机，不同域访问cookie设置，不可设置为不同的主机下的域访问，默认为false

- path {string} 可访问cookie的路径，常跟 domain 一起作用，默认为false

- duration {int} cookie过期时间，默认为false，参数的单位为天

- secure {string} 指定cookie的值通过网络是否加密在用户和WEB服务器之间传递，可选 secure 或者为false，默认为false



### Example(常用的)

假如，我们需要建立一个键值为name，值为xiao8的cookie。
	
我们可以这样来写代码：
	
	Cookie.write("name","xiao8");
	
如果这时候我们想要把name的值变成xiao9。

这时我们可以继续这样写：
	
	Cookie.write("name","xiao9");


### Example（options）

假如这种场景，我们需要建立一个cookie记录，key为name，value值为xiao10，能访问到它的地址为www.

dianping.com/test，并且10天后过期。另外我们这里的地址为test.dianping.com。这时候我们可能就需要 

domain、path 和 duration 的属性。

这时候我们可以这样写：

	Cookie.write("name",
				 "xiao10",
				 {
				 	duration:10,
				 	domain:"www.dianping.com",
				 	path:"/test"
				 }
	);
	
	
注:cookie只能在同一个主机下访问，其他主机无法访问该主机任何域下的cookie值，即使domain中设置的主机不

为该主机。

cookie: read
------

读取cookie值

### Syntax

	Cookie.read(key)
	

### Returns
{string} Cookie 键值key所对应的值
	
### Arguments

#### key
{string} cookie键值



### Example

如果我们需要读取一个键值为name的值
	
我们可以这样来写代码：
	
	Cookie.read("name");

cookie: dispose
------

销毁cookie值

### Syntax

	Cookie.dispose(key)
	

### Returns
{string} Cookie 键值key所对应的一条记录
	
### Arguments

#### key
{string} cookie键值


### Example

如果我们需要销毁一个键值为name的cookie记录
	
我们可以这样来写代码：
	
	Cookie.dispose("name");


